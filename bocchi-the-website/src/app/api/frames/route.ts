import { type Episode, episodes } from "@rithik/bocchi-the-website/data/episode"
import { db } from "@rithik/bocchi-the-website/server/db"
import { sql } from "drizzle-orm"
import { type NextRequest } from "next/server"

export async function GET(req: NextRequest) {
  const source = req.nextUrl.searchParams.get("episode")?.trim()?.toLowerCase()

  if (!!source && !episodes.includes(source as Episode)) {
    return new Response("Invalid episode", {
      status: 400,
    })
  }

  const frame = await db.query.frames.findFirst({
    where: !!source ? (frame, { eq }) => eq(frame.source, source) : undefined,
    orderBy: sql`RANDOM()`,
  })

  if (!frame) {
    return new Response("No frames found", {
      status: 500,
    })
  }

  const url = `img/${frame.id}.png`

  return Response.json(
    {
      url,
      source: frame.source,
      timestamp: frame.timestamp,
    },
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
      },
    },
  )
}
