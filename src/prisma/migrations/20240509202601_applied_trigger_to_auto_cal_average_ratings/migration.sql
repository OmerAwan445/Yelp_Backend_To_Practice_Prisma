/*
  Warnings:

  - You are about to alter the column `priceRange` on the `Restaurant` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(60,2)`.

*/
-- AlterTable
ALTER TABLE "Restaurant" ALTER COLUMN "priceRange" SET DATA TYPE DECIMAL(60,2);

