import { CellState, Game, GameState, Player, PlayerState } from "@prisma/client"
import { GetServerSideProps } from "next"
import Board from "../components/Board"
import prisma from "../prisma/client"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const gameId = context.query.gameId as string
	const userId = context.query.userId as string
	const turn = context.query.turn as string
	const [gameState, player] = await Promise.all([
		prisma.gameState.findFirst({
			where: !turn ? { gameId } : { gameId, turn: parseInt(turn) },
			orderBy: { turn: "desc" },
			include: {
				game: true,
				cellStates: {
					orderBy: { index: "desc" },
					include: { player: { select: { color: true } } },
				},
			},
		}),
		userId &&
			prisma.player.findUnique({
				where: { gameId_userId: { gameId, userId } },
				include: { playerStates: { orderBy: { gameStateTurn: "desc" } } },
			}),
	])
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
	player,
	game,
}: {
	gameState: GameState & { cellStates: (CellState & { player?: Pick<Player, "color"> })[] }
	player?: Player & { playerStates: PlayerState[] }
	game: Game
}): JSX.Element {
	return (
		<main>
			{player && (
				<div>
					<li>
						turn: <span id="turn">{gameState.turn + 1}</span>
					</li>
					<li>
						your color: <span id="color">{player.color}</span>
					</li>
					<li>
						remaining moves: <span id="moves">{player.playerStates[0].moves}</span>
					</li>
					<button>Submit Moves</button>
				</div>
			)}

			<Board size={game.size} cellStates={gameState.cellStates} />
		</main>
	)
}
