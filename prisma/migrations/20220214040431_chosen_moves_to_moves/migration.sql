/*
  Warnings:

  - You are about to drop the column `chosenMoves` on the `PlayerState` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerState" DROP COLUMN "chosenMoves",
ADD COLUMN     "moves" INTEGER[];
