/*
  Warnings:

  - Added the required column `gender` to the `patients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "patients" ADD COLUMN     "gender" "Gender" NOT NULL;
