const jwt = require('jsonwebtoken');
require('dotenv').config()

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token == null) return res.sendStatus(401); // No token provided

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Invalid token
        req.user = user; // Attach the decoded user to the request object for later use
        console.log(user)
        next(); // Proceed to the next middleware or route handler
    });
};

const isStudent = (req, res, next) => {
    if (req.user.role === 'Student') {
        next();
    } else {
        res.sendStatus(403);
    }
};

const isFaculty = (req, res, next) => {
    if (req.user.role === 'Faculty') {
        next();
    } else {
        res.sendStatus(403);
    }
};

module.exports = {
    "authenticator": authenticateToken,
    "isStudent": isStudent,
    "isFaculty": isFaculty
}