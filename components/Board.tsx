import classNames from "classnames"
import { CSSProperties } from "react"
import PLAYER_COLORS from "../lib/config/colors"

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
	return (
		<div className="board" style={{ "--size": size } as CSSProperties}>
			{cells.map((cell, i) => (
				<div
					key={i}
					className={classNames({ alive: cell !== -1, selected: selected.has(i) })}
					style={{ "--color": PLAYER_COLORS[cell] } as CSSProperties}
					onClick={() => onClick(i)}
				/>
			))}
		</div>
	)
}
