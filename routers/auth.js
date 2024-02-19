const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const prismaClient = require('../Utils/Database/prisma-client');
const prismaConnection = prismaClient();

/**
 * Login with email and password
 * @route POST /auth/login/email
 * @group Auth
 * @param {string} email.body.required - email
 * @param {string} password.body.required - password
 * @returns {object} 200 - Token
 * @returns {object} 401 - User not found   
 * @returns {object} 401 - Incorrect password
 * @returns {Error}  default - Unexpected error
 * 
 * @example POST /auth/login/email
 * {
 *  "email": "hiker1",
 * "password": "password"
 * }
 * @response 200 { "token": JWT_ACCESS_TOKEN }
 */
router.post("/login/email", async (req, res) => {
    const { email, password } = req.body;
    const user = await prismaConnection.user.findFirst({
        where: {
            email
        }
    })
    if (!user) {
        return res.status(401).json({ message: "User not found" })
    }
    if (user.password !== password) {
        return res.status(401).json({ message: "Incorrect password" })
    }
    const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET)
    res.json({ token })
})

module.exports = router;