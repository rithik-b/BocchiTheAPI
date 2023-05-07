import cn from "@boccher/utils/cn"
import { Toggle } from "@boccher/components/primitives/Toggle"

export enum Episode {
  EP1 = 1,
  EP2 = 2,
  EP3 = 3,
  EP4 = 4,
  EP5 = 5,
  EP6 = 6,
  EP7 = 7,
  EP8 = 8,
  EP9 = 9,
  EP10 = 10,
  EP11 = 11,
  EP12 = 12,
  OP = "OP",
  ED = "ED1",
  ED2 = "ED2",
  ED3 = "ED3",
}

const episodes = [
  Episode.EP1,
  Episode.EP2,
  Episode.EP3,
  Episode.EP4,
  Episode.EP5,
  Episode.EP6,
  Episode.EP7,
  Episode.EP8,
  Episode.EP9,
  Episode.EP10,
  Episode.EP11,
  Episode.EP12,
  Episode.OP,
  Episode.ED,
  Episode.ED2,
  Episode.ED3,
]

interface Props {
  className?: string
  episode: Episode
  setEpisode: (episode: Episode) => void
}

const EpisodeSelector = (props: Props) => {
  const { className, setEpisode } = props

  return (
    <div className={cn(className, "flex flex-wrap gap-2")}>
      {episodes.map((episode) => (
        <Toggle
          key={episode}
          value={episode}
          pressed={episode === props.episode}
          onPressedChange={() => setEpisode(episode)}
        >
          {episode}
        </Toggle>
      ))}
    </div>
  )
}

export default EpisodeSelector
