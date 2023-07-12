import { HubConnectionBuilder } from "@microsoft/signalr"
import { useEffect } from "react"
import { env } from "@boccher/env/client.mjs"
import { useQueryClient } from "@tanstack/react-query"
import { quizPlayersQueryKey } from "@boccher/hooks/useQueryQuizPlayers"
import useQueryUserIdentity from "@boccher/hooks/useQueryUserIdentity"
import { QueryClient } from "@tanstack/query-core"

const connection = new HubConnectionBuilder()
  .withUrl(`${env.NEXT_PUBLIC_QUIZ_API_URL}/quizHub`)
  .withAutomaticReconnect()
  .build()

async function joinRoom(room: string, queryClient: QueryClient) {
  await connection.start()
  await connection.invoke("JoinRoom", room)
  await queryClient.invalidateQueries(quizPlayersQueryKey)
}

async function leaveRoom(room: string) {
  await connection.invoke("LeaveRoom", room)
  await connection.stop()
}

function useSignalR(room: string, isRoomValid: boolean) {
  const queryClient = useQueryClient()
  const { data: userIdentity } = useQueryUserIdentity({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  useEffect(() => {
    if (!isRoomValid || !userIdentity) return

    joinRoom(room, queryClient).catch((err) =>
      console.log("Error joining room", err)
    )

    connection.on("InvalidateUsers", async () => {
      await queryClient.invalidateQueries(quizPlayersQueryKey)
    })

    return () => {
      leaveRoom(room).catch((err) => console.log("Error leaving room", err))
    }
  }, [isRoomValid, queryClient, room, userIdentity])
}

export default useSignalR
