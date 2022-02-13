import { CellState } from "@prisma/client"
import { NextApiHandler } from "next"
import prisma from "../../prisma/client"

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== "POST") return res.status(405).send("invalid method")
	const gameId = req.body.gameId as string
	if (gameId === undefined) return res.status(400).send("no gameId")

	const lastState = await prisma.gameState.findFirst({
		where: { gameId },
		include: {
			game: true,
			cellStates: {
				orderBy: { index: "asc" },
				select: { playerGameId: true, playerUserId: true, alive: true, index: true },
			},
			playerStates: { select: { moves: true, playerGameId: true, playerUserId: true } },
		},
		orderBy: { turn: "desc" },
	})
	if (!lastState) return res.status(404).send("game state not found")

	const size = lastState.game.size
	const cellStates: Omit<CellState, "gameStateTurn" | "gameStateGameId">[] =
		lastState.cellStates.map((cellState) => {
			const i = cellState.index
			const x = i % size
			const y = Math.floor(i / size)
			const onTop = y === 0
			const onBottom = y === size - 1
			const onLeft = x === 0
			const onRight = x === size - 1
			const neighbors = [
				onTop || onLeft ? undefined : i - size - 1,
				onTop ? undefined : i - size,
				onTop || onRight ? undefined : i - size + 1,
				onLeft ? undefined : i - 1,
				onRight ? undefined : i + 1,
				onBottom || onLeft ? undefined : i + size - 1,
				onBottom ? undefined : i + size,
				onBottom || onRight ? undefined : i + size + 1,
			]
				.filter((ni) => ni !== undefined)
				.map((ni) => lastState.cellStates[ni])
			const aliveNeighbors = neighbors.filter((neighbor) => neighbor.alive)

			if (cellState.alive) {
				if (aliveNeighbors.length <= 1 || aliveNeighbors.length >= 4) {
					// die
					return {
						index: cellState.index,
						alive: false,
						playerGameId: null,
						playerUserId: null,
					}
				} else return cellState
			} else {
				if (aliveNeighbors.length === 3) {
					// come to life
					const userIds = aliveNeighbors.map((neighbor) => neighbor.playerUserId)
					const userId =
						userIds[0] === userIds[1] || userIds[0] === userIds[2]
							? userIds[0]
							: userIds[1] === userIds[2]
							? userIds[1]
							: userIds[Math.floor(Math.random() * 3)]
					return {
						playerUserId: userId,
						playerGameId: lastState.gameId,
						alive: true,
						index: cellState.index,
					}
				} else return cellState
			}
		})

	const newState = await prisma.gameState.create({
		data: {
			turn: lastState.turn + 1,
			game: { connect: { id: lastState.gameId } },
			playerStates: { createMany: { data: lastState.playerStates } },
			cellStates: { createMany: { data: cellStates } },
		},
	})

	res.status(200).json(newState)
}

export default handler
