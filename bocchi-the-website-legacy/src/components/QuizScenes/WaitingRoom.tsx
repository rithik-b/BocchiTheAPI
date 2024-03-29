import React, { useEffect, useMemo } from "react"
import useSignalR from "@boccher/hooks/useSignalR"
import useQueryQuizPlayers from "@boccher/hooks/useQueryQuizPlayers"
import useQueryUserIdentity from "@boccher/hooks/useQueryUserIdentity"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@boccher/components/primitives/Card"
import PlayerInfoCell from "@boccher/components/PlayerInfoCell"
import { Button, buttonVariants } from "@boccher/components/primitives/Button"
import Link from "next/link"
import { env } from "@boccher/env/client.mjs"
import { Icons } from "@boccher/components/primitives/Icons"

interface Props {
  room: string
}

const WaitingRoom = (props: Props) => {
  const { room } = props
  const { isFetched: isFetchedPlayers, data: players } = useQueryQuizPlayers(
    room,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  )
  const { isFetched: isFetchedUserIdentity, data: userIdentity } =
    useQueryUserIdentity({
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    })

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
              <div className="flex flex-col gap-2">
                {players?.map((player, key) => (
                  <PlayerInfoCell player={player} key={key} />
                ))}
              </div>
            </CardContent>
          )}
          <CardFooter className="grid place-content-center">
            {userIdentity ? (
              <Button>{(players?.length ?? 0) > 1 ? "Ready" : "Start"}</Button>
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

export default WaitingRoom
