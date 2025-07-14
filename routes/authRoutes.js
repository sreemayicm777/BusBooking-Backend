const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/authController');
const validate =  require("../middlewares/validate");
const { registerSchema, loginSchema } = require("../validations/authValidation");

//  POST /api/auth/register
router.post('/register', validate(registerSchema), registerUser);

//  POST /api/auth/login
router.post('/login', validate(loginSchema), loginUser);

module.exports = router;