import { prismaClient } from "../application/database.js";
import { logger } from "../application/logging.js";

const authenticateSocket = async (socket, next) => {
    let token = socket.handshake.auth.token;

    const DBToken = await prismaClient.users.findFirst({
        where:{
            token
        }
    })
    next();
}

const authorizeSocketRoles  = (...roles) => {
    return async (socket, next) => {

        let token = socket.handshake.auth.token;

        const DBToken = await prismaClient.users.findFirst({
            where:{
                token
            }
        })

        next();
    }
}

export{ authenticateSocket, authorizeSocketRoles }