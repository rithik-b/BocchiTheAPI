import {
  type Episode,
  edToEpisodes,
} from "@rithik/bocchi-the-website/data/episode"
import { api } from "@rithik/bocchi-the-website/trpc/react"
import { atomWithStorage, unwrap } from "jotai/utils"
import { type Getter, atom } from "jotai/vanilla"
import { atomEffect } from "jotai-effect"
import {
  getDateString,
  validateAnswer,
} from "@rithik/bocchi-the-website/lib/utils"
import { queryAtomWithRetry } from "@rithik/bocchi-the-website/lib/atomUtils"

const todaysDateAtom = atom(new Date())

const attemptsHistoryAtom = atomWithStorage<string[]>(
  "attemptsHistory",
  [],
  undefined,
  {
    getOnInit: true,
  },
)

const initializeGameStateEffect = (() => {
  const ranInitialization = atom(false)
  return atomEffect((get, set) => {
    if (get(ranInitialization)) return

    // Reset atoms on new day
    const todaysDate = get(GameStateAtoms.todaysDate)
    const todaysDateString = getDateString(
      todaysDate,
      todaysDate.getTimezoneOffset(),
    )
    const lastAttemptDate = get(GameStateAtoms.lastAttemptDate)
    if (todaysDateString !== lastAttemptDate) {
      set(GameStateAtoms.attemptsHistory, [])
      set(GameStateAtoms.lastAttemptDate, todaysDateString)
    }

    // Migrate from old format
    const attemptsHistory = get(attemptsHistoryAtom)
    if (attemptsHistory.length > 0 && typeof attemptsHistory[0] !== "string") {
      set(attemptsHistoryAtom, [])
    }

    set(ranInitialization, true)
  })
})()

const bocchleQueryAtom = queryAtomWithRetry(
  api.bocchle.atomWithQuery((get: Getter) => ({
    todaysDate: get(todaysDateAtom),
    timezoneOffset: get(todaysDateAtom).getTimezoneOffset(),
  })),
)

const validateBocchleAnswer = async (get: Getter, givenAnswer: string) => {
  const query = await get(bocchleQueryAtom)

  if (!query) return false

  const { episode: actualAnswer } = query

  return validateAnswer(givenAnswer, actualAnswer as string)
}
const validateAnswerAtom = atom(null, (get, _set, givenAnswer: string) =>
  validateBocchleAnswer(get, givenAnswer),
)

interface AttemptWithState {
  attempt: string
  status: "correct" | "incorrect" | "placeholder"
}

const attemptsHistoryWithStateAtom = atom(async (get) => {
  get(initializeGameStateEffect)
  const attemptsHistory = get(attemptsHistoryAtom)
  const promises = attemptsHistory.map(async (a) => ({
    attempt: a,
    status: (await validateBocchleAnswer(get, a)) ? "correct" : "incorrect",
  }))
  return (await Promise.all(promises)) as AttemptWithState[]
})

const attemptsHistoryWithPlaceHoldersAtom = atom((get) => {
  const attemptsHistory = get(unwrap(attemptsHistoryWithStateAtom)) ?? []
  const placeholderCount = 6 - attemptsHistory.length
  const placeholders = Array.from({ length: placeholderCount }).map(() => ({
    attempt: "",
    status: "placeholder",
  }))
  return [...attemptsHistory, ...placeholders] as AttemptWithState[]
})

const unsuccessfulAttemptsCountAtom = atom(async (get) => {
  const attempts = await get(attemptsHistoryWithStateAtom)
  return attempts.filter((a) => a.status === "incorrect").length
})

const hasWonAtom = atom((get) => {
  const attempts = get(unwrap(attemptsHistoryWithStateAtom))
  return attempts?.[attempts.length - 1]?.status === "correct" ?? false
})

const hasLostAtom = atom(
  (get) => get(unwrap(unsuccessfulAttemptsCountAtom)) === 6,
)

const gameEndedAtom = atom((get) => get(hasWonAtom) || get(hasLostAtom))

const lastAttemptDateAtom = atomWithStorage("lastAttemptDate", "", undefined, {
  getOnInit: true,
})

const currentFrameAtom = atom((get) => {
  const query = get(unwrap(bocchleQueryAtom))
  const unsuccessfulAttempts = get(unwrap(unsuccessfulAttemptsCountAtom))!

  if (!query) return null

  const { frames } = query
  return frames[unsuccessfulAttempts > 5 ? 5 : unsuccessfulAttempts]!
})

const loadNextFrameAtom = atom(null, (get, _set) => {
  const unsuccessfulAttempts = get(unwrap(unsuccessfulAttemptsCountAtom))!
  if (unsuccessfulAttempts === 5) return
  const { frames } = get(unwrap(bocchleQueryAtom))!
  const img = new Image()
  img.src = frames[unsuccessfulAttempts + 1]!
})

const answerAtom = atom(
  async (get) => (await get(bocchleQueryAtom))?.episode as Episode,
)

const GameStateAtoms = {
  todaysDate: todaysDateAtom,
  validateAnswer: validateAnswerAtom,
  attemptsHistory: attemptsHistoryAtom,
  attemptsHistoryWithPlaceHolders: attemptsHistoryWithPlaceHoldersAtom,
  hasWon: hasWonAtom,
  gameEnded: gameEndedAtom,
  lastAttemptDate: lastAttemptDateAtom,
  currentFrame: currentFrameAtom,
  loadNextFrame: loadNextFrameAtom,
  answer: answerAtom,
}

export default GameStateAtoms
