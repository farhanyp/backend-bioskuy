import bcryptjs from 'bcryptjs'
import { Prisma } from "@prisma/client";
import { logger } from "../../../application/logging.js";
import { prismaClient } from "../../../application/database.js";
import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../../../error/response-error.js";
import { validate } from "../../../validation/validation.js";
import { registerValidation } from "../../../validation/user-validation.js";
import { createStudio, getFindStudio, getIndexStudio, removeStudio } from "../../../service/prisma/studio.js"

const create = async (req, res, next) => {
  try {
    
    const result = await createStudio(req)

    res.status(StatusCodes.CREATED).json({ 
      msg: 'Created Studio Successfully'
    });

  } catch (error) {
    next(error);

  }
};

const index = async (req, res, next) => {
  try {
    
    const result = await getIndexStudio(req)

    res.status(StatusCodes.OK).json({ 
      ...result
    });

  } catch (error) {
    next(error);

  }
};

const find = async (req, res, next) => {
  try {
    
    const result = await getFindStudio(req)

    res.status(StatusCodes.OK).json({ 
      ...result
    });

  } catch (error) {
    next(error);

  }
};

const remove = async (req, res, next) => {
  try {
    
    const result = await removeStudio(req)

    res.status(StatusCodes.OK).json({ 
      msg: 'Studi has been delete'
    });

  } catch (error) {
    next(error);

  }
};

export default {
  create,
  index,
  find,
  remove
};
