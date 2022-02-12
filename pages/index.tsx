import Board from "../components/Board"

export default function IndexPage(): JSX.Element {
	return (
		<main>
			<div>
				<h1>
					Turn: <span id="turn">2</span>
				</h1>
				<h2>
					you are <span id="color">blue</span>
				</h2>
			</div>

			<Board />

			<div>
				<h1>
					Upcoming Steps: <span id="steps">1</span>
				</h1>
				<h2>
					Moves: <span id="moves">8</span>
				</h2>
				<button>Submit</button>
			</div>
		</main>
	)
}
