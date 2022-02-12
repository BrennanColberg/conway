import { CellState, Player } from "@prisma/client"
import classNames from "classnames"
import { CSSProperties } from "react"

export default function Board({
	size,
	cellStates,
}: {
	size: number
	cellStates: (CellState & { player?: Pick<Player, "color"> })[]
}): JSX.Element {
	return (
		<div className="board" style={{ "--size": size } as CSSProperties}>
			{cellStates.map((cellState) => (
				<div
					key={cellState.index}
					className={classNames({ alive: cellState.alive })}
					style={{ "--color": cellState.player?.color } as CSSProperties}
				/>
			))}
		</div>
	)
}
