import { UseQueryOptions } from "@tanstack/react-query/src/types"
import UserIdentity from "@boccher/models/UserIdentity"
import { env } from "@boccher/env/client.mjs"
import { useQuery } from "@tanstack/react-query"

export const quizPlayersQueryKey = ["players"]

function useQueryQuizPlayers(
  room: string,
  options?: Omit<
    UseQueryOptions<UserIdentity[], never, UserIdentity[], string[]>,
    "queryKey" | "queryFn" | "initialData"
  > & { initialData?: () => undefined }
) {
  return useQuery(
    quizPlayersQueryKey,
    async () => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_QUIZ_API_URL}/quiz/${room}/users`
      )
      return (await response.json()) as UserIdentity[]
    },
    options
  )
}

export default useQueryQuizPlayers
