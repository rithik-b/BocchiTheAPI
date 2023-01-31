import { createTRPCRouter, publicProcedure } from "./trpc"
import { z } from "zod"
import { env } from "@env/server.mjs"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  frame: publicProcedure.input(z.ostring()).query(({ input }) => {
    const apiRoute = `${env.API_URL}/api/frames${
      !input ? "" : `?episode=${input}`
    }`
    return fetch(apiRoute).then((res) => res.json()) as Promise<FrameResponse>
  }),
})

interface FrameResponse {
  url: string
}

// export type definition of API
export type AppRouter = typeof appRouter
