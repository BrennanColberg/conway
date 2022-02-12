import { CSSProperties } from "react"

export default function Board({ size }: { size: number }): JSX.Element {
	return (
		<div className="board" style={{ "--size": size } as CSSProperties}>
			{[...new Array(size * size)].map((i) => (
				<div key={i} />
			))}
		</div>
	)
}
