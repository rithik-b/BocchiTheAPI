import {
  createTRPCRouter,
  publicProcedure,
} from "@rithik/bocchi-the-website/server/api/trpc"
import { db } from "../../db"
import { sql } from "drizzle-orm"
import { TRPCError } from "@trpc/server"

export const framesRouter = createTRPCRouter({
  randomFrame: publicProcedure.query(async () => {
    const frame = await db.query.frames.findFirst({ orderBy: sql`RANDOM()` })

    if (!frame) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No frames found",
      })
    }

    const url = `img/${frame.id}.png`

    return {
      url,
      source: frame.source,
      timestamp: frame.timestamp,
    }
  }),
})
