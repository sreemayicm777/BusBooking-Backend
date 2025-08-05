const Joi = require("joi");

// 🚌 Create Bus Schema
const createBusSchema = Joi.object({
  stopNames: Joi.array().items(Joi.string().trim()).min(2).required().messages({
    "array.base": "Stop names must be an array of strings",
    "array.min": "At least two stops are required",
    "any.required": "Stop names are required",
    "string.empty": "Stop names cannot be empty",
  }),

  startDateTime: Joi.date().iso().required().messages({
    "date.base": "Start date must be a valid ISO date",
    "any.required": "Start date is required",
  }),

  endDateTime: Joi.date()
    .iso()
    .greater(Joi.ref("startDateTime"))
    .required()
    .messages({
      "date.greater": "End date must be after start date",
      "any.required": "End date is required",
      "date.base": "End date must be a valid ISO date",
    }),

  seatsAvailable: Joi.number().integer().min(1).required().messages({
    "number.base": "Seats must be a number",
    "number.min": "At least 1 seat must be available",
    "any.required": "Seats available is required",
  }),

  // ✅ Add this field to allow isActive
  isActive: Joi.boolean().optional(),
});


// 🔍 Search Bus Schema with YYYY-MM-DD date format
const searchBusSchema = Joi.object({
  from: Joi.string().trim().optional(),
  to: Joi.string().trim().optional(),
  date: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .messages({
      "string.pattern.base": `"date" must be in YYYY-MM-DD format (e.g., 2025-07-22)`,
    }),
}).or("from", "to", "date"); // at least one must be provided

// ✅ Middleware for search query validation
const validateSearchQuery = (req, res, next) => {
  const query = req.query;

  if (query.from || query.to || query.date) {
    const { error } = searchBusSchema.validate(req.query);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  }

  next();
};

module.exports = {
  createBusSchema,
  searchBusSchema,
  validateSearchQuery,
};
