const express = require('express');

const router = express.Router();

const prismaClient = require('../../Utils/Database/prisma-client');
const prismaConnection = prismaClient();

const { isStudent } = require('../../Utils/auth/authenticate');
const { addProfessionalInterestsToStudentProfile } = require('../../Utils/Database/create');
const { queryStudentProfile } = require('../../Utils/Database/query');
const { deleteProfessionalInterestsFromStudentProfile } = require('../../Utils/Database/delete');

/**
 * Get all professional interests of the student
 * @route GET /user/professional_interest
 * @group Professional Interest
 * @returns {object} 200 - An array of professional interests
 * @returns {Error}  default - Unexpected error
 * 
 * @example GET /user/professional_interest
 * @response 200 [
 *  {
 *     "id": 1,
 *     "name": "Data Science"
 *  },
 *  {
 *     "id": 2,
 *     "name": "Machine Learning"
 *  }
 * ]
 */
router.get("/", isStudent, async (req, res) => {
    const profile = await queryStudentProfile(req.user.id, { professional_interests: true });
    res.json(profile.student_profile.professional_interests)
})

/**
 * Create list of professional interests for the student
 * @route POST /user/professional_interest
 * @group Professional Interest
 * @param {Array.<int>} professional_interests.body.required - Array of professional interests
 * @returns {object} 200 - Success message
 * @returns {Error}  default - Unexpected error
 * 
 * @example POST /user/professional_interest
 * [1, 2, 3]
 * @response 200 { "message": "Professional interest created" }
 */
router.post("/", isStudent, async (req, res) => {
    try {
        const professionalInterestIds = req.body
        await addProfessionalInterestsToStudentProfile(req.user.id, professionalInterestIds);
        res.json({ message: "Professional interest created" })
    } catch (error) {
        console.error("Error:", error);
    }
})

/**
 * Delete a list of professional interest of the student
 * @route PATCH /user/professional_interest/delete
 * @group Professional Interest
 * @param {Array.<int>} professional_interests.body.required - Array of professional interests
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Professional interest not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /user/professional_interest/delete
 * [1, 2, 3]
 * @response 200 { "message": "Professional interest deleted" }
 */
router.patch("/delete", isStudent, async (req, res) => {
    try {
        const professionalInterestIds = req.body;
        const deletedData = await deleteProfessionalInterestsFromStudentProfile(req.user.id, professionalInterestIds);
        if (!deletedData) {
            return res.status(404).json({ message: "Professional interest not found" });
        }
        res.json({ message: "Professional interest deleted", ...deletedData })
    } catch (error) {
        console.error("Error deleting professional interest:", error);
    }
})

module.exports = router;