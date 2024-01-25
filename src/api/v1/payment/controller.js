import { StatusCodes } from "http-status-codes";
import { createPayments, notificationPayments } from "../../../service/prisma/payment";

const create = async (req, res, next) => {
  try {
    
    const { payment, transactionToken} = await createPayments(req)

    res.status(StatusCodes.CREATED).json({ 
      data: payment,
      transactionToken: transactionToken
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
  notification
};
