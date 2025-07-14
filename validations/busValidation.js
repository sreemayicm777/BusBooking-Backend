const Joi = require("joi");

const createBusSchema = Joi.object({
  stopNames: Joi.array().items(Joi.string()).min(2).required().messages({
    "array.base": "Stop names must be an array",
    "array.min": "At least two stops are required",
    "any.required": "Stop names are required",
  }),
  startDateTime: Joi.date().required().messages({
    "date.base": "Start date must be valid",
    "any.required": "Start date is required",
  }),
  endDateTime: Joi.date()
    .greater(Joi.ref("startDateTime"))
    .required()
    .messages({
      "date.greater": "End date must be after start date",
      "any.required": "End date is required",
    }),
  seatsAvailable: Joi.number().integer().min(1).required().messages({
    "number.base": "Seats must be a number",
    "number.min": "At least 1 seat must be available",
    "any.required": "Seats available is required",
  }),
});

exports.searchBusSchema = Joi.object({
  from: Joi.string().required().messages({
    "any.required": "From location is required",
  }),
  to: Joi.string().required().messages({
    "any.required": "To location is required",
  }),
  date: Joi.date().required().messages({
    "date.base": "Date must be valid",
    "any.required": "Date is required",
  }),
});
