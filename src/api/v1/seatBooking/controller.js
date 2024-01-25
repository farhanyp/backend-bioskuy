import { StatusCodes } from "http-status-codes";
import { createSeatBooking } from "../../../service/prisma/seatBooking";

const create = async (req, res, next) => {
  try {
    
    const result = await createSeatBooking(req)

    res.status(StatusCodes.CREATED).json({ 
      "data": result
    });

  } catch (error) {
    next(error);

  }
};
export default {
  create
};
