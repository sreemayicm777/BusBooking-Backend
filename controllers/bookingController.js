const Booking = require("../models/Booking");
const Bus = require("../models/Bus")
const User = require("../models/user");
const { v4: uuidv4 } = require("uuid");

//Book a Bus 
exports.bookBus = async (req, res, next) => {
    try {
      const { busId, seatsBooked } = req.body;

      const bus = await Bus.findById(busId);
      if(!bus){
        res.status(404);
        throw new Error("Bus Not Founs!");
      }

      if(!bus.isActive){
        res.status(400);
        throw new Error("Bus is Currently Not Active");
      }

      if(bus.seatsAvailable < seatsBooked){
        res.status(400);
        throw  new Error("Not enough Seats available");
      }

      bus.seatsAvailable -= seatsBooked;
      await bus.save();

      const totalFare = seatsBooked * bus.fare;

      const booking = await Booking.create({
        user: req.user._id,
        bus: bus._id,
        seatsBooked,
        totalFare,
        bookingId: uuidv4(),
      });
      res.status(201).json(booking);
    } catch (err) {
        next (err);
    }
};

// Get user's bookings
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user._id }).populate('bus');
        res.status(200).json(bookings);

    } catch (err) {
        next (err);
    }
};

//cancel Booking
exports.cancelBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id).populate('bus');
        if(!booking){
            res.status(404);
            throw new Error('Booking Not Found!');
        }

        if (booking.user.toString() !== req.user._id.toString()) {
            res.status(403);
            throw new Error('You are not authorized to cancel this booking');
        }

        if(booking.Status === 'cancelled'){
            res.status(400);
            throw new Error("Booking already cancelled");
        }

        //restore seats

        booking.Status = 'cancelled';
        await booking.save();

        const bus = await Bus.findById(booking.bus._id);
        bus.seatsAvailable += booking.seatsBooked;
        await bus.save();

        res.status(200).json ({ message: 'Booking cancelled succesfully '});
    } catch (err) {
        next (err);
    }
};

//Admin Get All the Bookings

exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')   // show user info
      .populate('bus')  
      .sort({ createdAt: -1 });

    res.status(200).json(bookings);
  } catch (err) {
    next(err);
  }
};


