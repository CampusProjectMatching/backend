const generalUserQuery = [
    "projects", 
    "created_projects"
];

const studentSpecificQuery = [
  "professional_skills",
  "professional_interests",
  "achievements",
  "work_experiences",
];

const facultySpecificQuery = [
    "research_interests", 
    "publications"
];

const projectSpecificQuery = [
    "tags", 
    "users", 
    "timeline_events"
];

const generalUserUpdate = [
    "email",
    "mobile_no",
    "linkedin_url",
    "department",
    "designation",
    "resume_url",
    "password",
    "name",
    "github_url",
]

const studentSpecificUpdate = [
    "degree_name",
    "degree_start_date",
    "degree_end_date",
    "roll_no",
    "program"
]

const facultySpecificUpdate = [
    "google_scholar_url"
]

const projectSpecificUpdate = [
    "title",
    "max_members",
    "description",
    "start_date",
    "end_date",
    "demo_link"
]

const achievementSpecificUpdate = [
    "title",
    "description",
    "date",
    "link"
]

const workExperienceSpecificUpdate = [
    "company",
    "designation",
    "start_date",
    "end_date"
]

const publicationSpecificUpdate = [
    "title",
    "abstract",
    "link",
    "date"
]

module.exports = {
    generalUserQuery,
    studentSpecificQuery,
    facultySpecificQuery,
    projectSpecificQuery,
    generalUserUpdate,
    studentSpecificUpdate,
    facultySpecificUpdate,
    projectSpecificUpdate,
    achievementSpecificUpdate,
    workExperienceSpecificUpdate,
    publicationSpecificUpdate
}