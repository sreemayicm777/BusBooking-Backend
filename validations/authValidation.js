const Joi =require("joi");

exports.registerSchema = Joi.object({
    name: Joi.string().min(3).required().messages({
        "string.empty": "Name is Required",
        "string.min": "Name must be at least 3 characters"
    }),

    email: Joi.string().email().required().messages({
        "string.email": "Enter a valid email",
        "string.empty": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.empty": "password is required"
    }),
    role: Joi.string().valid("user", "admin").default("user").messages({
        "any.only": "Role must be either 'user' or 'admin'"
  })
});

exports.loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Enter the validate email",
        "string.empty": "Email is required"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters",
        "string.empty": "Password is required"
    })
});


