/*
  Warnings:

  - The primary key for the `CellState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Game` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `GameState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Player` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `PlayerState` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "CellState" DROP CONSTRAINT "CellState_gameStateGameId_gameStateTurn_fkey";

-- DropForeignKey
ALTER TABLE "CellState" DROP CONSTRAINT "CellState_userId_fkey";

-- DropForeignKey
ALTER TABLE "GameState" DROP CONSTRAINT "GameState_gameId_fkey";

-- DropForeignKey
ALTER TABLE "GameState" DROP CONSTRAINT "GameState_playerGameId_playerUserId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_gameId_fkey";

-- DropForeignKey
ALTER TABLE "Player" DROP CONSTRAINT "Player_userId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerState" DROP CONSTRAINT "PlayerState_gameStateGameId_gameStateTurn_fkey";

-- DropForeignKey
ALTER TABLE "PlayerState" DROP CONSTRAINT "PlayerState_playerGameId_playerUserId_fkey";

-- AlterTable
ALTER TABLE "CellState" DROP CONSTRAINT "CellState_pkey",
ALTER COLUMN "gameStateGameId" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "userId" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "CellState_pkey" PRIMARY KEY ("index", "gameStateGameId", "gameStateTurn");

-- AlterTable
ALTER TABLE "Game" DROP CONSTRAINT "Game_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "Game_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "GameState" DROP CONSTRAINT "GameState_pkey",
ALTER COLUMN "gameId" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "playerGameId" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "playerUserId" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "GameState_pkey" PRIMARY KEY ("gameId", "turn");

-- AlterTable
ALTER TABLE "Player" DROP CONSTRAINT "Player_pkey",
ALTER COLUMN "gameId" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "userId" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "Player_pkey" PRIMARY KEY ("gameId", "userId");

-- AlterTable
ALTER TABLE "PlayerState" DROP CONSTRAINT "PlayerState_pkey",
ALTER COLUMN "playerGameId" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "playerUserId" SET DATA TYPE VARCHAR(36),
ALTER COLUMN "gameStateGameId" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "PlayerState_pkey" PRIMARY KEY ("playerUserId", "gameStateGameId", "gameStateTurn");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" SET DATA TYPE VARCHAR(36),
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "GameState" ADD CONSTRAINT "GameState_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GameState" ADD CONSTRAINT "GameState_playerGameId_playerUserId_fkey" FOREIGN KEY ("playerGameId", "playerUserId") REFERENCES "Player"("gameId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellState" ADD CONSTRAINT "CellState_gameStateGameId_gameStateTurn_fkey" FOREIGN KEY ("gameStateGameId", "gameStateTurn") REFERENCES "GameState"("gameId", "turn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CellState" ADD CONSTRAINT "CellState_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerState" ADD CONSTRAINT "PlayerState_gameStateGameId_gameStateTurn_fkey" FOREIGN KEY ("gameStateGameId", "gameStateTurn") REFERENCES "GameState"("gameId", "turn") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerState" ADD CONSTRAINT "PlayerState_playerGameId_playerUserId_fkey" FOREIGN KEY ("playerGameId", "playerUserId") REFERENCES "Player"("gameId", "userId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Player" ADD CONSTRAINT "Player_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
