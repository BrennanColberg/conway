import { useRouter } from "next/router"
import Board from "../components/Board"
import useGameState from "../hooks/useGameState"

export default function IndexPage(): JSX.Element {
	const router = useRouter()
	const rawPlayer = router.query.player as string | undefined
	const player = rawPlayer === undefined ? undefined : parseInt(rawPlayer)
	const gameState = useGameState(router.query.gameId as string)
	console.log({ gameState })

	if (!gameState) return null

	return (
		<main>
			{player && (
				<div>
					<li>
						turn: <span id="turn">{gameState.turn + 1}</span>
					</li>
					<li>
						your player: <span id="player">{player}</span>
					</li>
					<li>
						remaining moves: <span id="moves">{gameState.moves[player]}</span>
					</li>
					<button>Submit Moves</button>
				</div>
			)}

			<Board size={gameState.game.size} cells={gameState.cells} />
		</main>
	)
}
