const express = require('express');

const router = express.Router();

const { isStudent } = require('../../Utils/Auth/authenticate');
const { createAchievement } = require('../../Utils/Database/create');
const { queryStudentProfile } = require('../../Utils/Database/query');
const { deleteAchievement } = require('../../Utils/Database/delete');
const { updateAchievement } = require('../../Utils/Database/update');

router.use(isStudent)

/**
 * Get all achievements of the student
 * @route GET /user/achievement
 * @group Achievement
 * @returns {object} 200 - An array of achievements
 * @returns {Error}  default - Unexpected error
 * 
 * @example GET /user/achievement
 * @response 200 [
 *  {
 *      "id": 1,
 *      "title": "Achievement 1",
 *      "description": "Description 1",
 *      "link": "https://www.google.com",
 *      "date": "2024-02-16T20:28:50.832Z",
 *      "user_id": 4
 *  },
 *  {
 *      "id": 2,
 *      "title": "Achievement 2",
 *      "description": "Description 2",
 *      "link": "https://www.google.com",
 *      "date": "2024-02-16T20:28:50.833Z",
 *      "user_id": 4
 *  },
 */
router.get("/", async (req, res) => {
    const profile = await queryStudentProfile(req.user.id, { achievements: true })
    res.json(profile.student_profile.achievements)
})

/**
 * Create list of achievements for the student
 * @route POST /user/achievement
 * @group Achievement
 * @param {Array.<Achievement>} achievements.body.required - Array of achievements
 * @param {string} achievements[].title.required - Title of the achievement
 * @param {string} achievements[].description.required - Description
 * @param {string} achievements[].link.required - link
 * @param {string} achievements[].date - Date
 * @returns {object} 200 - Success message
 * @returns {object} 400 - All fields are not present
 * @returns {Error}  default - Unexpected error
 * 
 * @example POST /user/achievement
 * [
 *  {
 *     "title": "Achievement 1",
 *     "description": "Description 1",
 *     "link": "https://www.google.com",
 *     "date": "2024-02-16T20:28:50.832Z"
 *  },
 * ]
 * @response 200 { "message": "Achievements created" }
 */
router.post("/", async (req, res) => {
    try {
        const achievements = req.body;
        console.log(achievements)
        const createPromises = achievements.map(async (achievement) => {
            await createAchievement({ ...achievement, user_id: req.user.id });
        });
        await Promise.all(createPromises);

        res.json({ message: "Achievements created" })
    } catch (error) {
        res.status(400).json({ message: "Maybe, all fields are not present" });
        console.log("Error creating achievements:", error);
    }
})


/**
 * Delete an achievement of the student
 * @route DELETE /user/achievement/{achievement_id}
 * @group Achievement
 * @param {integer} achievement_id.path.required - Achievement ID
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Achievement not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example DELETE /user/achievement/1
 * @response 200 { "message": "Achievement deleted" }
 */
router.delete("/:achievement_id", async (req, res) => {
    try {
        const deletedData = await deleteAchievement(parseInt(req.params.achievement_id));
        if (!deletedData) {
            res.status(404).json({ message: "Achievement not found" });
            return;
        }
        res.json({ message: "Achievement deleted", ...deletedData });
    } catch (error) {
        console.error("Error deleting Achievement:", error);
    }
})

/**
 * Update an achievement of the student
 * @route PATCH /user/achievement/{achievement_id}
 * @group Achievement
 * @param {integer} achievement_id.path.required - Achievement ID
 * @param {string} title - Title of the achievement
 * @param {string} description - Description
 * @param {string} link - link
 * @param {string} date - Date
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Achievement not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /user/achievement/
 * {
 *    "achievement_id": 1,
 *    "title": "Achievement 1",
 *    "description": "Description 1",
 *    "link": "https://www.google.com",
 *    "date": "2024-02-16T20:28:50.832Z" 
 * }
 * @response 200 { "message": "Achievement updated" }
 */
router.patch("/", async (req, res) => {
    try{
        const updatedData = await updateAchievement(req.body.achievement_id, req.body);
        if (!updatedData) {
            res.status(404).json({ message: "Achievement not found" });
            return;
        }
        res.json({ message: "Achievement updated", ...updatedData });
    } catch (error) {
        console.error("Error updating Achievement:", error);
    }
})

module.exports = router;