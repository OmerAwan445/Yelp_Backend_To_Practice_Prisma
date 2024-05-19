/*
  Warnings:

  - You are about to drop the column `totalRating` on the `Restaurant` table. All the data in the column will be lost.
  - Added the required column `averageRating` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "totalRating",
ADD COLUMN     "averageRating" DOUBLE PRECISION NOT NULL DEFAULT 0;
