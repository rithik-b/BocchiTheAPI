import { useAtomValue } from "jotai/react"
import Attempt from "./Attempt"
import GameStateAtoms from "../GameStateAtoms"

interface Props {
  placeholder?: boolean
}

const AttemptsHistory = (props: Props) => {
  const { placeholder = false } = props
  const attemptsHistoryWithPlaceholders = useAtomValue(
    GameStateAtoms.attemptsHistoryWithPlaceHolders,
  )

  return (
    <div className="flex min-h-8 flex-wrap justify-center gap-2">
      {placeholder
        ? attemptsHistoryWithPlaceholders.map((_attempt, index) => (
            <Attempt status="placeholder" key={index} />
          ))
        : attemptsHistoryWithPlaceholders.map((attempt, index) => (
            <Attempt status={attempt.status} key={index}>
              {attempt.attempt}
            </Attempt>
          ))}
    </div>
  )
}

export default AttemptsHistory
