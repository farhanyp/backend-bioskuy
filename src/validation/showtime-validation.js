import Joi from "joi";

const createShowTimeValidation = Joi.object({
  movie_id:     Joi.string().max(100).required(),
  studio_id:    Joi.string().max(100).required(),
  show_start:   Joi.date().iso().required(),
  show_end:   Joi.date().iso().required(),
});

const updateShowTimeValidation = Joi.object({
  movie_id:     Joi.string().max(100),
  studio_id:    Joi.string().max(100),
  show_start:   Joi.date().iso(),
  show_end:     Joi.date().iso(),
});


export { 
  createShowTimeValidation,
  updateShowTimeValidation
};
