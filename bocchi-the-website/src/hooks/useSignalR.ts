import { HubConnectionBuilder } from "@microsoft/signalr"
import { useEffect } from "react"
import { env } from "@boccher/env/client.mjs"
import { useQueryClient } from "@tanstack/react-query"
import { quizPlayersQueryKey } from "@boccher/hooks/useQueryQuizPlayers"

const connection = new HubConnectionBuilder()
  .withUrl(`${env.NEXT_PUBLIC_QUIZ_API_URL}/quizHub`)
  .withAutomaticReconnect()
  .build()

async function joinRoom(room: string) {
  await connection.start()
  await connection.invoke("JoinRoom", room)
}

async function leaveRoom(room: string) {
  await connection.invoke("LeaveRoom", room)
  await connection.stop()
}

function useSignalR(room: string, isRoomValid: boolean) {
  const queryClient = useQueryClient()

  useEffect(() => {
    if (!isRoomValid) return

    joinRoom(room).catch((err) => console.log("Error joining room", err))

    connection.on("InvalidateUsers", async () => {
      await queryClient.invalidateQueries(quizPlayersQueryKey)
    })

    return () => {
      leaveRoom(room).catch((err) => console.log("Error leaving room", err))
    }
  }, [room])
}

export default useSignalR
