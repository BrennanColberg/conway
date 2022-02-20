import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Board from "../../components/Board"
import useGameState from "../../hooks/useGameState"
import PLAYER_COLORS from "../../lib/config/colors"

export default function GamePage(): JSX.Element {
	const router = useRouter()
	const rawPlayer = router.query.player as string | undefined
	const player = rawPlayer === undefined ? undefined : parseInt(rawPlayer)
	const gameState = useGameState(router.query.gameId as string)
	const [selected, setSelected] = useState<Set<number>>(new Set())
	useEffect(() => {
		setSelected(new Set())
	}, [gameState])

	if (!gameState) return null

	const maxMoves = gameState?.moves[player]
	const remainingMoves = maxMoves - selected.size

	return (
		<main>
			{player !== undefined ? (
				<div>
					<li>
						turn: <span id="turn">{gameState.turn + 1}</span>
					</li>
					<li>
						your player:{" "}
						<span
							id="player"
							style={{ color: PLAYER_COLORS[player], backgroundColor: "#eee", fontWeight: "bold" }}
						>
							{PLAYER_COLORS[player].toUpperCase()}
						</span>
					</li>
					<li>
						remaining moves:{" "}
						<span id="moves">
							{remainingMoves}/{maxMoves}
						</span>
					</li>
				</div>
			) : null}

			<Board
				size={gameState.game.size}
				cells={gameState.cells}
				selected={selected}
				onClick={(i: number) => {
					setSelected((last) => {
						const result = new Set(last)
						if (result.has(i)) result.delete(i)
						else if (remainingMoves >= 1) result.add(i)
						return result
					})
				}}
			/>

			<button
				onClick={async () => {
					const playerState = await axios.post("/api/player-state", {
						gameId: gameState.gameId,
						player,
						moves: Array.from(selected).sort((a, b) => a - b),
					})
					console.log({ playerState })
				}}
			>
				Submit Moves
			</button>
		</main>
	)
}
