import {
  createTRPCRouter,
  publicProcedure,
} from "@rithik/bocchi-the-website/server/api/trpc"
import { db } from "../../db"
import { sql } from "drizzle-orm"
import { TRPCError } from "@trpc/server"
import { type Episode } from "@rithik/bocchi-the-website/data/episode"

export const framesRouter = createTRPCRouter({
  randomFrame: publicProcedure.query(async () => {
    const randomFrame = await db.query.frames.findFirst({
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
  }),
})
