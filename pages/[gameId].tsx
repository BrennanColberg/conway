import { Game, GameState } from "@prisma/client"
import { GetServerSideProps } from "next"
import Board from "../components/Board"
import getCurrentGameState from "../lib/getCurrentGameState"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const gameId = context.query.gameId as string
	const player = context.query.userId as string
	const turn = context.query.turn as string
	const gameState = await getCurrentGameState(gameId, turn && parseInt(turn))
	return {
		props: {
			gameState,
			game: gameState.game,
			player,
		},
	}
}

export default function IndexPage({
	gameState,
	game,
	player,
}: {
	gameState: GameState
	game: Game
	player?: number
}): JSX.Element {
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

			<Board size={game.size} cells={gameState.cells} />
		</main>
	)
}
