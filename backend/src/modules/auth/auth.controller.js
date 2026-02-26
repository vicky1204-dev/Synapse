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
    return res.status(400).json(new ApiResponse(400, {}, "User already exists"));
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
        { user: {id: user._id, email, username} ,accessToken, refreshToken },
        "User registered successfully",
      ),
    );
});

const userLogin = asyncHandler(async (req, res)=>{
    logger.info("Login endpoint hit")
    const {email, password} = req.body;
    const existingUser = await User.findOne({email})
    if(!existingUser){
        logger.warn("User not found")
        return res.status(404).json(new ApiResponse(404, {}, "User not found"))
    }

    const isPassValid = await user.checkPassword(password)
    if(!isPassValid) {
        logger.warn("Invalid password")
        return res.status(400).json(new ApiResponse(400, {}, "Invalid Password"))
    }

    const { accessToken, refreshToken } = await generateTokens(user);

    const user = {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email
    }

    const options = {
    httpOnly: true,
    secure: true, // dont use in localhost it will break
  }

    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, {user, accessToken, refreshToken}, "User Logged in successfully"))
})

export { userSignup, userLogin };
