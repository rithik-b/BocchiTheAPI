import { useAtomValue } from "jotai/react"
import GameStateAtoms from "../GameStateAtoms"
import { atom } from "jotai"
import Attempt from "./Attempt"

interface AttemptWithPlaceholder {
  attempt: string
  status: "correct" | "incorrect" | "placeholder"
}

const attemptsHistoryWithPlaceHolders = atom((get) => {
  const attemptsHistory = get(GameStateAtoms.attemptsHistory)
  const placeholderCount = 6 - attemptsHistory.length
  const placeholders = Array.from({ length: placeholderCount }).map(() => ({
    attempt: "",
    status: "placeholder",
  }))
  return [
    ...attemptsHistory.map((a) => ({
      attempt: a.attempt,
      status: a.isCorrect ? "correct" : "incorrect",
    })),
    ...placeholders,
  ] as AttemptWithPlaceholder[]
})

const AttemptsHistory = () => {
  const attemptsHistory = useAtomValue(attemptsHistoryWithPlaceHolders)

  return (
    <div className="flex min-h-8 flex-wrap justify-center gap-2">
      {attemptsHistory.map((attempt, index) => (
        <Attempt status={attempt.status} key={index}>
          {attempt.attempt}
        </Attempt>
      ))}
    </div>
  )
}

export default AttemptsHistory
