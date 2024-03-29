import { env } from "@boccher/env/server.mjs"
import { NextApiRequest, NextApiResponse } from "next"

async function swagger(req: NextApiRequest, res: NextApiResponse) {
  const swaggerUrl = `${env.INTERNAL_API_URL}/swagger/v1/swagger.json`
  const swaggerFile = await fetch(swaggerUrl)
  res.json(await swaggerFile.json())
}

export default swagger
