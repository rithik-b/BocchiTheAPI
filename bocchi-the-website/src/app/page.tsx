"use client"

import { type NextPage } from "next"
import { Loader2 } from "lucide-react"
import { api } from "../trpc/react"
import { Button } from "../components/ui/button"
import { useState } from "react"
import ImageFrame from "./_components/ImageFrame"
import EpisodeDuration from "./_components/EpisodeDuration"

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const { data: currentFrame, refetch } = api.frames.randomFrame.useQuery()

  const onClick = () => {
    setIsLoading(true)
    void refetch()
  }

  return (
    <main>
      <div className="flex flex-col items-center gap-5">
        <div className="flex w-full flex-col items-center gap-2 lg:max-w-[1024px]">
          <ImageFrame
            src={currentFrame?.url}
            onLoad={() => setIsLoading(false)}
          />
          {!!currentFrame && (
            <EpisodeDuration
              episode={currentFrame.source}
              timestamp={currentFrame.timestamp}
              episodeDuration={currentFrame.episodeDuration}
            />
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
