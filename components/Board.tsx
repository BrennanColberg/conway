import classNames from "classnames"
import { CSSProperties } from "react"

export default function Board({
	size,
	cells,
	selected,
	onClick,
}: {
	size: number
	cells: number[]
	selected: Set<number>
	onClick: (i: number) => void
}): JSX.Element {
	const colors = process.env.NEXT_PUBLIC_PLAYER_COLORS
		? JSON.parse(process.env.NEXT_PUBLIC_PLAYER_COLORS)
		: []
	return (
		<div className="board" style={{ "--size": size } as CSSProperties}>
			{cells.map((cell, i) => (
				<div
					key={i}
					className={classNames({ alive: cell !== -1, selected: selected.has(i) })}
					style={{ "--color": colors[cell] } as CSSProperties}
					onClick={() => onClick(i)}
				/>
			))}
		</div>
	)
}
