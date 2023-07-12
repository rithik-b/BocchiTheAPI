import { Button, buttonVariants } from "@boccher/components/primitives/Button"
import Link from "next/link"
import { env } from "@boccher/env/client.mjs"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@boccher/components/primitives/Card"
import { Icons } from "@boccher/components/primitives/Icons"
import useQueryUserIdentity from "@boccher/hooks/useQueryUserIdentity"
import { useRouter } from "next/router"
import React, { useCallback, useState } from "react"
import noop from "@boccher/utils/noop"
import { v4 as uuidv4 } from "uuid"

const Quiz = () => {
  const router = useRouter()
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const { isFetched, data: userIdentity } = useQueryUserIdentity({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const createRoom = useCallback(() => {
    setIsCreatingRoom(true)
    router.push(`/quiz/${uuidv4()}`).then().catch(noop)
  }, [router])

  return (
    <div className="grid place-content-center pt-3">
      {isFetched && !userIdentity && (
        <Card>
          <CardHeader>
            <CardTitle>Login to continue</CardTitle>
          </CardHeader>
          <CardFooter>
            <Link
              className={buttonVariants({ variant: "default" })}
              href={`${env.NEXT_PUBLIC_QUIZ_API_URL}/auth/signin`}
            >
              <Icons.discord className="mr-2 h-4 w-4" />
              Login with Discord
            </Link>
          </CardFooter>
        </Card>
      )}
      {isFetched && userIdentity && (
        <Card>
          <CardHeader>
            <CardTitle>Quiz</CardTitle>
            <CardDescription>Create a room to continue</CardDescription>
          </CardHeader>
          <CardFooter className="grid place-content-center">
            <Button onClick={createRoom} disabled={isCreatingRoom}>
              Create Room
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

export default Quiz
