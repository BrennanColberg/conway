import axios from "axios"
import { useRouter } from "next/router"
import { CSSProperties, useState } from "react"
import PLAYER_COLORS from "../lib/config/colors"

export default function IndexPage(): JSX.Element {
	const router = useRouter()
	const [playerCount, setPlayerCount] = useState<number>(2)
	const [fill, setFill] = useState<number>(0)
	const [size, setSize] = useState<number>(10)
	const [movesPerTurn, setMovesPerTurn] = useState<number>(5)
	const [submitted, setSubmitted] = useState<boolean>(false)

	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				setSubmitted(true)
				const response = await axios.post("/api/game", { playerCount, fill, size, movesPerTurn })
				console.log({ response })
				const gameId = response.data.game.id
				console.log({ gameId })
				await router.push(`/${gameId}/choose`)
			}}
		>
			<div>
				<label htmlFor="players">Players</label>
				<input
					name="players"
					type="number"
					min={1}
					max={PLAYER_COLORS.length}
					step={1}
					value={playerCount}
					onChange={(e) => setPlayerCount(e.target.valueAsNumber)}
					required
				/>
			</div>

			<div>
				<label htmlFor="size">Size</label>
				<input
					type="number"
					min={4}
					max={99}
					step={1}
					value={size}
					onChange={(e) => setSize(e.target.valueAsNumber)}
					required
				/>
			</div>

			<div>
				<label htmlFor="size">Initial Fill %</label>
				<input
					type="number"
					name="fill"
					min={0}
					max={100}
					step={10}
					value={Math.round(fill * 100)}
					onChange={(e) => setFill(e.target.valueAsNumber / 100)}
					required
				/>
			</div>

			<div>
				<label htmlFor="movesPerTurn">Moves / turn</label>
				<input
					type="number"
					name="movesPerTurn"
					min={1}
					step={1}
					value={movesPerTurn}
					onChange={(e) => setMovesPerTurn(e.target.valueAsNumber)}
					required
				/>
			</div>

			<button style={{ "--color": "black" } as CSSProperties} disabled={submitted}>
				{!submitted ? "Create Game" : "Creating Game..."}
			</button>
		</form>
	)
}
