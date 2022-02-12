import { CellState, Game, GameState, Player } from "@prisma/client"
import { GetServerSideProps } from "next"
import Board from "../components/Board"
import prisma from "../prisma/client"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const gameId = context.query.gameId as string
	const gameState = await prisma.gameState.findFirst({
		where: { gameId },
		orderBy: { turn: "desc" },
		include: {
			game: { include: { players: true } },
			cellStates: { orderBy: { index: "desc" }, include: { player: { select: { color: true } } } },
		},
	})
	return {
		props: {
			gameState,
			game: gameState.game,
			players: gameState.game.players,
		},
	}
}

export default function IndexPage({
	gameState,
	game,
}: {
	gameState: GameState & { cellStates: (CellState & { player?: Pick<Player, "color"> })[] }
	game: Game
}): JSX.Element {
	return (
		<main>
			<div>
				<li>
					turn: <span id="turn">2</span>
				</li>
				<li>
					your color: <span id="color">blue</span>
				</li>
				<li>
					upcoming steps: <span id="steps">1</span>
				</li>
				<li>
					remaining moves: <span id="moves">8</span>
				</li>
				<button>Submit Moves</button>
			</div>

			<Board size={game.size} cellStates={gameState.cellStates} />
		</main>
	)
}
