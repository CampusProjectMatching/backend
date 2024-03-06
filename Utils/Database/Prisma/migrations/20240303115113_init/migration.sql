/*
  Warnings:

  - A unique constraint covering the columns `[roll_no]` on the table `StudentProfile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_roll_no_key" ON "StudentProfile"("roll_no");
