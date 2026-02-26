import { User } from "../modules/users/User.model.js";
import { ApiResponse } from "../utils/apiResponse.util.js";
import { asyncHandler } from "../utils/asyncHandler.util.js";
import jwt from "jsonwebtoken";
import { logger } from "../utils/logger.util.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token){
    logger.warn("No valid access token found")
    return res
      .status(401)
      .json(new ApiResponse(401, {}, "Unauthorized access"));
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedToken?.id).select(
      "-password",
    );
    if(!user) {
        logger.warn("Invalid token")
        return res
      .status(401)
      .json(new ApiResponse(401, {}, "Unauthorized access"));
    }

    req.user = user
    next()
  } catch (error) {
    return res.status(401)
      .json(new ApiResponse(401, {}, "Invalid access token"));
  }
});
