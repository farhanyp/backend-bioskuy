import Joi from "joi";

const createStudioValidation = Joi.object({
  name: Joi.string().max(100).required(),
  capcity: Joi.number().required(),
  maxRowSeat: Joi.number().required(),
});


export { 
  createStudioValidation,
};
