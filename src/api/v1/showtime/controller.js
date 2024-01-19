import bcryptjs from 'bcryptjs'
import { Prisma } from "@prisma/client";
import { logger } from "../../../application/logging.js";
import { prismaClient } from "../../../application/database.js";
import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../../../error/response-error.js";
import { validate } from "../../../validation/validation.js";
import { registerValidation } from "../../../validation/user-validation.js";
import { UpdateShowtime, createShowTime, getFindShowtime, getIndexShowtime, removeShowtime } from '../../../service/prisma/showtime.js';

const create = async (req, res, next) => {
  try {
    
    const result = await createShowTime(req)

    res.status(StatusCodes.CREATED).json({ 
      "data": "Showtime successfully registered"
    });

  } catch (error) {
    next(error);

  }
};

const index = async (req, res, next) => {
  try {
    
    const result = await getIndexShowtime(req)

    res.status(StatusCodes.OK).json({ 
      ...result
    });

  } catch (error) {
    next(error);

  }
};

const find = async (req, res, next) => {
  try {
    
    const result = await getFindShowtime(req)

    res.status(StatusCodes.OK).json({ 
      ...result
    });

  } catch (error) {
    next(error);

  }
};

const update = async (req, res, next) => {
  try {
    
    const result = await UpdateShowtime(req)

    res.status(StatusCodes.OK).json({ 
      "msg": "Showtime successfully changed"
    });

  } catch (error) {
    next(error);

  }
};

const remove = async (req, res, next) => {
  try {
    
    const result = await removeShowtime(req)

    res.status(StatusCodes.OK).json({ 
      "msg": "Showtime has been delete"
    });

  } catch (error) {
    next(error);

  }
};

export default {
  create,
  index,
  find,
  update,
  remove
};
