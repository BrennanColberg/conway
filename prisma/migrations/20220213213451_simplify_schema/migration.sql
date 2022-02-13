/*
  Warnings:

  - You are about to drop the column `createdAt` on the `GameState` table. All the data in the column will be lost.
  - The primary key for the `PlayerState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `gameStateGameId` on the `PlayerState` table. All the data in the column will be lost.
  - You are about to drop the column `gameStateTurn` on the `PlayerState` table. All the data in the column will be lost.
  - You are about to drop the column `moves` on the `PlayerState` table. All the data in the column will be lost.
  - You are about to drop the column `playerGameId` on the `PlayerState` table. All the data in the column will be lost.
  - You are about to drop the column `playerUserId` on the `PlayerState` table. All the data in the column will be lost.
  - You are about to drop the `CellState` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Player` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `playerCount` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gameId` to the `PlayerState` table without a default value. This is not possible if the table is not empty.
  - Added the required column `player` to the `PlayerState` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CellState" DROP CONSTRAINT "CellState_gameStateGameId_gameStateTurn_fkey";

-- DropForeignKey
ALTER TABLE "CellState" DROP CONSTRAINT "CellState_playerGameId_playerUserId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerState" DROP CONSTRAINT "PlayerState_gameStateGameId_gameStateTurn_fkey";

-- DropForeignKey
ALTER TABLE "PlayerState" DROP CONSTRAINT "PlayerState_playerGameId_playerUserId_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "playerCount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "GameState" DROP COLUMN "createdAt",
ADD COLUMN     "cells" INTEGER[],
ADD COLUMN     "moves" INTEGER[];

-- AlterTable
ALTER TABLE "PlayerState" DROP CONSTRAINT "PlayerState_pkey",
DROP COLUMN "gameStateGameId",
DROP COLUMN "gameStateTurn",
DROP COLUMN "moves",
DROP COLUMN "playerGameId",
DROP COLUMN "playerUserId",
ADD COLUMN     "chosenMoves" INTEGER[],
ADD COLUMN     "gameId" VARCHAR(36) NOT NULL,
ADD COLUMN     "player" INTEGER NOT NULL,
ADD COLUMN     "ready" BOOLEAN NOT NULL DEFAULT false,
ADD CONSTRAINT "PlayerState_pkey" PRIMARY KEY ("gameId", "player");

-- DropTable
DROP TABLE "CellState";

-- DropTable
DROP TABLE "Player";

-- DropTable
DROP TABLE "User";

-- AddForeignKey
ALTER TABLE "PlayerState" ADD CONSTRAINT "PlayerState_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
