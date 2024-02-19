const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const prismaClient = require('../Utils/Database/prisma-client');
const { isAdmin } = require('../Utils/auth/authenticate');
const { createTag, createProfessionalSkill, createProfessionalInterest, createResearchInterest } = require('../Utils/Database/create');
const prismaConnection = prismaClient();


router.use(isAdmin)

router.post("/admin/createprofile", async (req, res) => {
    
})

router.post("/admin/validateprofile", async (req, res) => {
    
})

router.post("/admin/deleteprofile", async (req, res) => {
    
})

router.post("/admin/createtag", async (req, res) => {
    try{
        await createTag(req.body.tag_name)
        res.json({ message: "Tag created" })
    } catch (error) {
        console.error("Error:", error);
    }
})

router.post("/admin/deletetag", async (req, res) => {
    
})

router.post("/admin/createprofessionalskill", async (req, res) => {
    try {
        await createProfessionalSkill(req.body.professional_skill)
        res.json({ message: "Professional skill created" })
    }
    catch (error) {
        console.error("Error:", error);
    }
})

router.post("/admin/deleteskill", async (req, res) => {
    
})

router.post("/admin/createprofessionalinterest", async (req, res) => {
    try{
        await createProfessionalInterest(req.body.professional_interest)
        res.json({ message: "Professional interest created" })
    }
    catch (error) {
        console.error("Error:", error);
    }
})

router.post("/admin/deleteprofessionalinterest", async (req, res) => {
    
})

router.post("/admin/createresearcinterest", async (req, res) => {
    try {
        await createResearchInterest(req.body.research_interest)
        res.json({ message: "Research interest created" })
    }
    catch (error) {
        console.error("Error:", error);
    }
})

router.post("/admin/deleteresearchinterest", async (req, res) => {
    
})


module.exports = router;