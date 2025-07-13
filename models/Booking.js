const mongoose = require("mongoose");
const StudioBase = require("twilio/lib/rest/StudioBase");

const bookingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    bus: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'Bus'
    },
    seatsBooked: {
        type: Number,
        required: true
    },
    totalFare: {
        type: Number,
        required: true
    },
    bookingId: {
        type:String,
        required: true,
        unique: true
    },
    Status: {
        type: String,
        enum: ['Confirmed', 'cancelled'],
        default: 'Confirmed'
    },
    createdAt: {
        type: Date,
        dafault: Date.now
    }
});

module.exports = mongoose.model("Booking",bookingSchema);