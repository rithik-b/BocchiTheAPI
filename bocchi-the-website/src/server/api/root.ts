import { framesRouter } from "@rithik/bocchi-the-website/server/api/routers/frames"
import {
  createCallerFactory,
  createTRPCRouter,
} from "@rithik/bocchi-the-website/server/api/trpc"
import { bocchleRouter } from "./routers/bocchle"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  frames: framesRouter,
  bocchle: bocchleRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
