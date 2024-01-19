import bcryptjs from 'bcryptjs'
import { prismaClient } from '../application/database.js'
import { createTokenUser } from '../utils/createTokenUser.js'
import { createJWT } from '../utils/jwt.js'
import { loginValidation } from '../validation/user-validation.js'
import { validate } from '../validation/validation.js'
import { logger } from '../application/logging.js'

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
            { name: "tes1", description: "test1", price: 5000, status: "notShowing", genre: "action" },
            { name: "tes2", description: "test2", price: 5500, status: "notShowing", genre: "action" },
            { name: "tes3", description: "test3", price: 5500, status: "notShowing", genre: "action" },
            { name: "tes4", description: "test4", price: 5500, status: "notShowing", genre: "action" },
            { name: "tes5", description: "test5", price: 5500, status: "notShowing", genre: "action" },
            { name: "tes6", description: "test6", price: 5500, status: "notShowing", genre: "action" },
            { name: "tes7", description: "test7", price: 5500, status: "notShowing", genre: "action" },
            { name: "tes8", description: "test8", price: 5500, status: "notShowing", genre: "action" },
            { name: "tes9", description: "test9", price: 5500, status: "notShowing", genre: "action" },
            { name: "tes10", description: "test10", price: 10000, status: "notShowing", genre: "action" }
        ]
    });
};

export const createManyShowtimes = async () => {

    const movie = await prismaClient.movies.findFirst();
    const studio = await prismaClient.studios.findFirst();

    return prismaClient.showtimes.createMany({
        data: [
            { movie_id: movie.id, studio_id: studio.id,  show_start: new Date('2024-01-18T01:00:00Z'), show_end: new Date('2024-01-18T02:00:00Z') },
            { movie_id: movie.id, studio_id: studio.id,  show_start: new Date('2024-01-18T03:00:00Z'), show_end: new Date('2024-01-18T04:00:00Z') },
            { movie_id: movie.id, studio_id: studio.id,  show_start: new Date('2024-01-18T05:00:00Z'), show_end: new Date('2024-01-18T06:00:00Z') }
        ]
    });
};

export const createManyStudio = async () => {
    return prismaClient.studios.createMany({
        data: [
            { name: "tes1", capcity: 10 },
            { name: "tes2", capcity: 10 },
            { name: "tes3", capcity: 10 },
            { name: "tes4", capcity: 10 },
            { name: "tes5", capcity: 10 },
            { name: "tes6", capcity: 10 },
            { name: "tes7", capcity: 10 },
            { name: "tes8", capcity: 10 },
            { name: "tes9", capcity: 10 },
            { name: "tes10", capcity: 10 }
        ]
    });
};

export const createManyGenre = async () => {
    return prismaClient.genres.createMany({
        data: [
            { name: "tes1" },
            { name: "tes2" },
            { name: "tes3" },
            { name: "tes4" },
            { name: "tes5" },
            { name: "tes6" },
            { name: "tes7" },
            { name: "tes8" },
            { name: "tes9" },
            { name: "tes10" }
        ]
    });
};

export const createStudio = async () => {
    await prismaClient.studios.create({
        data:{
            name: "tes1", 
            capcity: 10 
        }
    })
}

export const createShowTime = async () => {
    const movie = await prismaClient.movies.findFirst();
    const studio = await prismaClient.studios.findFirst();
    await prismaClient.showtimes.create({
        data:{ 
            movie_id: movie.id, 
            studio_id: studio.id,  
            show_start: new Date('2024-01-18T01:00:00Z'), 
            show_end: new Date('2024-01-18T02:00:00Z') 
        },
    })
}

export const createOneMovie = async () => {
    return prismaClient.movies.create({
        data:{ 
            name: "tes1", description: "test1", price: 5000, status: "notShowing" , genre: "action"
        },
    });
};

export const removeMovies = async () => {
    await prismaClient.movies.deleteMany()
}

export const removeShowtimes = async () => {
    await prismaClient.showtimes.deleteMany()
}

export const removeStudio = async () => {
    await prismaClient.studios.deleteMany()
}

export const removeSeat = async () => {
    await prismaClient.seats.deleteMany()
}

export const removeGenre = async () => {
    await prismaClient.genres.deleteMany()
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