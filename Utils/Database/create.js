const prismaClient = require('./prisma-client');

const prismaConnection = prismaClient();

async function createStudentProfile(studentProfile){
    await prismaConnection.user.create({
        data:{
            name: studentProfile.name,
            email: studentProfile.email,
            role:"Student",
            password: studentProfile.password,
            mobile_no: studentProfile.mobile_no,
            student_profile:{
                    create:{
                        degree_name: studentProfile.degree_name,
                        degree_start_date: studentProfile.degree_start_date,
                        degree_end_date: studentProfile.degree_end_date,
                    }
                }
            }
        }
    )
}

async function createFacultyProfile(facultyProfile){
    await prismaConnection.user.create({
        data:{
            name: facultyProfile.name,
            email: facultyProfile.email,
            password: facultyProfile.password,
            role:"Faculty",
            mobile_no: facultyProfile.mobile_no,
            faculty_profile:{
                    create:{
                        google_scholar_url: facultyProfile.google_scholar_url,
                    }
                }
            }
        }
    )
}


async function createResearchInterest(researchInterest){
    await prismaConnection.researchInterest.create({
        data:{
            name: researchInterest.name,
        }
    })
}

async function createProfessionalInterest(professionalInterest){
    await prismaConnection.professionalInterest.create({
        data:{
            name: professionalInterest.name,
        }
    })
}

async function createProfessionalSkill(professionalSkill){
    await prismaConnection.professionalSkill.create({
        data:{
            name: professionalSkill.name,
        }
    })
}

async function createWorkExperience(workExperience){
    await prismaConnection.workExperience.create({
        data:{
            company: workExperience.company,
            designation: workExperience.designation,
            start_date: workExperience.start_date,
            end_date: workExperience.end_date,
            student_profile:{
                connect:{
                    user_id: workExperience.user_id
                }
            }
        }
    })
}

async function createPublication(publication){
    await prismaConnection.publication.create({
        data:{
            title: publication.title,
            abstract: publication.abstract,
            link: publication.link,
            date: publication.date,
            faculty_profile:{
                connect:{
                    user_id: publication.user_id
                }
            }
        }
    })
}

async function createAchievement(achievement){
    await prismaConnection.achievement.create({
        data:{
            title: achievement.title,
            description: achievement.description,
            date: achievement.date,
            link: achievement.link,
            student_profile:{
                connect:{
                    user_id: achievement.user_id
                }
            }
        }
    })
}

async function addResearchInterestsToFacultyProfile(facultyId, researchInterestIds) {
    try {
        const faculty = await prismaConnection.facultyProfile.findUnique({
            where: { user_id: facultyId },
            include: { research_interests: true },
        });

        if (!faculty) throw new Error(`Faculty with ID ${facultyId} not found`);
        const existingResearchInterestIds = faculty.researchInterests ? faculty.researchInterests.map(researchInterest => researchInterest.id) : [];
        const newResearchInterestIds = researchInterestIds.filter(researchInterestId => !existingResearchInterestIds.includes(researchInterestId)) ?? [];

        await prismaConnection.facultyProfile.update({
            where: { user_id: facultyId },
            data: {
                research_interests: {
                    connect: newResearchInterestIds.map(researchInterestId => ({ id: researchInterestId })),
                },
            },
        });
    } catch (error) {
        console.error(`Error adding research interests to faculty profile: ${error.message}`);
    }
}

async function addProfessionalInterestsToStudentProfile(studentId, professionalInterestIds) {
    try {
        const student = await prismaConnection.studentProfile.findUnique({
            where: { user_id: studentId },
            include: { professional_interests: true },
        });

        if (!student) throw new Error(`Student with ID ${studentId} not found`);
        const existingProfessionalInterestIds = student.professionalInterests ? student.professionalInterests.map(professionalInterest => professionalInterest.id) : [];
        const newProfessionalInterestIds = professionalInterestIds.filter(professionalInterestId => !existingProfessionalInterestIds.includes(professionalInterestId));

        await prismaConnection.studentProfile.update({
            where: { user_id: studentId },
            data: {
                professional_interests: {
                    connect: newProfessionalInterestIds.map(professionalInterestId => ({ id: professionalInterestId })),
                },
            },
        });
    } catch (error) {
        console.error(`Error adding professional interests to student profile: ${error.message}`);
    }
}

async function addProfessionalSkillsToStudentProfile(studentId, professionalSkillIds) {
    try {
        const student = await prismaConnection.studentProfile.findUnique({
            where: { user_id: studentId },
            include: { professional_skills: true },
        });

        if (!student) throw new Error(`Student with ID ${studentId} not found`);
        //check for undefined

        const existingProfessionalSkillIds = student.professional_skills ? student.professional_skills.map(professionalSkill => professionalSkill.id) : [];
        const newProfessionalSkillIds = professionalSkillIds.filter(professionalSkillId => !existingProfessionalSkillIds.includes(professionalSkillId));

        await prismaConnection.studentProfile.update({
            where: { user_id: studentId },
            data: {
                professional_skills: {
                    connect: newProfessionalSkillIds.map(professionalSkillId => ({ id: professionalSkillId })),
                },
            },
        });
    } catch (error) {
        console.error(`Error adding professional skills to student profile: ${error.message}`);
    }
}



async function createProject(project){
    await prismaConnection.project.create({
        data:{
            title: project.title,
            description: project.description,
            end_date: project.end_date,
            max_members: project.max_members,
            creator:{
                connect:{
                    id: project.creator_id
                }
            }
        }
    })
}

async function addUserToProject(user_id, project_id){
    await prismaConnection.project.update({
        where: { id: project_id },
        data: {
            users: {
                connect: { id: user_id },
            },
        },
    });

}

async function createTag(tag){
    await prismaConnection.tag.create({
        data:{
            name: tag.name,
        }
    })
}

async function addTagsToProject(projectId, tagIds) {
    try {
        const project = await prismaConnection.project.findUnique({
            where: { id: projectId },
            include: { tags: true },
        });

        if (!project) throw new Error(`Project with ID ${projectId} not found`);
        const existingTagIds = project.tags ? project.tags.map(tag => tag.id) : [];
        const newTagIds = tagIds.filter(tagId => !existingTagIds.includes(tagId));

        await prismaConnection.project.update({
            where: { id: projectId },
            data: {
                tags: {
                    connect: newTagIds.map(tagId => ({ id: tagId })),
                },
            },
        });
    } catch (error) {
        console.error(`Error adding tags to project: ${error.message}`);
    }
}

async function addTagsToPublication(publicationId, tagIds) {
    try {
        const publication = await prismaConnection.publication.findUnique({
            where: { id: publicationId },
            include: { tags: true },
        });

        if (!publication) throw new Error(`Publication with ID ${publicationId} not found`);
        const existingTagIds = publication.tags ? publication.tags.map(tag => tag.id) : [];
        const newTagIds = tagIds.filter(tagId => !existingTagIds.includes(tagId));

        await prismaConnection.publication.update({
            where: { id: publicationId },
            data: {
                tags: {
                    connect: newTagIds.map(tagId => ({ id: tagId })),
                },
            },
        });
    } catch (error) {
        console.error(`Error adding tags to publication: ${error.message}`);
    }
}

async function createTimeLineEvent(timeLineEvent, projectId){
    await prismaConnection.timeLineEvent.create({
        data:{
            title: timeLineEvent.title,
            description: timeLineEvent.description,
            date: timeLineEvent.date,
            project:{
                connect:{
                    project_id: projectId
                }
            }
        }
    })
}

async function createNotification(notification){
    await prismaConnection.notification.create({
        data:{
            title: notification.title,
            description: notification.description,
            date: notification.date,
            user_id: notification.user_id
        }
    })
}

module.exports =  {
    createStudentProfile,
    createFacultyProfile,
    createAchievement,
    createResearchInterest,
    createProfessionalInterest,
    createProfessionalSkill,
    createWorkExperience,
    createPublication,
    addResearchInterestsToFacultyProfile,
    addProfessionalInterestsToStudentProfile,
    addProfessionalSkillsToStudentProfile,
    createProject,
    createTag,
    addTagsToProject,
    addTagsToPublication,
    createTimeLineEvent,
    createNotification,
    addUserToProject
}

