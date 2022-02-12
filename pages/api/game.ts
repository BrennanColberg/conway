import { Player } from "@prisma/client"
import { NextApiHandler } from "next"
import prisma from "../../prisma/client"

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== "POST") return res.status(405).send("wrong method")
	const id = req.body.id as string | undefined
	const size = (req.body.size as number) || 10
	const players = (req.body.players as Pick<Player, "userId" | "color">[]) || []

	const game = await prisma.game.create({
		data: {
			id,
			size,
			players: { createMany: { data: players } },
		},
	})

	res.status(200).json(game)
}

export default handler
