import bcryptjs from 'bcryptjs'
import { Prisma } from "@prisma/client";
import { logger } from "../../../application/logging.js";
import { prismaClient } from "../../../application/database.js";
import { StatusCodes } from "http-status-codes";
import { ResponseError } from "../../../error/response-error.js";
import { validate } from "../../../validation/validation.js";
import { registerValidation } from "../../../validation/user-validation.js";
import { UpdateMovie, createFilm, getFindMovie, getIndexMovies, removeMovie } from "../../../service/prisma/movie.js"

const create = async (req, res, next) => {
  try {
    
    const result = await createFilm(req)

    res.status(StatusCodes.CREATED).json({ 
      "msg": "Film successfully registered"
    });

  } catch (error) {
    next(error);

  }
};

const index = async (req, res, next) => {
  try {
    
    const result = await getIndexMovies(req)

    res.status(StatusCodes.OK).json({ 
      ...result
    });

  } catch (error) {
    next(error);

  }
};

const find = async (req, res, next) => {
  try {
    
    const result = await getFindMovie(req)

    res.status(StatusCodes.OK).json({ 
      "data": result
    });

  } catch (error) {
    next(error);

  }
};

const update = async (req, res, next) => {
  try {
    
    const result = await UpdateMovie(req)

    res.status(StatusCodes.OK).json({ 
      "msg": "Movie successfully changed"
    });

  } catch (error) {
    next(error);

  }
};

const remove = async (req, res, next) => {
  try {
    
    const result = await removeMovie(req)

    res.status(StatusCodes.OK).json({ 
      "data": result
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
