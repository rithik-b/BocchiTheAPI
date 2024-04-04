import { useAtomValue } from "jotai/react"
import GameStateAtoms from "../GameStateAtoms"
import { Check, X } from "lucide-react"
import { cva } from "class-variance-authority"

const attemptVariants = cva(
  "flex w-14 items-center justify-center rounded-full p-1 text-white text-sm animate-in slide-in-from-right-full",
  {
    variants: {
      isCorrect: {
        true: "bg-green-600",
        false: "bg-red-600",
      },
    },
  },
)

const AttemptsHistory = () => {
  const attemptsHistory = useAtomValue(GameStateAtoms.attemptsHistory)

  return (
    <div className="flex min-h-8 flex-wrap justify-center gap-2">
      {attemptsHistory.map((attempt, index) => (
        <div
          className={attemptVariants({
            isCorrect: attempt.isCorrect,
          })}
          key={index}
        >
          {attempt.isCorrect ? (
            <Check className="size-4" />
          ) : (
            <X className="size-4" />
          )}
          {attempt.attempt}
        </div>
      ))}
    </div>
  )
}

export default AttemptsHistory
