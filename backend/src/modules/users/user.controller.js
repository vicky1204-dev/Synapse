import { ApiResponse } from "../../utils/apiResponse.util.js";
import { asyncHandler } from "../../utils/asyncHandler.util.js";
import { logger } from "../../utils/logger.util.js";

const getCurrentUser = asyncHandler(async (req, res) => {
  logger.info("Get current user endpoint hit");
  const user = {
    id: req.user._id,
    email: req.user.email,
    username: req.user.username,
    avatar: req.user.avatar,
  };
  res
    .status(200)
    .json(new ApiResponse(200, user, "Successfully returned the user"));
});

export { getCurrentUser };
