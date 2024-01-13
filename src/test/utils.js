import bcryptjs from 'bcryptjs'
import { prismaClient } from '../application/database'

export const createTestUser = async () => {
    await prismaClient.users.create({
        data: {
            name: "test",
            email: "test@example.com",
            password: await bcryptjs.hash("test", 12),
            role: "user",
        }
    })
}

export const removeTestUser = async () => {
    await prismaClient.users.delete({
        where: {
            email: "test@example.com"
        }
    })
}