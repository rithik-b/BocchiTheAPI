import { useAtomValue } from "jotai"
import GameStateAtoms from "../GameStateAtoms"
import Share from "./Share"
import {
  formattedEpisodes,
  type Episode,
} from "@rithik/bocchi-the-website/data/episode"
import { memo } from "react"

interface Props {
  answer: Episode
}

const Results = (props: Props) => {
  const { answer } = props
  const hasWon = useAtomValue(GameStateAtoms.hasWon)

  return (
    <div className="flex flex-col gap-5">
      <span className="text-center text-3xl">
        {hasWon
          ? "You won!"
          : `The answer was ${formattedEpisodes.get(answer)} 😞`}
      </span>
      <span className="text-center text-2xl font-medium">
        See you next play! 🐧
      </span>
      <Share />
    </div>
  )
}

export default memo(Results)
