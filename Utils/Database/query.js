const prismaClient = require("./prisma-client");
const constants = require("./constants");

const prismaConnection = prismaClient();

async function queryStudentProfile(studentId, include = {}) {
  const generalUser = constants.generalUserQuery;
  const studentSpecific = constants.studentSpecificQuery

  let generalUserDict = {};

  generalUser.forEach((element) => {
    if (include[element]) {
      generalUserDict[element] = true;
    }
  });

  let studentSpecificDict = {};

  studentSpecific.forEach((element) => {
    if (include[element]) {
      studentSpecificDict[element] = true;
    }
  });

  try {
    const data = await prismaConnection.user.findUnique({
      where: {
        id: studentId,
      },
      include: {
        ...generalUserDict,
        student_profile: {
          include: {
            ...studentSpecificDict,
          },
        },
      },
    });
    return data;
  } catch (e) {
    console.error("Error in queryStudentProfile: ", e);
  }
}

async function queryFacultyProfile(facultyId, include = {}) {
  const generalUser = constants.generalUserQuery;
  const facultySpecific = constants.studentSpecificQuery;

  let generalUserDict = {};

  generalUser.forEach((element) => {
    if (include[element]) {
      generalUserDict[element] = true;
    }
  });

  let facultySpecificDict = {};

  facultySpecific.forEach((element) => {
    if (include[element]) {
        if(element=="publications"){
            facultySpecificDict[element] = {
                orderBy: {
                    date: 'desc'
                },
                include:{
                    tags:true
                }
            }
        }
        else{
            facultySpecificDict[element] = true;
        }
    }
  });

  try {
    const data = await prismaConnection.user.findUnique({
      where: {
        id: facultyId,
      },
      include: {
        ...generalUserDict,
        faculty_profile: {
          include: {
            ...facultySpecificDict,
          },
        },
      },
    });
    return data;
  } catch (e) {
    console.error("Error in queryFacultyProfile: ", e);
  }
}

async function queryProject(projectId, include = {}) {
  const projectSpecific = constants.projectSpecificQuery;

  let projectSpecificDict = {};

  projectSpecific.forEach((element) => {
    if (include[element]) {
      projectSpecificDict[element] = true;
    }
  });

  try {
    const data = await prismaConnection.project.findUnique({
      where: {
        id: projectId,
      },
      include: {
        ...projectSpecificDict,
      },
    });
    return data;
  } catch (e) {
    console.error("Error in queryProject: ", e);
  }
}

module.exports = {
  queryStudentProfile,
  queryFacultyProfile,
  queryProject,
};
