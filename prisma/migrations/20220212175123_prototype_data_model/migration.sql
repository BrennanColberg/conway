-- CreateTable
CREATE TABLE "Game" (
    "id" UUID NOT NULL,
    "size" INTEGER NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GameState" (
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "turn" INTEGER NOT NULL,
    "gameId" UUID NOT NULL,
    "playerGameId" UUID NOT NULL,
    "playerUserId" UUID NOT NULL,

    CONSTRAINT "GameState_pkey" PRIMARY KEY ("gameId","turn")
);

-- CreateTable
CREATE TABLE "CellState" (
    "index" INTEGER NOT NULL,
    "gameStateGameId" UUID NOT NULL,
    "gameStateTurn" INTEGER NOT NULL,
    "alive" BOOLEAN NOT NULL,
    "userId" UUID,

    CONSTRAINT "CellState_pkey" PRIMARY KEY ("index","gameStateGameId","gameStateTurn")
);

-- CreateTable
CREATE TABLE "PlayerState" (
    "playerGameId" UUID NOT NULL,
    "playerUserId" UUID NOT NULL,
    "gameStateGameId" UUID NOT NULL,
    "gameStateTurn" INTEGER NOT NULL,
    "moves" INTEGER NOT NULL,

    CONSTRAINT "PlayerState_pkey" PRIMARY KEY ("playerUserId","gameStateGameId","gameStateTurn")
);

-- CreateTable
CREATE TABLE "Player" (
    "gameId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "color" TEXT NOT NULL,
    "ready" BOOLEAN NOT NULL DEFAULT false,
    "queuedToggles" INTEGER[],

    CONSTRAINT "Player_pkey" PRIMARY KEY ("gameId","userId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
