import { NextApiHandler } from "next"
import prisma from "../../prisma/client"

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== "POST") return res.status(405).send("invalid method")
	const gameId = req.body.gameId as string
	if (gameId === undefined) return res.status(400).send("no gameId")

	const game = await prisma.game.findUnique({ where: { id: gameId }, include: { players: true } })
	if (!game) return res.status(404).send("game not found")

	const cellStates = [...Array(game.size * game.size)].map((_, index) => {
		const alive = Math.random() > 0.5
		if (!alive) return { index, alive: false }
		const playerIndex = Math.floor(Math.random() * game.players.length)
		const userId = game.players[playerIndex].userId
		return { index, alive: true, userId }
	})

	const gameState = await prisma.gameState.create({
		data: {
			game: { connect: { id: game.id } },
			turn: 0,
			cellStates: { createMany: { data: cellStates } },
			playerStates: {
				createMany: {
					data: game.players.map((player) => ({
						playerGameId: player.gameId,
						playerUserId: player.userId,
						moves: 10,
					})),
				},
			},
		},
	})

	res.status(200).json(gameState)
}

export default handler
