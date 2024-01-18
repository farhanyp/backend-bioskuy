import Joi from "joi";

const createFilmValidation = Joi.object({
  name:         Joi.string().max(100).required(),
  description:  Joi.string().max(100),
  price:        Joi.number().required(),
  status:       Joi.string().valid("notShowing", "showing", "alreadyShowing").required().default("notShowing"),
  genre:        Joi.string().max(100).required(),
});


export { 
  createFilmValidation,
};
