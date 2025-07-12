const User = require("../models/user");
const bcrypt = require('bcryptjs');
const generateToken = require("../utils/generateToken");

//Register a user
exports.registerUser = async(req,res) =>{
    try {
        
        const {name, email, password } = req.body;

        //if user already exists
    const userExists = await User.findOne({ email });
    if(userExists){
        res.status(400);
        throw new Error("User already Exists!");
    }
    //hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    //create User
    const user = await User.create({
        name,
        email,
        password: hashedPassword
    });

     // Return token and user info
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
    } catch (err) {
        next (err);
    }
};

//Login User

exports.loginUser = async(req,res) => {
    try {
        const{ email, password }=req.body;

    //find user
    const user = await User.findOne({ email });
    if(!user){
        res.status(401);
        throw new Error("Invalid Credentials");
    }

    //check password
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        res.status(401);
        throw new Error("Invalid credentials");
    }

    res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    });
        
    } catch (err) {
        next (err);
    }
};