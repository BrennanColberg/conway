import { NextApiHandler } from "next"
import computeNextGameState from "../../lib/computeNextGameState"
import getCurrentGameState from "../../lib/getCurrentGameState"

const handler: NextApiHandler = async (req, res) => {
	if (req.method === "GET") {
		const gameId = req.query.gameId as string
		const turn = req.query.turn && parseInt(req.query.turn as string)
		const result = await getCurrentGameState(gameId, turn)
		return res.status(200).json(result)
	}

	if (req.method !== "POST") return res.status(405).send("invalid method")
	const gameId = req.body.gameId as string
	if (gameId === undefined) return res.status(400).send("no gameId")

	const newState = await computeNextGameState(gameId)

	res.status(200).json(newState)
}

export default handler
