// authMiddleware.js
const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken');

const authMiddleware = async(req, res, next) => {
    try {
        const auth = req.get('Authorization');

        if (!auth) {
            return res.status(401).json({ message: 'Unauthorized: Missing Authorization header' });
        }

        const verifyToken = jwt.verify(auth, process.env.SECRECT_KEY);
        const emailId = verifyToken.emailId;
        const existingUserEmailId = await userModel.findOne({ emailId: emailId });

        if (!existingUserEmailId) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // Attach the emailId to the request for later use in the route handlers
        req.emailId = emailId;

        next(); // Move to the next middleware or route handler
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authMiddleware;
