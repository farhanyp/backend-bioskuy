import bcryptjs from 'bcryptjs'
import { StatusCodes } from "http-status-codes";
import { prismaClient } from "../../application/database.js";
import { ResponseError } from "../../error/response-error.js";
import { createFilmValidation } from "../../validation/movie-validation.js";
import { validate } from "../../validation/validation.js";
import { createTokenUser } from '../../utils/createTokenUser.js';
import { createJWT } from '../../utils/jwt.js';
import { logger } from '../../application/logging.js';

const createFilm = async (req) => {

    let {name, description, price, status} = validate(createFilmValidation, req.body);

    return prismaClient.movies.create({
        data: {
          name,
          description,
          price,
          status,
        }
    });
}

const getIndexMovies = async (req) => {

  const movies = await prismaClient.movies.findMany();

  if(movies.length === 0) throw new ResponseError(StatusCodes.NOT_FOUND, "Movies not found")

  return movies
}

const getFindMovie = async (req) => {

  let {id} = req.params

  const movies = await prismaClient.movies.findFirst({
    where:{
      id: id
    }
  });

  if(!movies) throw new ResponseError(StatusCodes.NOT_FOUND, "Movies not found")

  return movies
}


const UpdateMovie = async (req) => {

  let { id } = req.params
  let { status } = req.body

  const getMovie = await prismaClient.movies.findFirst({
    where:{
      id: id
    }
  });

  if(!getMovie) throw new ResponseError(StatusCodes.NOT_FOUND, "Movies not found")

  return prismaClient.movies.update({
    where: {
      id: getMovie.id,
    },
    data: {
      status: status,
    },
  })
}


const removeMovie = async (req) => {

  let { id } = req.params

  return prismaClient.movies.delete({
    where:{
      id: id
    }
  });
}

export {
  createFilm,
  getIndexMovies,
  getFindMovie,
  UpdateMovie,
  removeMovie
  };