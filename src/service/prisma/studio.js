import bcryptjs from 'bcryptjs'
import { StatusCodes } from "http-status-codes";
import { prismaClient } from "../../application/database.js";
import { ResponseError } from "../../error/response-error.js";
import { createStudioValidation } from "../../validation/studio-validation.js";
import { validate } from "../../validation/validation.js";
import { logger } from '../../application/logging.js';

const createStudio = async (req) => {
  let { name, capcity, maxRowSeat } = validate(createStudioValidation, req.body);

  // Check if maxRowSeat is not zero to avoid division by zero
  if (maxRowSeat === 0) {
      throw new ResponseError(StatusCodes.BAD_REQUEST, "maxRowSeat cannot be zero");
  }

  const numRows = Math.ceil(capcity / maxRowSeat);

  // Check if the number of rows exceeds 26 (number of letters in the alphabet)
  if (numRows > 26) {
      throw new ResponseError(StatusCodes.BAD_REQUEST, "Number of rows exceeds limit (26)");
  }

  // Create the studio in the database
  const studio = await prismaClient.studios.create({
      data: {
          name,
          capcity
      }
  });

  // Create seats
  for (let row = 0; row < numRows; row++) {
      for (let seatNum = 1; seatNum <= maxRowSeat; seatNum++) {
          // Calculate the actual seat number
          let actualSeatNum = row * maxRowSeat + seatNum;

          // Stop if the actual seat number exceeds studio capcity
          if (actualSeatNum > capcity) break;

          // Generate seat name (e.g., A-1, B-2, ...)
          let seatName = `${String.fromCharCode(65 + row)}-${seatNum}`;

          await prismaClient.seats.create({
              data: {
                  studio_id: studio.id,
                  seat_name: seatName,
                  isAvailable: true // Assuming new seats are available by default
              }
          });
      }
  }

  return studio;
}


const getIndexStudio = async (req) => {

  const studios = await prismaClient.studios.findMany();

  if(studios.length === 0) throw new ResponseError(StatusCodes.NOT_FOUND, "Studio not found")

  return studios
}

const getFindStudio = async (req) => {

  let {id} = req.params

  const studio = await prismaClient.studios.findFirst({
    where:{
      id: id
    }
  });

  if(!studio) throw new ResponseError(StatusCodes.NOT_FOUND, "Studios not found")

  return studio
}


const removeStudio = async (req) => {

  let { id } = req.params

  await prismaClient.seats.deleteMany({
    where:{
      studio_id: id
    }
  });

  return prismaClient.studios.delete({
    where:{
      id: id
    }
  });
}

export {
  createStudio,
  getIndexStudio,
  getFindStudio,
  removeStudio
  };