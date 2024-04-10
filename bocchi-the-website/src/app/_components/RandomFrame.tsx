"use client"

import { Loader2 } from "lucide-react"
import { Button } from "@rithik/bocchi-the-website/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import EpisodeDuration from "./EpisodeDuration"
import ImageFrame from "./ImageFrame"
import { api } from "@rithik/bocchi-the-website/trpc/react"
import { type inferRouterOutputs } from "@trpc/server"
import { formattedEpisodes } from "@rithik/bocchi-the-website/data/episode"
import { formatDuration } from "@rithik/bocchi-the-website/lib/utils"
import { atom, useAtom } from "jotai"
import { type AppRouter } from "@rithik/bocchi-the-website/server/api/root"

interface Props {
  firstFrame: inferRouterOutputs<AppRouter>["randomFrame"]
}

const randomFrameQueryAtom = api.randomFrame.atomWithQuery(undefined)
const hasRefetchedAtom = atom(false)

const RandomFrame = (props: Props) => {
  const { firstFrame } = props
  const [isLoading, setIsLoading] = useState(false)
  const randomFrameAtom = useMemo(
    () =>
      atom(
        (get) =>
          get(hasRefetchedAtom) ? get(randomFrameQueryAtom) : firstFrame,
        (get, set) => {
          if (get(hasRefetchedAtom)) set(randomFrameQueryAtom)
          else set(hasRefetchedAtom, true)
        },
      ),
    [firstFrame],
  )
  const [currentFrame, refetch] = useAtom(randomFrameAtom)
  const [previousFrame, setPreviousFrame] = useState(currentFrame)
  const metadata = useMemo(
    () => (isLoading ? previousFrame : currentFrame),
    [currentFrame, isLoading, previousFrame],
  )

  const onClick = () => {
    setPreviousFrame(currentFrame)
    setIsLoading(true)
    refetch()
  }

  return (
    <main className="flex flex-col items-center gap-5">
      <div className="flex w-full flex-col items-center gap-2 lg:max-w-[1024px]">
        <ImageFrame
          src={currentFrame.url}
          onLoad={() => setIsLoading(false)}
          alt={`Bocchi the Rock! ${formattedEpisodes.get(metadata.source)} ${formatDuration(metadata.timestamp)}`}
        />
        <EpisodeDuration
          episode={metadata.source}
          timestamp={metadata.timestamp}
          episodeDuration={metadata.episodeDuration}
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
