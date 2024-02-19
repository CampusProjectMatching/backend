const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const prismaClient = require('../../Utils/Database/prisma-client');
const prismaConnection = prismaClient();

const { isFaculty } = require('../../Utils/auth/authenticate');
const { addResearchInterestsToFacultyProfile } = require('../../Utils/Database/create');
const { queryFacultyProfile } = require('../../Utils/Database/query');
const { deleteResearchInterestsFromFacultyProfile } = require('../../Utils/Database/delete');

/**
 * Get all research interests of the faculty
 * @route GET /user/research_interest
 * @group Research Interest
 * @returns {object} 200 - An array of research interests
 * @returns {Error}  default - Unexpected error
 * 
 * @example GET /user/research_interest
 * @response 200 [
 *   {
 *      "id": 1,
 *      "name": "Machine Learning"
 *   },
 *   { 
 *      "id": 2,
 *      "name": "Data Science"
 *   }
 * ]
 */
router.get("/", isFaculty, async (req, res) => {
    const profile = await queryFacultyProfile(req.user.id, { research_interests: true });
    res.json(profile.faculty_profile.research_interests)
})

/**
 * Create list of research interests for the faculty
 * @route POST /user/research_interest
 * @group Research Interest
 * @param {Array.<int>} research_interests.body.required - Array of research interests
 * @returns {object} 200 - Success message
 * @returns {Error}  default - Unexpected error
 * 
 * @example POST /user/research_interest
 * [1, 2, 3]
 * @response 200 { "message": "Research interest created" }
 */
router.post("/", isFaculty, async (req, res) => {
    try {
        const researchInterestIds = req.body;
        await addResearchInterestsToFacultyProfile(req.user.id, researchInterestIds);
        res.json({ message: "Research interest created" })
    } catch (error) {
        console.error("Error fetching research interest IDs:", error);
    }
})

/**
 * Delete a list of research interest of the faculty
 * @route PATCH /user/research_interest/delete
 * @group Research Interest
 * @param {Array.<int>} research_interests.body.required - Array of research interests
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Research interest not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /user/research_interest/delete
 * [1, 2, 3]
 * @response 200 { "message": "Research interest deleted" }
 */
router.patch("/delete", isFaculty, async (req, res) => {
    try {
        const researchInterestIds = req.body;
        const deletedData = await deleteResearchInterestsFromFacultyProfile(req.user.id, researchInterestIds);
        if (!deletedData) {
            res.status(404).json({ message: "Research interest not found" });
            return;
        }
        res.json({ message: "Research interest deleted", ...deletedData })
    } catch (error) {
        console.error("Error:", error);
    }
})

module.exports = router;

