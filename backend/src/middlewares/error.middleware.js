import { ApiResponse } from "../utils/apiResponse.util.js";
import { logger } from "../utils/logger.util.js";

export const errorHandler = (err, req, res, next) => {
    logger.error(err.stack)

    res.status(err.status || 500).json(new ApiResponse(500, {}, "Internal Server Error"))
}