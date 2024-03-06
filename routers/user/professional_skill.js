const express = require('express');

const router = express.Router();

const prismaClient = require('../../Utils/Database/prisma-client');
const prismaConnection = prismaClient();

const { isStudent } = require('../../Utils/Auth/authenticate');
const { addProfessionalSkillsToStudentProfile } = require('../../Utils/Database/create');
const { queryStudentProfile } = require('../../Utils/Database/query');
const { deleteProfessionalSkillsFromStudentProfile } = require('../../Utils/Database/delete');

/**
 * Get all professional skills of the student
 * @route GET /user/professional_skill
 * @group Professional Skill
 * @returns {object} 200 - An array of professional skills
 * @returns {Error}  default - Unexpected error
 * 
 * @example GET /user/professional_skill
 * @response 200 [
 *   {
 *      "id": 1,
 *      "name": "Kafka"
 *   },
 *   { 
 *      "id": 2,
 *      "name": "K8s"
 *   }
 * ]
 */
router.get("/", isStudent, async (req, res) => {
    const profile = await queryStudentProfile(req.user.id, { professional_skills: true });
    res.json(profile.student_profile.professional_skills)
})

/**
 * Create list of professional skills for the student
 * @route POST /user/professional_skill
 * @group Professional Skill
 * @param {Array.<int>} professional_skills.body.required - Array of professional skills
 * @returns {object} 200 - Success message
 * @returns {Error}  default - Unexpected error
 * 
 * @example POST /user/professional_skill
 * [1, 2, 3]
 * @response 200 { "message": "Professional skill created" }
 */
router.post("/", isStudent, async (req, res) => {
    try {
        const professionalSkillIds = req.body;
        await addProfessionalSkillsToStudentProfile(req.user.id, professionalSkillIds);
        res.json({ message: "Professional skill created" })
    } catch (error) {
        console.error("Error:", error);
    }
})

/**
 * Delete a list of professional skill of the student
 * @route PATCH /user/professional_skill/delete
 * @group Professional Skill
 * @param {Array.<int>} professional_skills.body.required - Array of professional skills
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Professional skill not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /user/professional_skill/delete
 * [1, 2, 3]
 * @response 200 { "message": "Professional skill deleted" }
 */
router.patch("/delete", isStudent, async (req, res) => {
    try {
        const professionalSkillIds = req.body;
        const deletedData = await deleteProfessionalSkillsFromStudentProfile(req.user.id, professionalSkillIds);
        if (!deletedData) {
            res.status(404).json({ message: "Professional skill not found" });
            return;
        }
        res.json({ message: "Professional skill deleted", ...deletedData})
    } catch (error) {
        console.error("Error:", error);
    }
})
module.exports = router;