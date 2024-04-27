/*
  Warnings:

  - A unique constraint covering the columns `[userId,tokenType]` on the table `UserToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserToken_id_tokenType_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserToken_userId_tokenType_key" ON "UserToken"("userId", "tokenType");
