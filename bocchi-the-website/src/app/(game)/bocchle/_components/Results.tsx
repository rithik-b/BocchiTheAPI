import { useAtomValue } from "jotai"
import BocchleStateAtoms from "../BocchleStateAtoms"
import { formattedEpisodes } from "@rithik/bocchi-the-website/data/episode"
import { memo } from "react"
import { unwrap } from "jotai/utils"
import BocchleShare from "./Share"

const Results = () => {
  const answer = useAtomValue(unwrap(BocchleStateAtoms.answer))!
  const hasWon = useAtomValue(BocchleStateAtoms.hasWon)

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
      <BocchleShare />
    </div>
  )
}

export default memo(Results)
