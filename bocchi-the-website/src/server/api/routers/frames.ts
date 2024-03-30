import {
  createTRPCRouter,
  publicProcedure,
} from "@rithik/bocchi-the-website/server/api/trpc"
import { z } from "zod"
import getRandomFrame from "../../getRandomFrame"

export const framesRouter = createTRPCRouter({
  randomFrame: publicProcedure.input(z.ostring()).query(({ input }) => {
    return getRandomFrame(input)
  }),
})
