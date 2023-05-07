import { buttonVariants } from "@boccher/components/primitives/Button"
import Link from "next/link"
import { env } from "@boccher/env/client.mjs"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@boccher/components/primitives/Card"
import { Icons } from "@boccher/components/primitives/Icons"
import useQueryUserIdentity from "@boccher/hooks/useQueryUserIdentity"
import PlayerInfoCell from "@boccher/components/PlayerInfoCell"

const Quiz = () => {
  const { isFetched, data: userIdentity } = useQueryUserIdentity({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

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
            <CardDescription>
              Invite more people by simply copying the link of this page!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PlayerInfoCell player={userIdentity} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default Quiz
