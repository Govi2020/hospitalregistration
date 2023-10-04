const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Hospital = require("../models/Hospital");
const LoginRecord = require("../models/LoginRecord");

// Register a new hospital
const registerUser = async (req, res) => {
    try {
        // Check if the hospital with the same email already exists
        const existingHospital = await Hospital.findOne({
            email: req.body.email,
        });
        if (existingHospital) {
            return res.status(409).json({
                message: "Hospital already registered with this email.",
            });
        }
        existingHospital2 = await Hospital.findOne({
            registrationNumber : req.body.registrationNumber,
        });
        if (existingHospital2) {
            return res.status(409).json({
                message: "Hospital already registered with this registrationNumber.",
            });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new hospital document
        const newHospital = new Hospital({
            hospitalName: req.body.hospitalName,
            address: req.body.address,
            city: req.body.city,
            state: req.body.state,
            pincode: req.body.pincode,
            registrationDate: req.body.registrationDate,
            ambulanceAvail: req.body.ambulanceAvail,
            email: req.body.email,
            number: req.body.number,
            registrationNumber: req.body.registrationNumber,
            emergencyWard: req.body.emergencyWard,
            password: hashedPassword, // Store the hashed password
            certificateUrl: req.body.certificateUrl,
        });

        // Save the hospital to the database
        const savedHospital = await newHospital.save();

        res.status(201).json({
            message: "Hospital registered successfully",
        });
    } catch (error) {
        console.error("Error in hospital registration:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const loginUser = async (req, res) => {
    try {
        // Find the hospital by email
        const hospital = await Hospital.findOne({ email: req.body.email });

        // Check if the hospital exists and the provided password is correct
        if (
            !hospital ||
            !(await bcrypt.compare(req.body.password, hospital.password))
        ) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }
        const sessionID = createSessionID();

        // Create a new login record
        const loginRecord = new LoginRecord({
            hospitalId: hospital._id,
            accessCode: req.body.accessCode,
            imageUrl: req.body.imageUrl,
            sessionID: sessionID,
        });

        res.cookie("sessionId", sessionID, { httpOnly: true,secure: true,sameSite: 'none' });
        // Save the login record
        await loginRecord.save();

        delete loginRecord.sessionID

        res.status(200).json(loginRecord);
    } catch (error) {
        console.error("Error in hospital login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const logout = async (req, res) => {
    try {
        // Check if the session ID cookie exists
        const sessionId = req.cookies.sessionId;

        if (!sessionId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Find and remove the login record associated with the session ID
        const loginRecord = await LoginRecord.findOneAndRemove({
            sessionID: sessionId,
        });

        if (!loginRecord) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        // Clear the session ID cookie on the client side
        res.clearCookie("sessionId");

        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.error("Error in logout route:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const createSessionID = () => {
    return (
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2) +
        Math.random().toString(36).slice(2)
    );
};

const userCheck = (req, res) => {
    res.status(200).json(req.login);
};

module.exports = { registerUser, loginUser, userCheck, logout };
