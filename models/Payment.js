const mongoose = require('mongoose');
const razorpay = require('../config/razorpay');

const paymentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    booking: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Booking'
    },
    razorpayPaymentId: String,
    razorpayOrderId: String,
    amount: Number,
    status: {
        type: String,
        enum: ['paid', 'refunded'],
        default: 'paid'
    },
    refundId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Payment', paymentSchema);