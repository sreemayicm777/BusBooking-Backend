const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    fareFromStart: {
        type: Number,
        required: true
    }
});

const busSchema = new mongoose.Schema({
    from: {
        type: String,
        required: [true, "Please fill the from"]
    },
    to: {
        type: String,
        required: [true, "Please fill the to"]
    },
    stops: [stopSchema],
    startDateTime: {
        type: Date,
        required: true
    },
    endDateTime: {
        type: Date,
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