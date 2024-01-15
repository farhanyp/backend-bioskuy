import bcryptjs from 'bcryptjs'
import { prismaClient } from '../application/database'
import { createTokenUser } from '../utils/createTokenUser'
import { createJWT } from '../utils/jwt'
import { loginValidation } from '../validation/user-validation'
import { validate } from '../validation/validation'

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

export const createTestAdmin = async () => {
    await prismaClient.users.create({
        data: {
            name: "admin",
            email: "admin@example.com",
            password: await bcryptjs.hash("test", 12),
            role: "admin",
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

export const removeTestAdmin = async () => {
    await prismaClient.users.delete({
        where: {
            email: "admin@example.com"
        }
    })
}

export const createManyMovie = async () => {
    return prismaClient.movies.createMany({
        data: [
            { name: "tes1", description: "test1", price: 5000, status: "notShowing" },
            { name: "tes2", description: "test2", price: 5500, status: "notShowing" },
            { name: "tes3", description: "test3", price: 5500, status: "notShowing" },
            { name: "tes4", description: "test4", price: 5500, status: "notShowing" },
            { name: "tes5", description: "test5", price: 5500, status: "notShowing" },
            { name: "tes6", description: "test6", price: 5500, status: "notShowing" },
            { name: "tes7", description: "test7", price: 5500, status: "notShowing" },
            { name: "tes8", description: "test8", price: 5500, status: "notShowing" },
            { name: "tes9", description: "test9", price: 5500, status: "notShowing" },
            { name: "tes10", description: "test10", price: 10000, status: "notShowing" }
        ]
    });
};

export const createOneMovie = async () => {
    return prismaClient.movies.create({
        data:{ 
            name: "tes1", description: "test1", price: 5000, status: "notShowing" 
        },
    });
};

export const removeMovies = async () => {
    await prismaClient.movies.deleteMany()
}

export const loginUserorAdmin = async (req) => {

    let {email, password} = validate(loginValidation, req);

    const result = await prismaClient.users.findFirst({
        where: {
          email,
        }
    });

    if (!result) throw new ResponseError(StatusCodes.UNAUTHORIZED, "Email or Password Wrong");

    const checkPassword = bcryptjs.compareSync(password, result.password)

    if (!checkPassword) throw new ResponseError(StatusCodes.UNAUTHORIZED, "Email or Password Wrong");

    delete(result.password)

    const token = createJWT({ payload: createTokenUser(result) })

    result.token = token

    await prismaClient.users.update({
        where: {
          email: email,
        },
        data: {
          token: token,
        },
    })

    return token;

}