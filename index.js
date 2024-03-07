dotenv=require('dotenv').config({path: ['.env']});
const express = require('express');
const app = express();

var port = process.env.PORT || 8000;
const { authenticator } = require('./Utils/auth/authenticate.js');

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


app.listen(port)