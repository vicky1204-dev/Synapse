/**
 * Authentication service.
 *
 * Handles user registration, login, token generation, and token validation.
 * Passwords are hashed using bcrypt; tokens are signed using JWT.
 */

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { env } from "../../config/env";
import { User } from "../users/user.model";
import { RefreshToken } from "./refresh-token.model";
import type {
  RegisterDto,
  LoginDto,
  AuthResponse,
  UserResponse,
  IUser,
} from "./auth.types";
import {
  UnauthorizedError,
  ConflictError,
} from "../../middleware/error-handler";
import { logger } from "../../lib/logger";

// ---------------------------------------------------------------------------
// Password hashing
// ---------------------------------------------------------------------------

const SALT_ROUNDS = 10;

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// ---------------------------------------------------------------------------
// Token generation
// ---------------------------------------------------------------------------

interface AccessTokenPayload {
  userId: string;
  email: string;
}

interface RefreshTokenPayload {
  userId: string;
  tokenId: string;
}

function generateAccessToken(userId: string, email: string): string {
  const payload: AccessTokenPayload = { userId, email };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY,
  } as jwt.SignOptions);
}

function generateRefreshToken(userId: string, tokenId: string): string {
  const payload: RefreshTokenPayload = { userId, tokenId };
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY,
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  try {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as AccessTokenPayload;
  } catch {
    throw new UnauthorizedError(
      "Invalid or expired access token",
      "TOKEN_INVALID",
    );
  }
}

function verifyRefreshToken(token: string): RefreshTokenPayload {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as RefreshTokenPayload;
  } catch {
    throw new UnauthorizedError(
      "Invalid or expired refresh token",
      "TOKEN_INVALID",
    );
  }
}

// ---------------------------------------------------------------------------
// User mapping
// ---------------------------------------------------------------------------

export function mapUserToResponse(user: IUser): UserResponse {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    avatarUrl: user.avatarUrl,
    onboardingStatus: user.onboardingStatus,
    academicProfile: user.academicProfile,
    onboardingGoals: user.onboardingGoals ?? [],
    subjectIds: (user.subjectIds ?? []).map((id) => id.toString()),
    preferences: user.preferences ?? {},
    createdAt: user.createdAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Service functions
// ---------------------------------------------------------------------------

export async function register(dto: RegisterDto): Promise<AuthResponse> {
  // Check if user already exists
  const existingUser = await User.findOne({ email: dto.email });
  if (existingUser) {
    throw new ConflictError("Email already registered", "EMAIL_ALREADY_EXISTS");
  }

  // Hash password
  const passwordHash = await hashPassword(dto.password);

  // Create user
  const user = await User.create({
    email: dto.email,
    passwordHash,
    name: dto.name,
    onboardingStatus: "pending",
    preferences: {},
  });

  logger.info({
    message: "User registered",
    userId: user._id.toString(),
    email: user.email,
  });

  // Generate tokens
  const tokenId = new Types.ObjectId();
  const accessToken = generateAccessToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(
    user._id.toString(),
    tokenId.toString(),
  );

  // Store the refresh token
  await RefreshToken.create({
    _id: tokenId,
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return {
    user: mapUserToResponse(user),
    accessToken,
    refreshToken,
  };
}

export async function login(dto: LoginDto): Promise<AuthResponse> {
  // Find user with password hash
  const user = await User.findOne({ email: dto.email }).select("+passwordHash");
  if (!user) {
    throw new UnauthorizedError(
      "Invalid email or password",
      "INVALID_CREDENTIALS",
    );
  }

  // Verify password
  const isValidPassword = await verifyPassword(dto.password, user.passwordHash);
  if (!isValidPassword) {
    throw new UnauthorizedError(
      "Invalid email or password",
      "INVALID_CREDENTIALS",
    );
  }

  logger.info({
    message: "User logged in",
    userId: user._id.toString(),
    email: user.email,
  });

  // Generate tokens
  const tokenId = new Types.ObjectId();
  const accessToken = generateAccessToken(user._id.toString(), user.email);
  const refreshToken = generateRefreshToken(
    user._id.toString(),
    tokenId.toString(),
  );

  // Store the refresh token
  await RefreshToken.create({
    _id: tokenId,
    userId: user._id,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  return {
    user: mapUserToResponse(user),
    accessToken,
    refreshToken,
  };
}

export async function refresh(token: string): Promise<AuthResponse> {
  // Verify refresh token
  const payload = verifyRefreshToken(token);

  // Find and validate stored token
  const storedToken = await RefreshToken.findOne({
    _id: payload.tokenId,
    token,
  });

  if (!storedToken) {
    throw new UnauthorizedError("Invalid refresh token", "TOKEN_INVALID");
  }

  if (storedToken.expiresAt < new Date()) {
    await RefreshToken.deleteOne({ _id: storedToken._id });
    throw new UnauthorizedError("Refresh token expired", "TOKEN_EXPIRED");
  }

  // Get user
  const user = await User.findById(payload.userId);
  if (!user) {
    throw new UnauthorizedError("User not found", "USER_NOT_FOUND");
  }

  // Rotate refresh token (delete old, create new)
  await RefreshToken.deleteOne({ _id: storedToken._id });

  const tokenId = new Types.ObjectId();
  const newAccessToken = generateAccessToken(user._id.toString(), user.email);
  const newRefreshToken = generateRefreshToken(
    user._id.toString(),
    tokenId.toString(),
  );

  // Store the new refresh token
  await RefreshToken.create({
    _id: tokenId,
    userId: user._id,
    token: newRefreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
  });

  logger.info({
    message: "Token refreshed",
    userId: user._id.toString(),
  });

  return {
    user: mapUserToResponse(user),
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
}

export async function logout(refreshToken: string): Promise<void> {
  // Verify and delete refresh token
  const payload = verifyRefreshToken(refreshToken);

  await RefreshToken.deleteOne({
    _id: payload.tokenId,
    token: refreshToken,
  });

  logger.info({
    message: "User logged out",
    userId: payload.userId,
  });
}

export async function getAuthenticatedUser(
  userId: string,
): Promise<UserResponse> {
  const user = await User.findById(userId);
  if (!user) {
    throw new UnauthorizedError("User not found", "USER_NOT_FOUND");
  }

  return mapUserToResponse(user);
}
