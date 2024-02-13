/*
  Warnings:

  - The primary key for the `FacultyProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `FacultyProfile` table. All the data in the column will be lost.
  - The primary key for the `StudentProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StudentProfile` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "_FacultyProfileToResearchInterest" DROP CONSTRAINT "_FacultyProfileToResearchInterest_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessionalInterestToStudentProfile" DROP CONSTRAINT "_ProfessionalInterestToStudentProfile_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProfessionalSkillToStudentProfile" DROP CONSTRAINT "_ProfessionalSkillToStudentProfile_B_fkey";

-- AlterTable
ALTER TABLE "FacultyProfile" DROP CONSTRAINT "FacultyProfile_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "FacultyProfile_pkey" PRIMARY KEY ("user_id");

-- AlterTable
ALTER TABLE "StudentProfile" DROP CONSTRAINT "StudentProfile_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("user_id");

-- AddForeignKey
ALTER TABLE "_FacultyProfileToResearchInterest" ADD CONSTRAINT "_FacultyProfileToResearchInterest_A_fkey" FOREIGN KEY ("A") REFERENCES "FacultyProfile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalInterestToStudentProfile" ADD CONSTRAINT "_ProfessionalInterestToStudentProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentProfile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfessionalSkillToStudentProfile" ADD CONSTRAINT "_ProfessionalSkillToStudentProfile_B_fkey" FOREIGN KEY ("B") REFERENCES "StudentProfile"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
