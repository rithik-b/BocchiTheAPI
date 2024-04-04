import { atomWithStorage } from "jotai/utils"
import { atom } from "jotai/vanilla"

const todaysDate = atom(new Date())

const unsuccessfulAttempts = atomWithStorage(
  "unsuccessfulAttempts",
  0,
  undefined,
  {
    getOnInit: true,
  },
)

interface Attempt {
  attempt: string
  isCorrect: boolean
}

const attemptsHistory = atomWithStorage<Attempt[]>(
  "attemptsHistory",
  [],
  undefined,
  {
    getOnInit: true,
  },
)

const hasWon = atom((get) => {
  const attempts = get(attemptsHistory)
  return attempts[attempts.length - 1]?.isCorrect ?? false
})

const hasLost = atom((get) => get(unsuccessfulAttempts) === 6)

const gameEnded = atom((get) => get(hasWon) || get(hasLost))

const lastAttemptDate = atomWithStorage("lastAttemptDate", "", undefined, {
  getOnInit: true,
})

const GameStateAtoms = {
  todaysDate,
  attemptsHistory,
  unsuccessfulAttempts,
  hasWon,
  hasLost,
  gameEnded,
  lastAttemptDate,
}

export default GameStateAtoms
