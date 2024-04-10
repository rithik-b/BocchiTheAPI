import { useAtomValue } from "jotai"
import GameStateAtoms from "../GameStateAtoms"
import { formattedEpisodes } from "@rithik/bocchi-the-website/data/episode"
import { memo } from "react"
import { unwrap } from "jotai/utils"

const unwrappedAnswerAtom = unwrap(GameStateAtoms.answer)

const Results = () => {
  const answer = useAtomValue(unwrappedAnswerAtom)
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
    </div>
  )
}

export default memo(Results)
