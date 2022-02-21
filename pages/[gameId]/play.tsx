import axios from "axios"
import { useRouter } from "next/router"
import { CSSProperties, useEffect, useState } from "react"
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
		setSubmitted(false)
	}, [gameState])

	const [submitted, setSubmitted] = useState<boolean>(false)

	if (!gameState) return null

	const maxMoves = gameState?.moves[player]
	const remainingMoves = maxMoves - selected.size

	return (
		<main style={{ "--color": PLAYER_COLORS[player] } as CSSProperties}>
			{player !== undefined ? (
				<div id="info">
					<span id="player">you are {PLAYER_COLORS[player]}</span>
					<span id="moves">
						{remainingMoves} / {maxMoves}
					</span>
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
				disabled={submitted}
				onClick={async () => {
					setSubmitted(true)
					const playerState = await axios.post("/api/player-state", {
						gameId: gameState.gameId,
						player,
						moves: Array.from(selected).sort((a, b) => a - b),
					})
					console.log({ playerState })
				}}
			>
				{submitted ? "Waiting for other players" : "Submit your moves"}
			</button>
		</main>
	)
}
