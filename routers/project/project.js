const express = require('express');

const router = express.Router();

const { queryStudentProfile, queryFacultyProfile, queryProject } = require('../../Utils/Database/query');
const { createProject, addUserToProject } = require('../../Utils/Database/create');
const { deleteUserFromProject, deleteProject } = require('../../Utils/Database/delete');
const { updateProject } = require('../../Utils/Database/update');

/**
 * Get the list of projects
 * @route GET /project
 * @group Project
 * @returns {object} 200 - An array of projects
 * @returns {Error}  default - Unexpected error
 * 
 * @example GET /project
 * @response 200 [
 *   {
 *      "id": 2,
 *      "title": "something 2",
 *      "max_members": 4,
 *      "start_date": "2008-09-09T00:00:00.000Z",
 *      "end_date": "2008-09-09T00:00:00.000Z",
 *      "description": "hello",
 *      "creator_id": 4,
 *      "demo_link": null,
 *   }
 * ]
 */
router.get("/", async (req, res) => {
    if (req.user.role == 'Student') {
        const profile = await queryStudentProfile(req.user.id, { projects: true });
        res.json(profile.projects);
    } else if (req.user.role == 'Faculty') {
        const profile = await queryFacultyProfile(req.user.id, { projects: true });
        res.json(profile.projects);
    } else {
        res.status(403).json({ message: "Forbidden" })
    }
});

/**
 * Get details of a project
 * @route GET /project/query/{project_id}
 * @group Project
 * @param {int} project_id.path.required - project id
 * @returns {object} 200 - A project
 * @returns {object} 404 - Project not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example GET /project/query/1
 * @response 200 {
 *    "id": 2,
 *    "title": "something 2",
 *    "max_members": 4,
 *    "start_date": "2008-09-09T00:00:00.000Z",
 *    "end_date": "2008-09-09T00:00:00.000Z",
 *    "description": "hello",
 *    "creator_id": 4,
 *    "demo_link": null,
 *    "tags": [],
 *    "users": [],
 *    "timeline_events": []
 * }
 */
router.get("/:project_id", async (req, res) => {
    const project = await queryProject(parseInt(req.params.project_id), { tags: true, users: true, timeline_events: true})
    if (!project) {
        res.status(404).json({ message: "Project not found" });
        return;
    }
    res.json(project);
});

/**
 * Create a project
 * @route POST /project
 * @group Project
 * @param {string} title.body.required - Title of the project
 * @param {string} description.body.required - Description of the project
 * @param {string} start_date.body.required - Start date of the project
 * @param {string} end_date.body.required - End date of the project
 * @param {int} max_members.body.required - Maximum number of members
 * @param {string} demo_link.body - Demo link of the project
 * @returns {object} 200 - Success message
 * @returns {Error}  default - Unexpected error
 *
 * @example POST /project
 * {
 *      "title": "project1",
 *      "description": "description1",
 *      "start_date": "2020-01-01",
 *      "end_date": "2021-01-01",
 *      "max_members": 5
 * }
 * @response 200 { "message": "Project created", "note": "you are added to project" }
 * 
*/
router.post("/", async (req, res) => {
    console.log(req.user.id)
    try{
        const data = await createProject({ ...req.body, creator_id: req.user.id })
        await addUserToProject(req.user.id, data.id)
        res.json({ message: "Project created", note: "you are added to project" })
    }
    catch (error) {
        console.log("Error creating project:", error);
        res.status(400).json({ message: "Maybe, all fields are not present" });
    }
})

/**
 * Add a user to a project
 * @route PATCH /project/add_user
 * @group Project
 * @param {int} project_id.body.required - project id
 * @param {int} user_id.body.required - user id
 * @returns {object} 200 - Success message
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /project/add_user
 * {
 *    "project_id": 1,
 *   "user_id": 2
 * }
 * @response 200 { "message": "User added to project" }
 */
router.patch("/add_user", async (req, res) => {
    
    try{
        const { project_id, user_id } = req.body;
        console.log(project_id, user_id)
        await addUserToProject(user_id, project_id)
        res.json({ message: "User added to project" })
    }
    catch (error) {
        res.status(400).json({ message: "Maybe, project or user with that id doesnt exist" });
        console.log("Error adding user to project:", error);
    }
})

/**
 * Delete a user from a project
 * @route PATCH /project/delete_user
 * @group Project
 * @param {int} project_id.body.required - project id
 * @param {int} user_id.body.required - user id
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Project not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /project/delete_user
 * {
 *   "project_id": 1,
 *   "user_id": 2
 * }
 * @response 200 { "message": "User deleted from project" }
 */
router.patch("/delete_user", async (req, res) => {
    try{
        const { project_id, user_id } = req.body;
        const project = await deleteUserFromProject(project_id, user_id)
    
        if (!project) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.json({ message: "User deleted from project" })
    }
    catch (error) {
        console.log("Error deleting user from project:", error);
    }
})

/**
 * Update a project
 * @route PATCH /project/{project_id}
 * @group Project
 * @param {int} project_id.body.required - project id
 * @param {string} title.body - Title of the project
 * @param {string} description.body - Description of the project
 * @param {string} start_date.body - Start date of the project
 * @param {string} end_date.body - End date of the project
 * @param {int} max_members.body - Maximum number of members
 * @param {string} demo_link.body - Demo link of the project
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Project not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example PATCH /project/1
 * {
 *     "project_id": 1,
 *     "title": "project99",
 * }
 * @response 200 { "message": "Project updated" }
 */
router.patch("/", async (req, res) => {
    try{
        const updated = updateProject(req.body.project_id, req.body)
        if (!updated) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.json({ message: "Project updated" })
    } catch (error) {
        console.log("Error updating project:", error);
    }
})

/**
 * Delete a project
 * @route DELETE /project/{project_id}
 * @group Project
 * @param {int} project_id.path.required - project id
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Project not found
 * @returns {Error}  default - Unexpected error
 * 
 * @example DELETE /project/1
 * @response 200 { "message": "Project deleted" }
 */
router.delete("/:project_id", async (req, res) => {
    try{
        const deleted = deleteProject(parseInt(req.params.project_id))
        if (!deleted) {
            res.status(404).json({ message: "Project not found" });
            return;
        }
        res.json({ message: "Project deleted" })
    } catch (error) {
        console.log("Error deleting project:", error);
    }
})



module.exports = router;