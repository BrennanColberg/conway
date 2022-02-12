/*
  Warnings:

  - You are about to drop the column `playerGameId` on the `GameState` table. All the data in the column will be lost.
  - You are about to drop the column `playerUserId` on the `GameState` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "GameState" DROP CONSTRAINT "GameState_playerGameId_playerUserId_fkey";

-- AlterTable
ALTER TABLE "GameState" DROP COLUMN "playerGameId",
DROP COLUMN "playerUserId";
