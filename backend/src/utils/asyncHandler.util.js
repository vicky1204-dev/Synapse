import logger from "../utils/logger.util.js"

export const asyncHandler = (fn) => (req, res, next)=>{
    Promise.resolve(fn(req,res,next)).catch((err) => {
    logger.error(err);
    next(err)
    });
}