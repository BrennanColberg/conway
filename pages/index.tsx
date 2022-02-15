import axios from "axios"

export default function IndexPage(): JSX.Element {
	return (
		<form
			onSubmit={async (e) => {
				e.preventDefault()
				const response = await axios.post("/api/game", {})
				console.log({ response })
				const gameId = response.data.game.id
				console.log({ gameId })
				alert(gameId)
			}}
		>
			<button>Create New Game</button>
		</form>
	)
}
