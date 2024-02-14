const prismaClient = require("./prisma-client");
const constants = require("./constants");

const prismaConnection = prismaClient();

async function updateStudentProfile(studentId, data) {
  let generalUser = constants.generalUserUpdate;

  let studentSpecific = constants.studentSpecificUpdate;

  let generalUserDict = {};

  generalUser.forEach((element) => {
    if (data[element]) {
      generalUserDict[element] = data[element];
    }
  });

  let studentSpecificDict = {};

  studentSpecific.forEach((element) => {
    if (data[element]) {
      studentSpecificDict[element] = data[element];
    }
  });
  //with try catch
  try {
    const updatedData = await prismaConnection.user.update({
      where: {
        id: studentId,
      },
      data: {
        ...generalUserDict,
        student_profile: {
          update: {
            ...studentSpecificDict,
          },
        },
      },
    });
    return updatedData;
  } catch (e) {
    console.error("Error in updateStudentProfile: ", e);
  }
}

async function updateFacultyProfile(facultyId, data) {
  let generalUser = constants.generalUserUpdate;

  let facultySpecific = constants.facultySpecificUpdate;

  let generalUserDict = {};

  generalUser.forEach((element) => {
    if (data[element]) {
      generalUserDict[element] = data[element];
    }
  });

  let facultySpecificDict = {};

  facultySpecific.forEach((element) => {
    if (data[element]) {
      facultySpecificDict[element] = data[element];
    }
  });

  try {
    const updatedData = await prismaConnection.user.update({
      where: {
        id: facultyId,
      },
      data: {
        ...generalUserDict,
        faculty_profile: {
          update: {
            ...facultySpecificDict,
          },
        },
      },
    });
    return updatedData;
  } catch (e) {
    console.error("Error in updateFacultyProfile: ", e);
  }
}

async function updateProject(projectId, data) {
  let generalProject = constants.projectSpecificUpdate;

  let generalProjectDict = {};

  generalProject.forEach((element) => {
    if (data[element]) {
      generalProjectDict[element] = data[element];
    }
  });

  try {
    const updatedData = await prismaConnection.project.update({
      where: {
        id: projectId,
      },
      data: {
        ...generalProjectDict,
      },
    });
    return updatedData;
  } catch (e) {
    console.error("Error in updateProject: ", e);
  }
}

async function updateAchievement(achievementId, data) {
  let generalAchievement = constants.achievementSpecificUpdate;

  let generalAchievementDict = {};

  generalAchievement.forEach((element) => {
    if (data[element]) {
      generalAchievementDict[element] = data[element];
    }
  });

  try {
    const updatedData = await prismaConnection.achievement.update({
      where: {
        id: achievementId,
      },
      data: {
        ...generalAchievementDict,
      },
    });
    return updatedData;
  } catch (e) {
    console.error("Error in updateAchievement: ", e);
  }
}

async function updateWorkExperience(workExperienceId, data) {
  let generalWorkExperience = constants.workExperienceSpecificUpdate;

  let generalWorkExperienceDict = {};

  generalWorkExperience.forEach((element) => {
    if (data[element]) {
      generalWorkExperienceDict[element] = data[element];
    }
  });

  try {
    const updatedData = await prismaConnection.workExperience.update({
      where: {
        id: workExperienceId,
      },
      data: {
        ...generalWorkExperienceDict,
      },
    });
    return updatedData;
  } catch (e) {
    console.error("Error in updateWorkExperience: ", e);
  }
}

async function updatePublication(publicationId, data) {
  let generalPublication = constants.publicationSpecificUpdate;

  let generalPublicationDict = {};

  generalPublication.forEach((element) => {
    if (data[element]) {
      generalPublicationDict[element] = data[element];
    }
  });

  try {
    const updatedData = await prismaConnection.publication.update({
      where: {
        id: publicationId,
      },
      data: {
        ...generalPublicationDict,
      },
    });
    return updatedData;
  } catch (e) {
    console.error("Error in updatePublication: ", e);
  }
}

module.exports = {
  updateStudentProfile,
  updateFacultyProfile,
  updateProject,
  updateAchievement,
  updateWorkExperience,
  updatePublication,
};
