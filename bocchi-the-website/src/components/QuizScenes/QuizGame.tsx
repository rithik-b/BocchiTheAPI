import React, { useState } from "react"
import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import Image from "next/image"
import EpisodeSelector, { Episode } from "@boccher/components/EpisodeSelector"
import useQueryQuizFrame from "@boccher/hooks/useQueryQuizFrame"
import PlayerInfoCell from "@boccher/components/PlayerInfoCell"
import useQueryQuizPlayers from "@boccher/hooks/useQueryQuizPlayers"
import PlayerPointsTable from "@boccher/components/PlayerPointsTable"

interface Props {
  room: string
}

const QuizGame = (props: Props) => {
  const { room } = props
  const [episode, setEpisode] = useState<Episode | null>(null)

  const [isLoading, setIsLoading] = React.useState(true)
  const frameQuery = useQueryQuizFrame(room, {
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: !!room,
  })

  const { isFetched: isFetchedPlayers, data: players } = useQueryQuizPlayers(
    room,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    }
  )

  return (
    <div className="mt-2 grid grid-cols-6">
      <div className="col-start-1">
        <PlayerPointsTable players={players} oddPlayers={true} />
      </div>
      <div className="col-span-4 col-start-2 grid place-items-center space-y-2">
        <h3 className="col-start-1 self-center text-left text-4xl font-extrabold tracking-tight">
          Time
        </h3>
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
      <div className="col-start-6">
        <PlayerPointsTable players={players} oddPlayers={false} />
      </div>
    </div>
  )
}

export default QuizGame
