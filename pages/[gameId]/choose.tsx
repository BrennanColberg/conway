import { Game } from "@prisma/client"
import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { CSSProperties, useState } from "react"
import PLAYER_COLORS from "../../lib/config/colors"
import prisma from "../../prisma/client"

export const getServerSideProps: GetServerSideProps = async (context) => {
	const game = await prisma.game.findUnique({ where: { id: context.query.gameId as string } })
	if (!game) return { notFound: true }
	return { props: { game } }
}

export default function ChoosePlayerPage({ game }: { game: Game }): JSX.Element {
	const router = useRouter()
	const [chosenColor, setChosenColor] = useState<string>(undefined)
	return (
		<div id="choose">
			{PLAYER_COLORS.slice(0, game.playerCount).map((color, index) => (
				<button
					style={{ "--color": color } as CSSProperties}
					disabled={chosenColor === color}
					key={index}
					onClick={() => {
						setChosenColor(color)
						router.push(`/${router.query.gameId as string}/play?player=${index}`)
					}}
				>
					Play as {color}
				</button>
			))}
		</div>
	)
}
