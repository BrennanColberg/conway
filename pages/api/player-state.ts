import { NextApiHandler } from "next"
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

	// TODO evaluate if all players are ready

	res.status(200).json(playerState)
}

export default handler
