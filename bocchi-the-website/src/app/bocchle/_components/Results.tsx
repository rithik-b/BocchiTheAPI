import { api } from "@rithik/bocchi-the-website/trpc/react"
import { useAtomValue } from "jotai"
import GameStateAtoms from "../GameStateAtoms"

const Results = () => {
  const todaysDate = useAtomValue(GameStateAtoms.todaysDate)
  const hasWon = useAtomValue(GameStateAtoms.hasWon)
  const { data: answer } = api.bocchle.getAnswer.useQuery({
    todaysDate,
  })

  if (!answer) return null

  return (
    <>
      <span className="text-center text-3xl">
        {hasWon ? "You won!" : `The answer was ${answer} 😞`}
      </span>
      <span className="text-center text-2xl font-medium">
        See you next play! 🐧
      </span>
    </>
  )
}

export default Results
