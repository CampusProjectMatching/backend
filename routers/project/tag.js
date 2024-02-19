const express = require('express');
const router = express.Router();

const { addTagsToProject } = require('../../Utils/Database/create');
const { deleteTagsFromProject } = require('../../Utils/Database/delete');

/**
 * Add tags to a project
 * @route PATCH /project/add_tag/{project_id}
 * @group Project
 * @param {int} project_id.body.required - project id
 * @param {Array.<int>} tag_ids.body.required - tag ids
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Project not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /project/add_tag/1
 * {
 *    "project_id": 1,
 *    "tag_ids": [1, 2, 3]
 * }    
 * @response 200 { "message": "Tags added to project" }
 */
router.patch("/add_tag", async(req, res) => {
    try{
        const {tag_ids, project_id} = req.body
        const updated = await addTagsToProject(project_id, tag_ids);
        if (!updated) {
            res.status(404).json({ message: "projet not found" });
            return;
        }
        res.json({ message: "Tags added to project" })
    }
    catch (error) {
        console.error("Error:", error);
    }
})

/**
 * Delete tags from a project
 * @route PATCH /project/delete_tag/{project_id}
 * @group Project
 * @param {int} project_id.body.required - project id
 * @param {Array.<int>} tag_ids.body.required - tag ids
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Tags not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /project/delete_tag/1
 * {
 *   "project_id": 1,
 *  "tag_ids": [1, 2, 3]
 * }
 * @response 200 { "message": "Tags deleted" }
 */
router.patch("/delete_tag", async(req, res) => {
    try{
        const {project_id, tag_ids} = req.body
        const deletedData = await deleteTagsFromProject(project_id, tag_ids);
        if (!deletedData) {
            res.status(404).json({ message: "Tags not found" });
            return;
        }
        res.json({ message: "Tags deleted", ...deletedData})
    }
    catch (error) {
        console.error("Error:", error);
    }
})

module.exports = router;