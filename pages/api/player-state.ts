import { NextApiHandler } from "next"
import computeNextGameState from "../../lib/computeNextGameState"
import getCurrentGameState from "../../lib/getCurrentGameState"
import prisma from "../../prisma/client"

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== "POST") return res.status(405).send("invalid method")
	const gameId = req.body.gameId as string
	if (!gameId) return res.status(400).send("invalid gameId")
	const player = req.body.player as number
	if (typeof player !== "number") return res.status(400).send("invalid player")
	const moves = req.body.moves as number[]
	if (!moves || !Array.isArray(moves)) return res.status(400).send("invalid moves")
	const gameState = await getCurrentGameState(gameId)
	if (player >= gameState.game.playerCount) return res.status(400).send("invalid player")
	const moveCount = gameState.moves[player]
	if (moves.length > moveCount) return res.status(400).send("too many moves selected")

	const playerState = await prisma.playerState.update({
		where: { gameId_player: { gameId, player } },
		data: { ready: true, moves },
	})

	// if all players are ready, trigger the next evaluation
	const playerStates = await prisma.playerState.aggregate({
		where: { gameId, ready: true },
		_count: { ready: true },
	})
	if (playerStates._count.ready === gameState.game.playerCount) {
		await computeNextGameState(gameId)
	}

	res.status(200).json(playerState)
}

export default handler
