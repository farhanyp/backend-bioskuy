import bcryptjs from 'bcryptjs'
import { StatusCodes } from "http-status-codes";
import { prismaClient } from "../../application/database.js";
import { ResponseError } from "../../error/response-error.js";
import { loginValidation, registerValidation } from "../../validation/user-validation.js";
import { validate } from "../../validation/validation.js";
import { createTokenUser } from '../../utils/createTokenUser.js';
import { createJWT } from '../../utils/jwt.js';

const registerUser = async (req) => {

    let {name, email, password, role} = validate(registerValidation, req.body);

    const checkUser = await prismaClient.users.findFirst({
        where: {
          email,
        }
    });

    if (checkUser) throw new ResponseError(StatusCodes.BAD_REQUEST, "User already created");

    if (password) password = bcryptjs.hashSync("test", 12);

    return prismaClient.users.create({
        data: {
          email,
          password,
          name,
          role,
        }
    });

}

const loginUser = async (req) => {

    let {email, password} = validate(loginValidation, req.body);

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

export {
    registerUser,
    loginUser
  };