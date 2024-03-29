import { UseQueryOptions } from "@tanstack/react-query/src/types"
import { useQuery } from "@tanstack/react-query"
import UserIdentity from "@boccher/models/UserIdentity"
import { env } from "@boccher/env/client.mjs"

function useQueryUserIdentity(
  options?: Omit<
    UseQueryOptions<UserIdentity | null, never, UserIdentity | null, string[]>,
    "queryKey" | "queryFn"
  >
) {
  return useQuery(
    ["user"],
    async () => {
      const response = await fetch(`${env.NEXT_PUBLIC_QUIZ_API_URL}/auth/me`, {
        credentials: "include",
      })

      if (response.status === 401) return null
      else if (!response.ok)
        throw new Error(response.statusText ?? "Unknown error")

      return (await response.json()) as UserIdentity
    },
    options
  )
}

export default useQueryUserIdentity
