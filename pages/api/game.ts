import { NextApiHandler } from "next"
import prisma from "../../prisma/client"

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== "POST") return res.status(405).send("wrong method")
	const id = req.body.id as string | undefined
	let size = req.body.size as number | undefined
	if (size === undefined || size < 4) size = 8
	let playerCount = req.body.playerCount as number | undefined
	if (playerCount === undefined || playerCount < 2) playerCount = 2
	let fill = req.body.fill as number | undefined
	if (fill === undefined || fill < 0 || fill > 1) fill = 0.5

	const game = await prisma.game.create({
		data: {
			id,
			size,
			playerCount,
			playerStates: {
				createMany: {
					data: [...Array(playerCount)].map((_, player) => ({ moves: [], ready: false, player })),
				},
			},
		},
	})

	// generate an initial configuration of cells for the full board
	const cells = [...Array(game.size * game.size)].map(() => {
		// check if the cell is empty
		if (Math.random() > fill) return -1
		// if not empty, assign to a random player
		return Math.floor(Math.random() * playerCount)
	})

	const gameState = await prisma.gameState.create({
		data: {
			game: { connect: { id: game.id } },
			turn: 0,
			cells,
			moves: [...Array(game.playerCount)].map(() => 5),
		},
	})

	res.status(200).json({ game, gameState })
}

export default handler
