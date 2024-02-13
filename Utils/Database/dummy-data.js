const student = [
  {
    name: "John Doe",
    email: "hiker1",
    role: "Student",
    mobile_no: "12345673432242890",
    password: "123456",
  },
  {
    name: "James Doe",
    email: "hiker2",
    role: "Student",
    mobile_no: "1232142141456789110",
    password: "123456",
  },
];

const faculty = [
  {
    name: "John Doe",
    email: "hiker3",
    role: "Faculty",
    mobile_no: "123452332167890",
    google_scholar_url: "https://www.google.com",
    password: "123456",
  },
  {
    name: "James Doe",
    email: "hike4r",
    role: "Faculty",
    mobile_no: "1234232567890",
    google_scholar_url: "https://www.google.com",
    password: "123456",
  },
];

const achievement = [
  {
    title: "Achievement 1",
    description: "Description 1",
    date: new Date("2021-08-01"),
    link: "https://www.google.com",
    user_id: 3,
  },
  {
    title: "Achievement 2",
    description: "Description 2",
    date: new Date("2021-08-01"),
    link: "https://www.google.com",
    user_id: 5,
  },
];

const workExperience = [
  {
    company: "Company 1",
    designation: "Designation 1",
    start_date: new Date("2021-08-01"),
    user_id: 3,
  },
  {
    company: "Company 2",
    designation: "Designation 2",
    start_date: new Date("2021-08-01"),
    user_id: 5,
  },
];

const tag = [
  {
    name: "Tag 1",
  },
  {
    name: "Tag 2",
  },
];

const project = [
  {
    title: "Project 1",
    description: "Description 1",
    link: "https://www.google.com",
    max_members: 5,
    creator_id: 1,
  },
  {
    title: "Project 2",
    description: "Description 2",
    link: "https://www.google.com",
    max_members: 6,
    creator_id: 2,
  },
];

const professionalSkill = [
  {
    name: "Skill 1",
  },
  {
    name: "Skill 2",
  },
];

const professionalInterest = [
  {
    name: "Interest 1",
  },
  {
    name: "Interest 2",
  },
];

const researchInterest = [
  {
    name: "Interest 1",
  },
  {
    name: "Interest 2",
  },
];

const publication = [
  {
    title: "Publication 1",
    abstract: "Description 1",
    link: "https://www.google.com",
    user_id: 1,
    date: new Date("2021-08-01"),
  },
  {
    title: "Publication 2",
    abstract: "Description 2",
    link: "https://www.google.com",
    user_id: 1,
    date: new Date("2021-08-01"),
  },
];

module.exports = {
  student,
  faculty,
  achievement,
  tag,
  project,
  professionalSkill,
  professionalInterest,
  researchInterest,
  publication,
  workExperience,
};
