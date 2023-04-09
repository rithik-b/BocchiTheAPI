import { type NextPage } from "next"
import Head from "next/head"
import React from "react"
import { api } from "@utils/api"
import Image from "next/image"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { Button } from "@components/Button"
import { Loader2 } from "lucide-react"
import timestampToTimecode from "@utils/timestampToTimecode"

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const frameQuery = api.frame.useQuery(undefined, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const onClick = () => {
    setIsLoading(true)
    void frameQuery.refetch()
  }

  return (
    <main>
      <Head>
        <title>Boccher</title>
        <meta name="description" content="Get a random Boccher frame" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <section>
        <div className="grid place-items-center space-y-2">
          {frameQuery.isFetched && !frameQuery.isError && (
            <div className="lg:h-8/12 grid w-screen content-center bg-pink-300 dark:bg-slate-700 md:p-8 lg:w-8/12">
              <AspectRatio ratio={16 / 9}>
                <Image
                  src={frameQuery.data!.url}
                  alt={`Episode ${
                    frameQuery.data!.episode
                  } - ${timestampToTimecode(frameQuery.data!.timestamp)}`}
                  title={`Episode ${
                    frameQuery.data!.episode
                  } - ${timestampToTimecode(frameQuery.data!.timestamp)}`}
                  fill
                  unoptimized
                  className="rounded-md object-cover"
                  onLoad={() => setIsLoading(false)}
                />
              </AspectRatio>
            </div>
          )}
          <Button onClick={onClick} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Getting Boccher" : "Get Boccher"}
          </Button>
        </div>
      </section>
    </main>
  )
}

export default Home
