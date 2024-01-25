import Joi from "joi";

const createSeatBookingValidation = Joi.object({
  user_id:            Joi.string().max(100).required(),
  seat_id:            Joi.string().max(100).required(),
  showtime_id:        Joi.string().max(100).required(),
  status:             Joi.string().valid("active", "completed", 'cancelled', 'pending').default("cancelled").required(),
});


export { 
  createSeatBookingValidation,
};
