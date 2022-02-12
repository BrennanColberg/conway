/*
  Warnings:

  - You are about to drop the column `userId` on the `CellState` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CellState" DROP CONSTRAINT "CellState_userId_fkey";

-- AlterTable
ALTER TABLE "CellState" DROP COLUMN "userId",
ADD COLUMN     "playerGameId" VARCHAR(36),
ADD COLUMN     "playerUserId" VARCHAR(36);

-- AddForeignKey
ALTER TABLE "CellState" ADD CONSTRAINT "CellState_playerGameId_playerUserId_fkey" FOREIGN KEY ("playerGameId", "playerUserId") REFERENCES "Player"("gameId", "userId") ON DELETE SET NULL ON UPDATE CASCADE;
