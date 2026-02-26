import { User } from "../users/User.model.js";
import { ApiResponse } from "../../utils/apiResponse.util.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { logger } from "../../utils/logger.util.js";
import { RefreshToken } from "./RefreshToken.model.js";
import { generateTokens } from "../../utils/generateToken.util.js";

const userSignup = asyncHandler(async (req, res) => {
  logger.info("User registration endpoint hit");
  const { username, email, password } = req.body;
  let user = await User.findOne({ $or: [{ username }, { email }] });
  if (user) {
    logger.warn("User already exists");
    res.status(400).json(new ApiResponse(400, {}, "User already exists"));
  }

  user = await User.create({
    username,
    email,
    password,
  });

  logger.info("User created successfully");
  const { accessToken, refreshToken } = await generateTokens(user);

  const options = {
    httpOnly: true,
    secure: true,
  }

  res
    .status(201)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        201,
        { accessToken, refreshToken },
        "User registered successfully",
      ),
    );
});

export { userSignup };
