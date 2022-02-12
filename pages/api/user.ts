import { NextApiHandler } from "next"
import prisma from "../../prisma/client"

const handler: NextApiHandler = async (req, res) => {
	if (req.method !== "POST") return res.status(405).send("invalid method")

	const user = await prisma.user.create({ data: {} })

	res.status(200).json(user)
}

export default handler
