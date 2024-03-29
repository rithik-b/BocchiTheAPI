import React, { useEffect, useMemo } from "react"
import { z } from "zod"
import { useRouter } from "next/router"
import useSignalR from "@boccher/hooks/useSignalR"
import useQueryQuizPlayers from "@boccher/hooks/useQueryQuizPlayers"
import useQueryUserIdentity from "@boccher/hooks/useQueryUserIdentity"
import noop from "@boccher/utils/noop"
import WaitingRoom from "@boccher/components/QuizScenes/WaitingRoom"
import { useAtomValue } from "jotai"
import QuizAtoms from "@boccher/models/QuizAtoms"
import QuizGame from "@boccher/components/QuizScenes/QuizGame"

const roomSchema = z.string().uuid()

const Room = () => {
  const router = useRouter()
  const { room } = router.query
  const isStarted = useAtomValue(QuizAtoms.isStarted)
  const isRoomValid = useMemo(() => roomSchema.safeParse(room).success, [room])
  useSignalR(room as string, isRoomValid)
  const { isFetched: isFetchedPlayers, data: players } = useQueryQuizPlayers(
    room as string,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      enabled: isRoomValid,
    }
  )
  const { isFetched: isFetchedUserIdentity, data: userIdentity } =
    useQueryUserIdentity({
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    })

  useEffect(() => {
    if (
      isFetchedPlayers &&
      isFetchedUserIdentity &&
      !userIdentity &&
      players!.length === 0
    ) {
      router.push("/quiz").then().catch(noop)
    }
  }, [isFetchedPlayers, isFetchedUserIdentity, userIdentity, players, router])

  useEffect(() => {
    if (!isRoomValid && !!room) {
      router.push("/quiz").then().catch(noop)
    }
  }, [isRoomValid, room, router])

  if (!isRoomValid) return null

  if (!isStarted) return <WaitingRoom room={room as string} />

  return <QuizGame room={room as string} />
}

export default Room
