import React, { useEffect, useMemo, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@boccher/components/primitives/Card"
import Link from "next/link"
import { Button, buttonVariants } from "@boccher/components/primitives/Button"
import { env } from "@boccher/env/client.mjs"
import { Icons } from "@boccher/components/primitives/Icons"
import PlayerInfoCell from "@boccher/components/PlayerInfoCell"
import { z } from "zod"
import { useRouter } from "next/router"
import useSignalR from "@boccher/hooks/useSignalR"
import useQueryQuizPlayers from "@boccher/hooks/useQueryQuizPlayers"
import useQueryUserIdentity from "@boccher/hooks/useQueryUserIdentity"
import noop from "@boccher/utils/noop"

const roomSchema = z.string().uuid()

const Room = () => {
  const router = useRouter()
  const { room } = router.query
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

  return (
    <div className="grid place-content-center pt-3">
      {isFetchedPlayers && isFetchedUserIdentity && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz</CardTitle>
            <CardDescription>
              {userIdentity
                ? "Invite more people by simply copying the link of this page!"
                : "Login with Discord to join the quiz!"}
            </CardDescription>
          </CardHeader>
          {(players?.length ?? 0) > 0 && (
            <CardContent>
              {players?.map((player, key) => (
                <PlayerInfoCell player={player} key={key} />
              ))}
            </CardContent>
          )}
          <CardFooter className="grid place-content-center">
            {userIdentity ? (
              <Button>Start</Button>
            ) : (
              <Link
                className={buttonVariants({ variant: "default" })}
                href={`${env.NEXT_PUBLIC_QUIZ_API_URL}/auth/signin`}
              >
                <Icons.discord className="mr-2 h-4 w-4" />
                Login with Discord
              </Link>
            )}
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default Room
