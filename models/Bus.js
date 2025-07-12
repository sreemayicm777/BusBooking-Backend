const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
    from: {
        type: String,
        required: [true, "Please fill the from"]
    },
    to: {
        type: String,
        required: [true, "Please fill the to"]
    },
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
        required: true
    },
    fare: {
        type: Number,
        required: true
    },
    seatsAvailable: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        default:true
    }

},{
     timestamps: true //Mongoose automatically adds createdAt,updatedAt
});

module.exports = mongoose.model('Bus',busSchema);