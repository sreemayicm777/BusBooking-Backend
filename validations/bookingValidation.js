const Joi = require('joi');

exports. bookingSchema = Joi.object({
    busId: Joi.string().required().messages({
        "string.empty": "Bus ID is required"
    }),
    from: Joi.string().required().messages({
        "string.empty": "From stop is required"
    }),
    to: Joi.string().required().messages({
        "string.empty": "To stop is required"
    }),
    seatsBooked: Joi.number().integer().min(1).required().messages({
        "number.base": "seats must be a number",
        "number.min": "At least 1 seat must be booked",
        "any.required": "Seats booked is required"
    })
})
