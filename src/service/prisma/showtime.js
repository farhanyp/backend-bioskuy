import bcryptjs from 'bcryptjs'
import { StatusCodes } from "http-status-codes";
import { prismaClient } from "../../application/database.js";
import { ResponseError } from "../../error/response-error.js";
import { validate } from "../../validation/validation.js";
import { createShowTimeValidation, updateShowTimeValidation } from '../../validation/showtime-validation.js';

const createShowTime = async (req) => {

  const {movie_id, studio_id, show_start, show_end} = validate(createShowTimeValidation, req.body) 

  const isTimeExisted = await prismaClient.showtimes.findFirst({
    where: {
      AND: [
        {
          studio_id: studio_id,
        },
        {
          OR: [
            {
              show_start: {
                gte: show_start,
                lte: show_end
              }
            },
            {
              show_end: {
                gte: show_start,
                lte: show_end
              }
            },
            {
              AND: [
                {
                  show_start: {
                    lte: show_start
                  }
                },
                {
                  show_end: {
                    gte: show_start
                  }
                }
              ]
            },
            {
              AND: [
                {
                  show_start: {
                    lte: show_end
                  }
                },
                {
                  show_end: {
                    gte: show_end
                  }
                }
              ]
            }
          ]
        }
      ]
    }
  });
  

  if(isTimeExisted) throw new ResponseError(StatusCodes.BAD_REQUEST, "There is conflicting airtime")

  const movieShowing = await prismaClient.movies.findFirst({
    where:{
      id: movie_id,
      status: 'notShowing'
    }
  })

  if(movieShowing) throw new ResponseError(StatusCodes.BAD_REQUEST, "The Movie isn't ready to be shown yet")
  
  return prismaClient.showtimes.create({
      data: {
        movie_id,
        studio_id,
        show_start, 
        show_end
      }
  });
}

const getIndexShowtime = async (req) => {

  const showtime = await prismaClient.showtimes.findMany();

  if(showtime.length === 0) throw new ResponseError(StatusCodes.NOT_FOUND, "Showtimes not found")

  return showtime
}

const getFindShowtime = async (req) => {

  let {id} = req.params

  const movies = await prismaClient.showtimes.findFirst({
    where:{
      id: id
    }
  });

  if(!movies) throw new ResponseError(StatusCodes.NOT_FOUND, "Showtime not found")

  return movies
}


const UpdateShowtime = async (req) => {

  let { id } = req.params
  let data = {}

  const {movie_id, studio_id, show_start, show_end} = validate(updateShowTimeValidation, req.body)

  const getShowtime = await prismaClient.showtimes.findFirst({
    where:{
      id: id
    }
  });

  if(!getShowtime) throw new ResponseError(StatusCodes.NOT_FOUND, "Showtime not found")

  if(movie_id){
    data.movie_id = movie_id
  }

  if(studio_id){
    data.studio_id = studio_id
  }

  if(show_start){
    data.show_start = show_start
  }

  if(show_end){
    data.show_end = show_end
  }

  return prismaClient.showtimes.update({
    where: {
      id: getShowtime.id,
    },
    data,
  })
}

const removeShowtime = async (req) => {

  let { id } = req.params

  return prismaClient.showtimes.delete({
    where:{
      id: id
    }
  });
}

export {
  createShowTime,
  getIndexShowtime,
  getFindShowtime,
  UpdateShowtime,
  removeShowtime
  };