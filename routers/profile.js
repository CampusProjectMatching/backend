const express = require('express');
const router = express.Router();

const { queryFacultyProfile, queryStudentProfile } = require('../Utils/Database/query');
const { updateStudentProfile, updateFacultyProfile } = require('../Utils/Database/update');


/**
 * Get profile of the user
 * @route GET /user/profile
 * @group User
 * @returns {object} 200 - An object of user profile
 * @returns {Error}  default - Unexpected error
 * 
 * @example GET /profile
 * @response 200 {
 *  "id": 4,
 *  "email": "hiker1",
 *  "mobile_no": "12345673432242890",
 *  "name": "John Doe",
 *  "role": "Student",
 *  "github_url": "kanks",
 *  "linkedin_url": null,
 *  "designation": null,
 *  "department": null,
 *  "resume_url": null,
 *  "student_profile": {
 *     "user_id": 4,
 *     "degree_name": null,
 *     "degree_start_date": null,
 *     "degree_end_date": null,
 *     "program": null,
 *     "roll_no": null
 *  }
 */
router.get("/", async (req, res) => {
    if (req.user.role == 'Student') {
        const profile = await queryStudentProfile(req.user.id,include={
            "professional_skills":true,
            "professional_interests":true,
            "achievements":true,
            "work_experiences":true,
            "projects":true,
            "created_projects":true,

        })
        delete profile.password;
        res.json(profile);
    } else if (req.user.role == 'Faculty') {
        const profile = queryFacultyProfile(req.user.id)
        delete profile.password;
        res.json(profile);
    } else {
        res.status(403).json({ message: "Forbidden" })
    }
})

/**
 * update profile of the user
 * @route PATCH /user/profile
 * @group User
 * @param {string} name.body - Name
 * @param {string} email.body - Email
 * @param {string} phone.body - Phone number
 * @param {string} github_url.body - Github link
 * @param {string} linkedin_url.body - LinkedIn link
 * @param {string} designation.body - designation link
 * @param {string} department.body - department link
 * @param {string} resume_url.body - resume link
 * @param {string} google_scholar.body - google scholar link
 * @param {string} degree_name.body - degree name
 * @param {string} degree_start_date.body - degree start date
 * @param {string} degree_end_date.body - degree end date
 * @param {string} program.body - degree program
 * @param {string} roll.body - roll number
 * @returns {object} 200 - An object of user profile
 * @returns {object} 400 - Error updating profile
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /profile
 * {
 *    "linkedin_url": "https://www.linkedin.com/in/username",
 * }
 * @response 200 {
 *   "id": 4,
 *   "email": "hiker1",
 *   "mobile_no": "12345673432242890",
 *   "password": "123456",
 *   "name": "John Doe",
 *   "role": "Student",
 *   "github_url": "kanks",
 *   "linkedin_url": "linkedin.com",
 *   "designation": null,
 *   "department": null,
 *   "resume_url": null
 * }
 */
router.patch("/", async (req, res) => {
    if (req.user.role == 'Student') {
        const updatedData = await updateStudentProfile(req.user.id, req.body);
        if (!updatedData) {
            res.status(400).json({ message: "Error updating profile" })
        }
        res.json(updatedData);
    } else if (req.user.role == 'Faculty') {
        const updatedData = await updateFacultyProfile(req.user.id, req.body);
        if (!updatedData) {
            res.status(400).json({ message: "Error updating profile" })
        }
        res.json(updatedData);
    }
})

module.exports = router;