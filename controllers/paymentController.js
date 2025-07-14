const crypto = require("crypto");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const User = require("../models/user");
const Bus = require("../models/Bus");
const razorpay = require("../config/razorpay");
const generateTicketPDF = require("../utils/ticketGenerator");
const { v4: uuidv4 } = require("uuid");

// Create Razorpay Order
exports.createOrder = async (req, res, next) => {
  try {
    const { busId, from, to, seatsBooked } = req.body;

    const bus = await Bus.findById(busId);
    if (!bus || !bus.isActive) {
      res.status(404);
      throw new Error("Bus not found or not active");
    }

    const fromIndex = bus.stops.findIndex((s) => s.name === from);
    const toIndex = bus.stops.findIndex((s) => s.name === to);

    if (fromIndex === -1 || toIndex === -1 || toIndex <= fromIndex) {
      res.status(400);
      throw new Error("Invalid stop selection");
    }

    const farePerSeat = bus.stops[toIndex].fareFromStart - bus.stops[fromIndex].fareFromStart;
    const totalFare = farePerSeat * seatsBooked;

    const booking = await Booking.create({
      user: req.user._id,
      bus: bus._id,
      from,
      to,
      farePerSeat,
      seatsBooked,
      totalFare,
      bookingId: uuidv4(),
    });

    const options = {
      amount: totalFare * 100, // Razorpay uses paise
      currency: "INR",
      receipt: `receipt_order_${booking._id}`,
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({
      order,
      bookingId: booking._id,
    });
  } catch (err) {
    console.log("createOrder err", err);
    next(err);
  }
};

//  Verify Razorpay Payment
exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      amount
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error("Missing Razorpay details");
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error("Invalid signature, payment verification failed");
    }

    const payment = await Payment.create({
      user: req.user._id,
      booking: bookingId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount,
      status: "paid",
    });

    // Generate PDF ticket
    const booking = await Booking.findById(bookingId).populate("bus");
    const user = await User.findById(req.user._id);

    const ticketPath = await generateTicketPDF(booking, user);

    res.status(200).json({
      message: "Payment verified successfully",
      payment,
      ticketPath,
    });
  } catch (err) {
    next(err);
  }
};
