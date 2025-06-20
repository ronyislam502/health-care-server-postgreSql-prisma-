/*
  Warnings:

  - A unique constraint covering the columns `[phone]` on the table `admins` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `doctors` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[phone]` on the table `patients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admins_phone_key" ON "admins"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "doctors_phone_key" ON "doctors"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "patients_phone_key" ON "patients"("phone");
