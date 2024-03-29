import { db } from "@rithik/bocchi-the-website/server/db"
import { sql } from "drizzle-orm"
import { type NextRequest } from "next/server"

const validEpisodes = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "op",
  "ed1",
  "ed2",
  "ed3",
]

export async function GET(req: NextRequest) {
  const source = req.nextUrl.searchParams.get("episode")?.trim()?.toLowerCase()

  if (!!source && !validEpisodes.includes(source)) {
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
