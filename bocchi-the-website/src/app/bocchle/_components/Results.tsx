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
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    <span>{hasWon ? "You won!" : `The answer was Episode ${answer} :(`}</span>
  )
}

export default Results
