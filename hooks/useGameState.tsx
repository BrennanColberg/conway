import { Game, GameState } from "@prisma/client"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then((response) => response.json())

export default function useGameState(gameId: string): (GameState & { game: Game }) | undefined {
	const { data } = useSWR(`/api/game-state?gameId=${gameId}`, fetcher, {
		refreshInterval: 100,
	})
	return data
}
