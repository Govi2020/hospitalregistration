const mongoose = require("mongoose");

const hospitalSchema = new mongoose.Schema({
    hospitalName: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    pincode: {
        type: String,
        required: true,
    },
    registrationDate: {
        type: Date,
        required: true,
    },
    ambulanceAvail: {
        type: Number,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    number: {
        type: String,
        required: true,
    },
    registrationNumber: {
        type: String,
        required: true,
        unique: true,
    },
    emergencyWard: {
        type: Number,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    certificateUrl: {
        type: String,
        required: true,
    },
    isActive: {
        type: Boolean,
        required: false,
        default: false
    }
});

const Hospital = mongoose.model("Hospital", hospitalSchema);

module.exports = Hospital;
