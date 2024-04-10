"use client"

import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCJotai } from "jotai-trpc"
import SuperJSON from "superjson"
import { type AppRouter } from "@rithik/bocchi-the-website/server/api/root"

export const api = createTRPCJotai<AppRouter>({
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      transformer: SuperJSON,
      url: getBaseUrl() + "/api/trpc",
      headers: () => {
        const headers = new Headers()
        headers.set("x-trpc-source", "nextjs-react")
        return headers
      },
    }),
  ],
})

function getBaseUrl() {
  if (typeof window !== "undefined") return window.location.origin
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  return `http://localhost:${process.env.PORT ?? 3000}`
}
