import axios from "axios"
import { useRouter } from "next/router"

export default function IndexPage(): JSX.Element {
	const router = useRouter()
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				const response = await axios.post("/api/game", {})
				console.log({ response })
				const gameId = response.data.game.id
				console.log({ gameId })
				await router.push(`/${gameId}?player=0`)
			}}
		>
			<button>Create New Game</button>
		</form>
	)
}
