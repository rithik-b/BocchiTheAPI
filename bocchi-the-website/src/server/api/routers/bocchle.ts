import { type Episode, episodes } from "@rithik/bocchi-the-website/data/episode"
import {
  createTRPCRouter,
  publicProcedure,
} from "@rithik/bocchi-the-website/server/api/trpc"
import seedrandom from "seedrandom"
import { z } from "zod"
import { db } from "../../db"
import { count, eq } from "drizzle-orm"
import { framesTable } from "../../db/schema"
import { TRPCError } from "@trpc/server"
import { getDateString } from "@rithik/bocchi-the-website/lib/utils"

const bocchleEpisodes: Omit<Episode, "op">[] = episodes.filter(
  (e) => e !== "op",
)

const bocchleProcedure = publicProcedure
  .input(z.object({ todaysDate: z.date(), timezoneOffset: z.number() }))
  .use(({ input, next }) => {
    const { todaysDate, timezoneOffset } = input

    const episodeSeed = getDateString(todaysDate, timezoneOffset)
    const randomEpisode =
      bocchleEpisodes[
        Math.round(
          seedrandom(episodeSeed).quick() * (bocchleEpisodes.length - 1),
        )
      ]!

    return next({
      ctx: {
        episodeSeed,
        randomEpisode,
      },
    })
  })

export const bocchleRouter = createTRPCRouter({
  todaysFrames: bocchleProcedure.query(async ({ ctx }) => {
    const { episodeSeed, randomEpisode } = ctx

    const episodeFramesCount = (
      await db
        .select({ count: count() })
        .from(framesTable)
        .where(eq(framesTable.source, randomEpisode as string))
    )[0]?.count

    if (!episodeFramesCount)
      throw new TRPCError({
        message: "Couldn't count the number of frames",
        code: "INTERNAL_SERVER_ERROR",
      })

    const randomFramePromises = Array.from({ length: 6 }).map(
      async (_, attempt) => {
        const frameSeed = `${episodeSeed}${attempt}`
        const randomFrameIndex = Math.round(
          seedrandom(frameSeed).quick() * (episodeFramesCount - 1),
        )
        const randomFrame = await db.query.framesTable.findFirst({
          columns: {
            id: true,
            source: true,
          },
          where: (frame, { eq }) => eq(frame.source, randomEpisode as string),
          offset: randomFrameIndex,
        })
        return `img/${randomFrame?.id}.png`
      },
    )

    const randomFrames = await Promise.all(randomFramePromises)

    return {
      frames: randomFrames,
      // Yes this can be cheated but this game is for fun and I need to show the answer to the player eventually
      episode: randomEpisode,
    }
  }),
})
