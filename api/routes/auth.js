const express = require('express');
const router = express.Router();

// Import your authentication controller or functions
const { registerUser, loginUser, userCheck, logout } = require('../controllers/authController');
const authenticateHospital = require('../middleware/authenticateHospital');

// Define authentication routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logout);

router.post('/me', authenticateHospital , userCheck);

module.exports = router;
