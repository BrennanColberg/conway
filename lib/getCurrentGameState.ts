import { Game, GameState } from "@prisma/client"
import prisma from "../prisma/client"

export default async function getCurrentGameState(
	gameId: string,
	turn?: number
): Promise<GameState & { game: Game }> {
	return prisma.gameState.findFirst({
		where: turn === undefined ? { gameId } : { gameId, turn },
		orderBy: { turn: "desc" },
		include: { game: true },
	})
}
