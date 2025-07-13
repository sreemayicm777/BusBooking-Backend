const crypto = require("crypto");
const Payment = require("../models/Payment");
const Booking = require("../models/Booking");
const User = require("../models/user");
const razorpay = require("../config/razorpay");
const generateTicketPDF = require("../utils/ticketGenerator");

//create razorphy order
exports.createOrder = async (req, res, next) => {
  try {
    const { bookingId } = req.body;
    const booking = await Booking.findById(bookingId).populate("bus");
    if (!booking) {
      res.status(404);
      throw new Error("Booking Not Found !");
    }

    const amount = Number(booking.totalFare) * 100;
    console.log("Total Fare:", booking.totalFare);
    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_order_${bookingId}`,
    };
    const order = await razorpay.orders.create(options);
    console.log("Razorpay order:", order);
    res.status(200).json(order);
  } catch (err) {
    console.log("createOrder err", err);

    next(err);
  }
};

//verify Payments

exports.verifyPayment = async (req, res, next) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      bookingId,
      amount,
    } = req.body;

    //check inputs
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      res.status(400);
      throw new Error("Missing Razorphy details");
    }

    //verify signature
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      res.status(400);
      throw new Error("Invalid signature, payment verification failed");
    }

    // save payment recod
    const payment = await Payment.create({
      user: req.user._id,
      booking: bookingId,
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      amount,
      status: "paid",
    });

    // Generate PDF Ticket
    const booking = await Booking.findById(bookingId).populate("bus");
    const user = await User.findById(req.user._id);

    const ticketPath = await generateTicketPDF(booking, user);
    console.log("🎟️ Ticket PDF saved at:", ticketPath);

    res.status(200).json({
      message: "Payment verified successfully",
      payment,
      ticketPath,
    });
  } catch (err) {
    next(err);
  }
};
