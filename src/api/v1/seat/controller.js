import bcryptjs from 'bcryptjs'
import { Prisma } from "@prisma/client";
import { logger } from "../../../application/logging.js";
import { prismaClient } from "../../../application/database.js";
import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../../../error/response-error.js";
import { validate } from "../../../validation/validation.js";
import { registerValidation } from "../../../validation/user-validation.js";
import { } from "../../../service/prisma/studio.js"
import { removeStudio } from '../../../test/utils.js';

const index = async (req, res, next) => {
  try {
    
    const result = await getIndexSeat(req)

    res.status(StatusCodes.OK).json({ 
      ...result
    });

  } catch (error) {
    next(error);

  }
};

const find = async (req, res, next) => {
  try {
    
    const result = await getFindSeat(req)

    res.status(StatusCodes.OK).json({ 
      "data": result
    });

  } catch (error) {
    next(error);

  }
};

export default {
  index,
  find
};
