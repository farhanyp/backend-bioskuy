import { StatusCodes } from "http-status-codes";
import { createPayments, getPayments, notificationPayments } from "../../../service/prisma/payment.js";

const create = async (req, res, next) => {
  try {
    
    const result = await createPayments(req)

    res.status(StatusCodes.CREATED).json({ 
      data: result
    });

  } catch (error) {
    next(error);

  }
};

const indexPayments = async (req, res, next) => {
  try {
    
    const result = await getPayments(req)

    res.status(StatusCodes.CREATED).json({ 
      data: result
    });

  } catch (error) {
    next(error);

  }
};

const notification = async (req, res, next) => {
  try {
    
    const result =  await notificationPayments(req)

    res.status(StatusCodes.OK).json({ 
      data: result,
    });

  } catch (error) {
    next(error);

  }
};

export default {
  create,
  notification,
  indexPayments
};
