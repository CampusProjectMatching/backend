const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const prismaClient = require('../../Utils/Database/prisma-client');
const prismaConnection = prismaClient();

const { isStudent } = require('../../Utils/auth/authenticate');
const { createWorkExperience } = require('../../Utils/Database/create');
const { queryStudentProfile } = require('../../Utils/Database/query');
const { deleteWorkExperience } = require('../../Utils/Database/delete'); 
const { updateWorkExperience } = require('../../Utils/Database/update');

/**
 * Get all work experiences of the student
 * @route GET /user/work_experience
 * @group Work Experience
 * @returns {object} 200 - An array of work experiences
 * @returns {Error}  default - Unexpected error
 * 
 * @example GET /user/work_experience
 * @response 200 
 * [
 *  {
 *    "id": 1,
 *    "company": "google",
 *    "designation": "SWE2",
 *    "start_date": "2021-10-10T00:00:00.000Z",
 *    "end_date": "2022-10-10T00:00:00.000Z",
 *    "user_id": 4
 *  },
 *  {
 *    "id": 2,
 *    "company": "des",
 *    "designation": "SMT",
 *    "start_date": "2022-10-10T00:00:00.000Z",
 *    "end_date": "2023-10-10T00:00:00.000Z",
 *    "user_id": 4
 *  }
 * ]
 */
router.get("/", isStudent, async (req, res) => {
    const profile = await queryStudentProfile(req.user.id, { work_experiences: true } )
    res.json(profile.student_profile.work_experiences)
})

/**
 * Create list of work experiences for the student
 * @route POST /user/work_experience
 * @group Work Experience
 * @param {Array.<WorkExperience>} work_experiences.body.required - Array of work experiences
 * @param {string} work_experiences[].company.required - Company
 * @param {string} work_experiences[].designation.required - Designation
 * @param {string} work_experiences[].start_date - Date started
 * @param {string} work_experiences[].end_date - Date ended
 * @returns {object} 200 - Success message
 * @returns {object} 400 - Bad request
 * @returns {Error}  default - Unexpected error
 * 
 * @example POST /user/work_experience
 * [
 *   {
 *      "company": "google",
 *      "designation": "SWE2",
 *      "start_date": "2021-10-10T00:00:00.000Z",
 *      "end_date": "2022-10-10T00:00:00.000Z"
 *   },
 *   {
 *      "company": "des",
 *      "designation": "SMT",
 *      "start_date": "2022-10-10T00:00:00.000Z",
 *      "end_date": "2023-10-10T00:00:00.000Z"
 *   }
 * ]
 * @response 200 { "message": "Work experiences created" }
 */
router.post("/", isStudent, async (req, res) => {
    try {
        const work_experiences = req.body;
        const createPromises = work_experiences.map(async (work_experience) => {
            await createWorkExperience({ ...work_experience, user_id: req.user.id });
        });
        await Promise.all(createPromises);

        res.json({ message: "Work experiences created" })
    } catch (error) {
        console.error("Error creating work experience:", error);
    }
})

/**
 * Delete a work experience of the student
 * @route DELETE /user/work_experience/{work_experience_id}
 * @group Work Experience
 * @param {integer} work_experience_id.path.required - Work Experience ID
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Work experience not found
 * 
 * @example DELETE /user/work_experience/6
 * @response 200 { "message": "Work experience deleted" }
 */
router.delete("/:work_experience_id", isStudent, async (req, res) => {
    try {
        const deletedData = await deleteWorkExperience(parseInt(req.params.work_experience_id));
        if (!deletedData) {
            res.status(404).json({ message: "Work experience not found" });
            return;
        }
        res.json({ message: "Work experience deleted", ...deletedData });
    } catch (error) {
        console.error("Error deleting work experience:", error);
    }
})

/**
 * Update a work experience of the student
 * @route PATCH /user/work_experience/{work_experience_id}
 * @group Work Experience
 * @param {integer} work_experience_id.body.required - Work Experience ID
 * @param {string} company.body - Company
 * @param {string} designation.body - Designation
 * @param {string} start_date.body - Date started
 * @param {string} end_date.body - Date ended
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Work experience not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /user/work_experience
 * {
 *   "work_experience_id": 6,
 *   "designation": "TL",
 * }
 * @response 200 { 
 *  "message": "Work experience updated",
 *  "id": 6,
 *  "company": "des",
 *  "designation": "TL",
 *  "start_date": "2022-10-10T00:00:00.000Z",
 *  "end_date": "2023-10-10T00:00:00.000Z",
 *  "user_id": 4
 * }
 */
router.patch("/", isStudent, async (req, res) => {
    try{
        const updatedData = await updateWorkExperience(req.body.work_experience_id, req.body);
        if (!updatedData) {
            res.status(404).json({ message: "Work experience not found" });
            return;
        }
        res.json({ message: "Work experience updated", ...updatedData });
    } catch (error) {
        console.error("Error updating work experience:", error);
    }
})

module.exports = router;