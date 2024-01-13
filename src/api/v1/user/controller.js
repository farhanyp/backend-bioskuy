import bcryptjs from 'bcryptjs'
import { Prisma } from "@prisma/client";
import { logger } from "../../../application/logging.js";
import { prismaClient } from "../../../application/database.js";
import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../../../error/response-error.js";
import { validate } from "../../../validation/validation.js";
import { registerValidation } from "../../../validation/user-validation.js";
import { loginUser, registerUser } from "../../../service/prisma/user.js"

const create = async (req, res, next) => {
  try {
    
    const result = await registerUser(req)

    res.status(StatusCodes.CREATED).json({ 
      "msg": "Account successfully registered"
    });

  } catch (error) {

    next(error);

  }
};

const login = async (req, res, next) => {
  try {
    
    const result = await loginUser(req)

    res.status(StatusCodes.CREATED).json({ 
      token: result 
    });

  } catch (error) {

    next(error);

  }
};

export default {
  create,
  login
};
