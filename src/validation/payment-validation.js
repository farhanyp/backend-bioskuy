import Joi from "joi";

const createPaymentValidation = Joi.object({
  seatbooking_id:             Joi.string().max(100).required(),
  amount:                     Joi.number(),
  status:                     Joi.string().valid("unpaid", "paid").default("paid").required(),
});

export { 
  createPaymentValidation,
};
