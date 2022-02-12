import Board from "../components/Board"

export default function IndexPage(): JSX.Element {
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

			<Board size={20} />

			<div></div>
		</main>
	)
}
