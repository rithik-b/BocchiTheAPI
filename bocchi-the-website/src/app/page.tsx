"use client"

import { type NextPage } from "next"
import { Loader2 } from "lucide-react"
import { api } from "../trpc/react"
import { Button } from "../components/ui/button"
import { useMemo, useState } from "react"
import ImageFrame from "../components/ImageFrame"
import { Progress } from "../components/ui/progress"
import { formattedEpisodes } from "../data/episode"
import { formatDuration } from "../lib/utils"

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const frameQuery = api.frames.randomFrame.useQuery()
  const progress = useMemo(
    () =>
      !!frameQuery.data
        ? (frameQuery.data.timestamp / frameQuery.data.episodeDuration) * 100
        : 0,
    [frameQuery.data],
  )

  const onClick = () => {
    setIsLoading(true)
    void frameQuery.refetch()
  }

  return (
    <main>
      <div className="flex flex-col items-center gap-4">
        <div className="flex w-full flex-col items-center gap-2 lg:w-8/12">
          <ImageFrame
            src={frameQuery.data?.url}
            onLoad={() => setIsLoading(false)}
          />
          {!!frameQuery.data && (
            <div className="w-full px-2 md:px-8">
              <div className="flex justify-between text-sm">
                <span>{formattedEpisodes.get(frameQuery.data?.source)}</span>
                <span>
                  {formatDuration(frameQuery.data.timestamp)}/
                  {formatDuration(frameQuery.data.episodeDuration)}
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </div>
        <Button onClick={onClick} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Getting Boccher" : "Get Boccher"}
        </Button>
      </div>
    </main>
  )
}

export default Home
