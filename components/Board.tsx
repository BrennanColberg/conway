import classNames from "classnames"
import { CSSProperties } from "react"

export default function Board({ size, cells }: { size: number; cells: number[] }): JSX.Element {
	const colors = process.env.PLAYER_COLORS ? JSON.parse(process.env.PLAYER_COLORS) : []
	return (
		<div className="board" style={{ "--size": size } as CSSProperties}>
			{cells.map((cell, i) => (
				<div
					key={i}
					className={classNames({ alive: cell !== -1 })}
					style={{ "--color": colors[cell] } as CSSProperties}
				/>
			))}
		</div>
	)
}
