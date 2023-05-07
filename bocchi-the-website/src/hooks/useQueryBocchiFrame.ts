import { useQuery } from "@tanstack/react-query"
import { env } from "@boccher/env/client.mjs"
import { UseQueryOptions } from "@tanstack/react-query/src/types"

interface BocchiFrame {
  url: string
  episode: string
  timestamp: number
}

function useQueryBocchiFrame(
  options?: Omit<
    UseQueryOptions<BocchiFrame, any, BocchiFrame, string[]>,
    "queryKey" | "queryFn" | "initialData"
  > & { initialData?: () => undefined }
) {
  return useQuery(
    ["frame"],
    async () => {
      const response = await fetch(`${env.NEXT_PUBLIC_API_URL}/api/frames`)
      return (await response.json()) as BocchiFrame
    },
    options
  )
}

export default useQueryBocchiFrame
