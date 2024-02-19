const express = require('express');
const { createTimeLineEvent } = require('../../Utils/Database/create');
const { deleteTimelineEvent } = require('../../Utils/Database/delete');
const router = express.Router();

/**
 * Add timeline to a project
 * @route PATCH /project/add_timeline/{project_id}
 * @group Project
 * @param {int} project_id.body.required - project id
 * @param {string} title.body - title of the timeline
 * @param {string} description.body - description of the timeline
 * @param {string} date.body - date of the timeline
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Project not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /project/add_timeline/1
 * {
 *   "project_id": 1,
 *   "title": "First timeline",
 *   "description": "This is the first timeline",
 *   "date": "2021-01-01"
 * }
 * @response 200 { "message": "Timeline added to project" }
 */
router.patch("/add_timeline", async(req, res) => {
    try{
        const timeline = req.body
        await createTimeLineEvent(timeline);
        res.json({ message: "Timeline added to project" })
    }
    catch (error) {
        if (error.code == "P2025") {
            res.status(404).json({ message: "Project not found" });
        }
        res.status(400).json({ message: "Maybe, a field is missing" });
        console.error("Error:", error);
    }
})

/**
 * Delete timeline from a project
 * @route PATCH /project/delete_timeline
 * @group Project
 * @param {int} timeline_eventid.body.required - timeline event id  
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Timeline not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /project/delete_timeline
 * {
 *   "timeline_eventid": 1
 * }
 * @response 200 { "message": "Timeline deleted" }
 */
router.patch("/delete_timeline", async(req, res) => {
    try{
        await deleteTimelineEvent(parseInt(req.body.timeline_eventid));
        res.json({ message: "Timeline deleted" })
    } catch (error) {
        if (error.code == "P2025") {
            res.status(404).json({ message: "Timeline not found" });
        }
        console.error("Error:", error);
    }
})

module.exports = router;