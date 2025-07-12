const express = require("express");
const dotenv = require("dotenv").config({ silent: true});

const ConnectDB = require("./config/db");
const errorHandler = require('./middlewares/errorHandler');
const busRoutes = require('./routes/busRoutes')
const authRoutes = require('./routes/authRoutes')
ConnectDB();
const app = express();

const Port = process.env.PORT || 5000; //PORT Connection

app.use(express.json()); //Middlewware to parse JSON req.body
app.use('/api/buses', busRoutes );
app.use('/api/auth', authRoutes );

app.use(errorHandler);

app.listen(Port, () =>{
    console.log(`Server running on the PORT ${Port}..`);
    
})
