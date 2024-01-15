import { isTokenValid } from "../utils/index.js";
import { errorMiddleware } from "../middleware/error-middleware.js"
import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../error/response-error.js";
import { logger } from "../application/logging.js";

const authenticateUser = async (req, res, next) => {
    try {
        let token;
        const authHeader = req.headers.authorization

        if(authHeader && authHeader.startsWith('Bearer')){
            token = authHeader.split(' ')[1]
        }

        if(!token){
            throw new ResponseError(StatusCodes.UNAUTHORIZED, 'Authentication invalid')
        }

        const payload = isTokenValid({ token })
        req.user = {
            name: payload.name,
            userId: payload.userId,
            role: payload.role,
            email: payload.email,
          };

        next();
    } catch (error) {
        next(error)
    }
}

const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if(!roles.includes(req.user.role)){
            throw new ResponseError(StatusCodes.UNAUTHORIZED , 'Unauthorized to access this route')
        }
        next();
    }
}

export{ authenticateUser, authorizeRoles }