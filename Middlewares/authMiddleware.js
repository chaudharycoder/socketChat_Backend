import { asyncHandler } from '../utilities/ayncHandler.js';
import { errorHandler } from '../utilities/errorHandler.js';
import jwt from 'jsonwebtoken'

export const isAuthenticated = asyncHandler(async (req, res, next) => {

    const token = req.cookies.token || req.headers['authorization']?.replace("Bearer ", "");
    if (!token) {
        console.warn(`[AUTH] Missing token for ${req.method} ${req.url}`);
        return next(new errorHandler("Invalid token", 400))
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        console.log(`[AUTH] Valid token for user: ${tokenData._id}`);
        req.user = tokenData
        next();
    } catch (error) {
        console.error(`[AUTH] Token verification failed: ${error.message}`);
        return next(new errorHandler("Token verification failed", 401));
    }
});