"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@rithik/bocchi-the-website/components/ui/button"
import { useState } from "react"
import EpisodeDuration from "./EpisodeDuration"
import ImageFrame from "./ImageFrame"
import { api } from "@rithik/bocchi-the-website/trpc/react"
import { type inferRouterOutputs } from "@trpc/server"
import { type framesRouter } from "@rithik/bocchi-the-website/server/api/routers/frames"

interface Props {
  firstFrame: inferRouterOutputs<typeof framesRouter>["randomFrame"]
}

const RandomFrame = (props: Props) => {
  const { firstFrame } = props
  const [isLoading, setIsLoading] = useState(false)
  const { data: currentFrame, refetch } = api.frames.randomFrame.useQuery(
    undefined,
    {
      initialData: firstFrame,
    },
  )

  const onClick = () => {
    setIsLoading(true)
    void refetch()
  }

  return (
    <main className="flex flex-col items-center gap-5">
      <div className="flex w-full flex-col items-center gap-2 lg:max-w-[1024px]">
        <ImageFrame
          src={currentFrame.url}
          onLoad={() => setIsLoading(false)}
          priority
        />
        <EpisodeDuration
          episode={currentFrame.source}
          timestamp={currentFrame.timestamp}
          episodeDuration={currentFrame.episodeDuration}
        />
      </div>
      <Button onClick={onClick} disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isLoading ? "Getting Boccher" : "Get Boccher"}
      </Button>
    </main>
  )
}

export default RandomFrame
