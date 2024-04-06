import { atomWithStorage } from "jotai/utils"
import { atom } from "jotai/vanilla"

const todaysDate = atom(new Date())

interface Attempt {
  attempt: string
  isCorrect: boolean
}

const attemptsHistoryAtom = atomWithStorage<Attempt[]>(
  "attemptsHistory",
  [],
  undefined,
  {
    getOnInit: true,
  },
)

interface AttemptWithPlaceholder {
  attempt: string
  status: "correct" | "incorrect" | "placeholder"
}

const attemptsHistoryWithPlaceHolders = atom((get) => {
  const attemptsHistory = get(attemptsHistoryAtom)
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

const unsuccessfulAttempts = atom((get) => {
  const attempts = get(attemptsHistoryAtom)
  return attempts.filter((a) => !a.isCorrect).length
})

const hasWon = atom((get) => {
  const attempts = get(attemptsHistoryAtom)
  return attempts[attempts.length - 1]?.isCorrect ?? false
})

const hasLost = atom((get) => get(unsuccessfulAttempts) === 6)

const gameEnded = atom((get) => get(hasWon) || get(hasLost))

const lastAttemptDate = atomWithStorage("lastAttemptDate", "", undefined, {
  getOnInit: true,
})

const GameStateAtoms = {
  todaysDate,
  attemptsHistory: attemptsHistoryAtom,
  attemptsHistoryWithPlaceHolders,
  unsuccessfulAttempts,
  hasWon,
  hasLost,
  gameEnded,
  lastAttemptDate,
}

export default GameStateAtoms
