require('dotenv').config();

const cors = require('cors');
const {queryAllStudents, fetchStudentProfileByRollNo} = require('./Utils/Database/query');
const {deleteUserProfile} = require('./Utils/Database/delete');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

//set allowed origins to all

const allowedOrigins = [
    'http://localhost:3001',
]

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            var msg = 'The CORS policy for this site does not ' +
                'allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));


const { authenticator } = require('./Utils/Auth/authenticate.js');
app.use(express.json())

app.use("/auth", require("./routers/auth.js"))

app.use("/profile", authenticator, require("./routers/profile.js"))

app.use("/user/achievements", authenticator, require("./routers/user/achievement.js"))
app.use("/user/research_interests", authenticator, require("./routers/user/research_interest.js"))
app.use("/user/professional_skills", authenticator, require("./routers/user/professional_skill.js"))
app.use("/user/professional_interests", authenticator, require("./routers/user/professional_interest.js"))
app.use("/user/work_experiences", authenticator, require("./routers/user/work_experience.js"))
app.use("/user/publications", authenticator, require("./routers/user/publication.js"))

app.use("/project", authenticator, require("./routers/project/project.js"))
app.use("/project", authenticator, require("./routers/project/tag.js"))
app.use("/project", authenticator, require("./routers/project/timeline.js"))


app.get("/students", authenticator,async (req, res) => {
    const students = await queryAllStudents();
    res.json(students);
})

app.delete("/student/:id", authenticator, async (req, res) => {
    const deletedData = await deleteUserProfile(Number(req.params.id));
    res.json(deletedData);
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})