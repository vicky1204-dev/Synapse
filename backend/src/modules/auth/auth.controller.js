import { User } from "../users/User.model.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { logger } from "../../utils/logger.util.js";
import { RefreshToken } from "./RefreshToken.model.js";
import { generateTokens } from "../../utils/generateToken.util.js";
import { validateLogin, validateRegistration } from "./auth.validator.js";

const userSignup = asyncHandler(async (req, res) => {
  logger.info("User registration endpoint hit");

  const { error } = validateRegistration(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res
      .status(400)
      .json(new ApiResponse(400, {}, error.details[0].message));
  }

  const { username, email, password, avatar, department, skills } = req.body;
  let user = await User.findOne({ $or: [{ username }, { email }] });
  if (user) {
    logger.warn("User already exists");
    return res
      .status(400)
      .json(new ApiResponse(400, {}, "User already exists"));
  }

  user = await User.create({
    username,
    email,
    password,
    avatar,
    department,
    skills,
  });

  logger.info("User created successfully");
  const { accessToken, refreshToken } = await generateTokens(user);

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        {
          user: { id: user._id, email, username, avatar },
          accessToken,
          refreshToken,
        },
        "User registered successfully",
      ),
    );
});

const userLogin = asyncHandler(async (req, res) => {
  logger.info("Login endpoint hit");

  const { error } = validateLogin(req.body);
  if (error) {
    logger.warn(`Validation error: ${error.details[0].message}`);
    return res
      .status(400)
      .json(new ApiResponse(400, {}, error.details[0].message));
  }

  const { email, password } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    logger.warn("User not found");
    return res.status(404).json(new ApiResponse(404, {}, "User not found"));
  }

  const isPassValid = await existingUser.checkPassword(password);
  if (!isPassValid) {
    logger.warn("Invalid password");
    return res.status(400).json(new ApiResponse(400, {}, "Invalid Password"));
  }

  const { accessToken, refreshToken } = await generateTokens(existingUser);

  const user = {
    id: existingUser._id,
    username: existingUser.username,
    email: existingUser.email,
    avatar: existingUser.avatar,
  };

  const options = {
    httpOnly: true,
    secure: true, // dont use in localhost it will break
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        { user, accessToken, refreshToken },
        "User Logged in successfully",
      ),
    );
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  logger.info("Refresh access token endpoint hit!");
  const { refreshToken } = req.cookies?.refreshToken;
  if (!refreshToken) {
    logger.warn("Missing refresh token");
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Refresh token missing"));
  }
  const storedToken = await RefreshToken.findOne({ token: refreshToken });
  if (!storedToken || storedToken.expiresAt < new Date()) {
    logger.warn("Token expired or invalid");
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Refresh token Expired or invalid"));
  }
  const user = await User.findById(storedToken.user);
  if (!user) {
    logger.warn("No user found with the token");
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Refresh token Expired or invalid"));
  }

  const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
    await generateTokens(user);

  await RefreshToken.deleteOne({ _id: storedToken._id });

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", newAccessToken, options)
    .cookie("refreshToken", newRefreshToken, options);
});

export { userSignup, userLogin, refreshAccessToken };
