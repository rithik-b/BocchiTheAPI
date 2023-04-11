import { useRouter } from "next/router"
import React, { useState } from "react"
import Head from "next/head"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import Image from "next/image"
import useQueryQuizFrame from "@hooks/useQueryQuizFrame"
import EpisodeSelector, { Episode } from "@components/EpisodeSelector"

const Room = () => {
  const router = useRouter()
  const { room } = router.query
  const [episode, setEpisode] = useState(Episode.EP1)

  const [isLoading, setIsLoading] = React.useState(true)
  const frameQuery = useQueryQuizFrame(room as string, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!room,
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
                  src={frameQuery.data!}
                  alt={"An image from Bocchi The Rock"}
                  fill
                  unoptimized
                  className="rounded-md object-cover"
                  onLoad={() => setIsLoading(false)}
                />
              </AspectRatio>
            </div>
          )}
          <EpisodeSelector
            className="m-5"
            episode={episode}
            setEpisode={setEpisode}
          />
        </div>
      </section>
    </main>
  )
}

export default Room
