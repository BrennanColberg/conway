import { GameState } from "@prisma/client"
import prisma from "../prisma/client"

export default async function computeNextGameState(gameId: string): Promise<GameState> {
	const last = await prisma.gameState.findFirst({
		where: { gameId },
		orderBy: { turn: "desc" },
		include: { game: { include: { playerStates: true } } },
	})

	// calculate the impact of player moves
	const oldCells = last.cells.map((cell, i) => {
		const togglingPlayers = last.game.playerStates
			.filter((playerState) => playerState.moves.includes(i))
			.map((playerState) => playerState.player)
		// if zero or more than one toggle it, do nothing
		if (togglingPlayers.length !== 1) return cell
		// if it's alive, toggle it to dead
		if (cell !== -1) return -1
		// if it's dead, make it the toggler's color
		return togglingPlayers[0]
	})

	const size = last.game.size
	const cells = oldCells.map((cell, i) => {
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
			.map((ni) => oldCells[ni])
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

	const [gameState] = await Promise.all([
		prisma.gameState.create({
			data: {
				turn: last.turn + 1,
				game: { connect: { id: last.gameId } },
				cells,
				moves: [...Array(last.game.playerCount)].map(() => 5),
			},
		}),

		// reset players for next turn
		prisma.playerState.updateMany({ where: { gameId }, data: { ready: false, moves: [] } }),
	])

	return gameState
}
