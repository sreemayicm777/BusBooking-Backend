const express = require("express");
const dotenv = require("dotenv").config();
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const ConnectDB = require("./config/db");
const errorHandler = require('./middlewares/errorHandler');

const busRoutes = require('./routes/busRoutes')
const authRoutes = require('./routes/authRoutes')
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes =  require('./routes/paymentRoutes');

ConnectDB();
const app = express();
const Port = process.env.PORT || 5000; //PORT Connection

//middleware
app.use(cors({ origin: " http://localhost:5173", credentials: true}));
app.use(helmet());
app.use(express.json()); //Middlewware to parse JSON req.body

//serve tickets
app.use("/tickets", express.static(path.join(__dirname, "tickets")));

//Routes
app.use('/api/buses', busRoutes );
app.use('/api/auth', authRoutes );
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments',paymentRoutes);


app.use(errorHandler);

app.listen(Port, () =>{
    console.log(`Server running on the PORT ${Port}..`);
    
})
