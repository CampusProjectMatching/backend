const prismaClient = require("./prisma-client");
const constants = require("./constants");

const prismaConnection = prismaClient();

async function deleteUserProfile(userId) {
    try {
        const deletedData = await prismaConnection.user.delete({
        where: {
            id: userId,
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteUserProfile: ", e);
    }
}

async function deleteStudentProfileByRollNo(rollNo) {
    try {
        const deletedData = await prismaConnection.studentProfile.delete({
        where: {
            roll_no: rollNo,
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteStudentProfileByRollNo: ", e);
    }
}

async function deleteProject(projectId) {
    try {
        const deletedData = await prismaConnection.project.delete({
        where: {
            id: projectId,
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteProject: ", e);
    }
}

async function deleteAchievement(achievementId) {
    try {
        const deletedData = await prismaConnection.achievement.delete({
        where: {
            id: achievementId,
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteAchievement: ", e);
    }
}

async function deleteTimelineEvent(timelineEventId) {
    try {
        const deletedData = await prismaConnection.timelineEvent.delete({
        where: {
            id: timelineEventId,
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteTimelineEvent: ", e);
    }
}

async function deleteWorkExperience(workExperienceId) {
    try {
        const deletedData = await prismaConnection.workExperience.delete({
        where: {
            id: workExperienceId,
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteWorkExperience: ", e);
    }
}

async function deletePublicaion(publicationId) {
    try {
        const deletedData = await prismaConnection.publication.delete({
        where: {
            id: publicationId,
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deletePublication: ", e);
    }
}



async function deleteAchievement(achievementId) {
    try {
        const deletedData = await prismaConnection.achievement.delete({
        where: {
            id: achievementId,
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteAchievement: ", e);
    }
}

async function deleteProject(projectId) {
    try {
        const deletedData = await prismaConnection.project.delete({
        where: {
            id: projectId,
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteProject: ", e);
    }
}

async function deleteTagsFromProject(projectId, tagIdList){
    try {
        const deletedData = await prismaConnection.project.update({
        where: {
            id: projectId,
        },
        data: {
            tags: {
                disconnect: tagIdList.map((tagId) => {
                    return {
                        id: tagId,
                    };
                }),
            },
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteTagsFromProject: ", e);
    }
}

async function deleteTagsFromPublication(publicationId, tagIdList){
    try {
        const deletedData = await prismaConnection.publication.update({
        where: {
            id: publicationId,
        },
        data: {
            tags: {
                disconnect: tagIdList.map((tagId) => {
                    return {
                        id: tagId,
                    };
                }),
            },
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteTagsFromPublication: ", e);
    }
}

async function deleteResearchInterestsFromFacultyProfile(facultyId, researchInterestIdList){
    try {
        const deletedData = await prismaConnection.facultyProfile.update({
        where: {
            user_id: facultyId,
        },
        data: {
            research_interests: {
                disconnect: researchInterestIdList.map((researchInterestId) => {
                    return {
                        id: researchInterestId,
                    };
                }),
            },
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteResearchInterestsFromFacultyProfile: ", e);
    }
}

async function deleteProfessionalSkillsFromStudentProfile(studentId, professionalSkillIdList){
    try {
        const deletedData = await prismaConnection.studentProfile.update({
        where: {
            user_id: studentId,
        },
        data: {
            professional_skills: {
                disconnect: professionalSkillIdList.map((professionalSkillId) => {
                    return {
                        id: professionalSkillId,
                    };
                }),
            },
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteProfessionalSkillsFromStudentProfile: ", e);
    }
}

async function deleteProfessionalInterestsFromStudentProfile(studentId, professionalInterestIdList){
    try {
        const deletedData = await prismaConnection.studentProfile.update({
        where: {
            user_id: studentId,
        },
        data: {
            professional_interests: {
                disconnect: professionalInterestIdList.map((professionalInterestId) => {
                    return {
                        id: professionalInterestId,
                    };
                }),
            },
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteProfessionalInterestsFromStudentProfile: ", e);
    }
}

async function deleteUserFromProject(projectId, userId){
    try {
        const deletedData = await prismaConnection.project.update({
        where: {
            id: projectId,
        },
        data: {
            users: {
                disconnect: {
                    id: userId,
                },
            },
        },
        });
        return deletedData;
    } catch (e) {
        console.error("Error in deleteUserFromProject: ", e);
    }
}

module.exports = {
    deleteUserProfile,
    deleteProject,
    deleteAchievement,
    deleteWorkExperience,
    deletePublicaion,
    deleteTagsFromProject,
    deleteTagsFromPublication,
    deleteResearchInterestsFromFacultyProfile,
    deleteProfessionalSkillsFromStudentProfile,
    deleteProfessionalInterestsFromStudentProfile,
    deleteUserFromProject,
    deleteTimelineEvent,
}