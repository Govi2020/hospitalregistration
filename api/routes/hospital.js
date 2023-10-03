const express = require('express');
const router = express.Router();
const Hospital = require('../models/Hospital'); // Import your Mongoose model for hospitals
const authenticateHospital = require('../middleware/authenticateHospital');

// Retrieve all hospital registrations (accessible only to authenticated hospitals)
router.get('/registrations', authenticateHospital, async (req, res) => {
  try {
    // Fetch all hospital registrations from the database
    const registrations = await Hospital.find();

    res.status(200).json(registrations);
  } catch (error) {
    console.error('Error retrieving hospital registrations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/change-status', authenticateHospital, async (req, res) => {
  try {
    const status = req.body.status;

    const hospitalID = req.body.hospitalID
    // Fetch all hospital registrations from the database
    const registration = await Hospital.findByIdAndUpdate(hospitalID,{
      isActive: status
    });

    registration.save();

    res.status(200).json({message: `Status has been sent to ${status ? "Active" : "Inactive"}`});
  } catch (error) {
    console.error('Error retrieving hospital registrations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
})

module.exports = router;

