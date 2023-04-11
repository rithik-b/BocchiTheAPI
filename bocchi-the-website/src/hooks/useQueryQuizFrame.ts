import { useQuery } from "@tanstack/react-query"
import { env } from "@env/client.mjs"
import { UseQueryOptions } from "@tanstack/react-query/src/types"
import { z } from "zod"

const roomSchema = z.string().uuid()

function useQueryBocchiFrame(
  room: string,
  options?: Omit<
    UseQueryOptions<string, any, string, string[]>,
    "queryKey" | "queryFn" | "initialData"
  > & { initialData?: () => undefined }
) {
  return useQuery(
    ["frame"],
    async () => {
      roomSchema.parse(room)
      const response = await fetch(
        `${env.NEXT_PUBLIC_QUIZ_API_URL}/quiz/${room}`
      )
      return await response.text()
    },
    options
  )
}

export default useQueryBocchiFrame
