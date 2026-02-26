import logger from "../utils/logger.util.js"
import { ApiResponse } from "./apiResponse.util.js";

export const asyncHandler = (fn) => (req, res, next)=>{
    Promise.resolve(fn(req,res,next)).catch((err) => {
    logger.error(err);
    next(err)
    });
}