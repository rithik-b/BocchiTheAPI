import { Progress } from "@rithik/bocchi-the-website/components/ui/progress"
import {
  type Episode,
  formattedEpisodes,
} from "@rithik/bocchi-the-website/data/episode"
import { formatDuration } from "@rithik/bocchi-the-website/lib/utils"
import { memo } from "react"

interface Props {
  episode: Episode
  timestamp: number
  episodeDuration: number
}

const EpisodeDuration = (props: Props) => {
  const { episode, timestamp, episodeDuration } = props

  return (
    <div className="flex w-full flex-col gap-1 px-2 md:px-8">
      <div className="flex justify-between text-sm">
        <span>{formattedEpisodes.get(episode)}</span>
        <span>
          {formatDuration(timestamp)}/{formatDuration(episodeDuration)}
        </span>
      </div>
      <Progress value={(timestamp / episodeDuration) * 100} className="h-2" />
    </div>
  )
}

export default memo(EpisodeDuration)
