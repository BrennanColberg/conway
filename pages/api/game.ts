import { Player } from "@prisma/client"
import { NextApiHandler } from "next"
import prisma from "../../prisma/client"

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== "POST") return res.status(405).send("wrong method")
	const id = req.body.id as string | undefined
	const size = (req.body.size as number) || 10
	const players = (req.body.players as Pick<Player, "userId" | "color">[]) || []

	const game = await prisma.game.create({
		data: {
			id,
			size,
			players: { createMany: { data: players } },
		},
		include: { players: true },
	})

	const cellStates = [...Array(game.size * game.size)].map((_, index) => {
		const alive = Math.random() > 0.5
		if (!alive) return { index, alive: false }
		const playerIndex = Math.floor(Math.random() * game.players.length)
		const player = game.players[playerIndex]
		return { index, alive: true, playerUserId: player.userId, playerGameId: player.gameId }
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

	res.status(200).json({ game, gameState })
}

export default handler
