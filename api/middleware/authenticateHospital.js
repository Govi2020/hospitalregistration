const Hospital = require('../models/Hospital');
const LoginRecord = require('../models/LoginRecord');

const authenticateHospital = async (req, res, next) => {
    try {
        // Check if the session ID cookie exists
        const sessionId = req.cookies.sessionId;

        if (!sessionId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find the login record by session ID
        const loginRecord = await LoginRecord.findOne({ sessionID: sessionId });

        if (!loginRecord) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Retrieve the hospital user using the hospitalId in the login record
        const hospital = await Hospital.findById(loginRecord.hospitalId);

        if (!hospital) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Removing the Session ID from the login record
        delete loginRecord.sessionID;

        // Attach the hospital user to the request object for further use in protected routes
        req.hospital = hospital;
        req.login = loginRecord;

        next(); // Continue to the next middleware or route handler
    } catch (error) {
        console.error('Error in authentication middleware:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = authenticateHospital;
