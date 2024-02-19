const express = require('express');

const router = express.Router();

const prismaClient = require('../../Utils/Database/prisma-client');
const prismaConnection = prismaClient();

const { isFaculty } = require('../../Utils/auth/authenticate');
const { createPublication, addTagsToPublication } = require('../../Utils/Database/create');
const { queryFacultyProfile } = require('../../Utils/Database/query');
const { deletePublicaion, deleteTagsFromPublication } = require('../../Utils/Database/delete');
const { updatePublication } = require('../../Utils/Database/update');

/**
 * Get all publications of the faculty
 * @route GET /user/publication
 * @group Publication
 * @returns {object} 200 - An array of publications
 * @returns {Error}  default - Unexpected error
 * 
 * @example GET /user/publication
 * @response 200 [
 *   {
 *      "id": 1,
 *      "title": "paper1",
 *      "abstract": "paper1 abstract",
 *      "link": "doi.org",
 *      "date": "2024-02-18T11:58:31.244Z",
 *      "user_id": 6,
 *      "tags": [
 *      {
 *          "id": 3,
 *          "name": "DL"
 *      }
 *      ]
 *   }
 * ]
 */
router.get("/", isFaculty, async (req, res) => {
    const profile = await queryFacultyProfile(req.user.id, { publications: true })
    res.json(profile.faculty_profile.publications)
})

/**
 * Create list of publications for the faculty
 * @route POST /user/publication
 * @group Publication
 * @param {Array.<Publication>} publications.body.required - Array of publications
 * @param {string} publications[].title.required - Title of the publication
 * @param {string} publications[].abstract.required - Abstract
 * @param {string} publications[].link.required - link
 * @param {string} publications[].date - Date
 * @returns {object} 200 - Success message
 * @returns {Error}  default - Unexpected error
 */
router.post("/", isFaculty, async (req, res) => {
    try {
        const publications = req.body;
        const createPromises = publications.map(async (publication) => {
            await createPublication({ ...publication, user_id: req.user.id });
        });
        await Promise.all(createPromises);

        res.json({ message: "Publication created" })
    } catch (error) {
        res.status(400).json({ message: "Maybe, all fields are not present" });

    }
})

/**
 * Delete a publication of the faculty
 * @route DELETE /user/publication/{publication_id}
 * @group Publication
 * @param {integer} publication_id.path.required - Publication ID
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Publication not found
 * 
 * @example DELETE /user/publication/1
 * @response 200 { "message": "Publication deleted" }
 */
router.delete("/:publication_id", isFaculty, async (req, res) => {
    try {
        const deletedData = await deletePublicaion(parseInt(req.params.publication_id));
        if (!deletedData) {
            res.status(404).json({ message: "Publication not found" });
            return;
        }
        res.json({ message: "Publication deleted", ...deletedData });
    } catch (error) {
        console.error("Error deleting Publication:", error);
    }
})

/**
 * Update a publication of the faculty
 * @route PATCH /user/publication/{publication_id}
 * @group Publication
 * @param {integer} publication_id.path.required - Publication ID
 * @param {string} title.body - Title of the publication
 * @param {string} description.body - Description
 * @param {string} link.body - link
 * @param {string} date.body - Date
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Publication not found
 * 
 * @example PATCH /user/publication/
 * { 
 *   "publication_id": 1,
 *   "title": "paper1",
 *   "abstract": "paper1 abstract",
 *   "link": "doi.org",
 *   "date": "2024-02-18T11:58:31.244Z"
 * }
 * @response 200 { "message": "Publication updated" }
 */
router.patch("/", isFaculty, async (req, res) => {
    try{
        console.log(req.params.publication_id)
        const updatedData = await updatePublication(req.body.publication_id, req.body);
        if (!updatedData) {
            res.status(404).json({ message: "Publication not found" });
            return;
        }
        res.json({ message: "Publication updated", ...updatedData });
    } catch (error) {
        console.error("Error updating Publication:", error);
    }
})
/**
 * Add tags to a publication of the faculty
 * @route PATCH /user/publication/add_tag/{publication_id}
 * @group Publication
 * @param {integer} publication_id.body.required - Publication ID
 * @param {Array.<integer>} tag_ids.body.required - Array of tag IDs
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Publication not found
 * 
 * @example PATCH /user/publication/add_tag/
 * {
 *   "publication_id": 1,
 *   "tag_ids": [1, 2]
 * } 
 * @response 200 { "message": "Tags added to publication" }
 */
router.patch("/add_tag/:publication_id", isFaculty, async(req, res) => {
    try{
        const {tag} = req.body;
        const updated = await addTagsToPublication(publication_id, tag_ids);
        if (!updated) {
            res.status(404).json({ message: "Publication not found" });
            return;
        }
        res.json({ message: "Tags added to publication" })
    }
    catch (error) {
        console.error("Error:", error);
    }
})

/**
 * Delete tags from a publication of the faculty
 * @route PATCH /user/publication/delete_tag/{publication_id}
 * @group Publication
 * @param {integer} publication_id.body.required - Publication ID
 * @param {Array.<integer>} tag_ids.body.required - Array of tag IDs
 * @returns {object} 200 - Success message
 * @returns {object} 404 - Publication not found
 * 
 * @example PATCH /user/publication/delete_tag/
 * {
 *  "publication_id": 1,
 *  "tag_ids": [1, 2]
 * }
 * @response 200 { "message": "Tags deleted" }
 */
router.patch("/delete_tag/:publication_id", isFaculty, async(req, res) => {
    try{
        const {tag_ids, publication_id} = req.body;
        const deletedData = await deleteTagsFromPublication(publication_id, tag_ids);
        if (!deletedData) {
            res.status(404).json({ message: "Publication not found" });
            return;
        }
        res.json({ message: "Tags deleted", ...deletedData})
    }
    catch (error) {
        console.error("Error:", error);
    }
})

module.exports = router;