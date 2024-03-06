const express = require('express');
const jwt = require('jsonwebtoken');

require('dotenv').config();
const router = express.Router();

const prismaClient = require('../Utils/Database/prisma-client');
const verifyFromJums = require('../Utils/Auth/verify_from_jums');
const {fetchStudentProfileByRollNo} = require('../Utils/Database/query');
const {createStudentProfile} = require('../Utils/Database/create');
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

router.post("/login/jums", async (req, res) => {
    username = req.body.username;
    password = req.body.password;

    const verified = await verifyFromJums(username, password);
    console.log(verified)
    if (verified!==false) {
        const user = await fetchStudentProfileByRollNo(username);

        if (!user) {
            console.log("Creating new user")
            const newUser = await createStudentProfile({
                "password": password,
                "roll_no": username,
                "name": verified.name,
                "program": verified.program,
                "degree_name": verified.degree_name,
            });
            const token = jwt.sign({ id: newUser.user_id,role:"Student" }, process.env.ACCESS_TOKEN_SECRET)
            console.log(newUser.user_id)
            return res.json({ token,role:"Student" })
        }

        else{
            const token = jwt.sign({ id: user.user_id,role:"Student" }, process.env.ACCESS_TOKEN_SECRET)
            return res.json({ token,role:"Student" })
        }
    } else {
        return res.status(401).json({ message: "Invalid Username/Password" })
    }
})

module.exports = router;