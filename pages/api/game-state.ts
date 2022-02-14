import { NextApiHandler } from "next"
import getCurrentGameState from "../../lib/getCurrentGameState"
import prisma from "../../prisma/client"

const handler: NextApiHandler = async (req, res) => {
	if (req.method === "GET") {
		const gameId = req.query.gameId as string
		const turn = req.query.turn && parseInt(req.query.turn as string)
		const result = await getCurrentGameState(gameId, turn)
		return res.status(200).json(result)
	}

	if (req.method !== "POST") return res.status(405).send("invalid method")
	const gameId = req.body.gameId as string
	if (gameId === undefined) return res.status(400).send("no gameId")

	const lastState = await prisma.gameState.findFirst({
		where: { gameId },
		include: { game: true },
		orderBy: { turn: "desc" },
	})
	if (!lastState) return res.status(404).send("game state not found")

	const size = lastState.game.size
	const cells = lastState.cells.map((cell, i) => {
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
			.map((ni) => lastState.cells[ni])
		const aliveNeighbors = neighbors.filter((neighbor) => neighbor !== -1)

		if (cell !== -1) {
			if (aliveNeighbors.length <= 1 || aliveNeighbors.length >= 4) return -1
			// die
			else return cell
		} else {
			if (aliveNeighbors.length === 3)
				// come to life
				return aliveNeighbors[0] === aliveNeighbors[1] || aliveNeighbors[0] === aliveNeighbors[2]
					? aliveNeighbors[0]
					: aliveNeighbors[1] === aliveNeighbors[2]
					? aliveNeighbors[1]
					: aliveNeighbors[Math.floor(Math.random() * 3)]
			else return cell
		}
	})

	const newState = await prisma.gameState.create({
		data: {
			turn: lastState.turn + 1,
			game: { connect: { id: lastState.gameId } },
			cells,
			moves: [...Array(lastState.game.playerCount)].map(() => 5),
		},
	})

	res.status(200).json(newState)
}

export default handler
