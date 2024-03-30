"server only"

import { type Episode, episodes } from "@rithik/bocchi-the-website/data/episode"
import { db } from "@rithik/bocchi-the-website/server/db"
import { sql } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

const getRandomFrame = async (episode?: string | null) => {
  const sanitizedEpisode = episode?.trim().toLowerCase()

  if (!!sanitizedEpisode && !episodes.includes(sanitizedEpisode as Episode)) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Invalid episode",
    })
  }

  const randomFrame = await db.query.frames.findFirst({
    where: !!sanitizedEpisode
      ? (frame, { eq }) => eq(frame.source, sanitizedEpisode)
      : undefined,
    orderBy: sql`RANDOM()`,
  })

  if (!randomFrame) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No frames found",
    })
  }

  const lastFrame = await db.query.frames.findFirst({
    columns: { source: true, timestamp: true },
    where: (frame, { eq }) => eq(frame.source, randomFrame.source),
    orderBy: (frame, { desc }) => desc(frame.timestamp),
  })

  if (!lastFrame) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "No frames found",
    })
  }

  const url = `img/${randomFrame.id}.png`

  return {
    url,
    source: randomFrame.source as Episode,
    timestamp: randomFrame.timestamp,
    episodeDuration: lastFrame.timestamp,
  }
}

export default getRandomFrame
