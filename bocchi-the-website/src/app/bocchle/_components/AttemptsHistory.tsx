import { useAtomValue } from "jotai/react"
import Attempt from "./Attempt"
import GameStateAtoms from "../GameStateAtoms"
import { unwrap } from "jotai/utils"

interface Props {
  placeholder?: boolean
}

const AttemptsHistory = (props: Props) => {
  const { placeholder = false } = props
  const attemptsHistoryWithPlaceholders = useAtomValue(
    unwrap(GameStateAtoms.attemptsHistoryWithPlaceHolders),
  )

  return (
    <div className="flex min-h-8 flex-wrap justify-center gap-2">
      {placeholder
        ? Array.from({ length: 6 }).map((_attempt, index) => (
            <Attempt status="placeholder" key={index} />
          ))
        : attemptsHistoryWithPlaceholders?.map((attempt, index) => (
            <Attempt status={attempt.status} key={index}>
              {attempt.attempt}
            </Attempt>
          ))}
    </div>
  )
}

export default AttemptsHistory
