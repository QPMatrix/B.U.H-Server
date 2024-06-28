/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `User` ADD COLUMN `refreshToken` VARCHAR(191) NULL,
    ADD COLUMN `refreshTokenExpires` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_refreshToken_key` ON `User`(`refreshToken`);
