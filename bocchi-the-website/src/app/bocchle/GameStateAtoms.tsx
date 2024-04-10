import {
  type Episode,
  edToEpisodes,
} from "@rithik/bocchi-the-website/data/episode"
import { api } from "@rithik/bocchi-the-website/trpc/react"
import { atomWithStorage, unwrap } from "jotai/utils"
import { type Getter, atom } from "jotai/vanilla"
import { atomEffect } from "jotai-effect"
import { getDateString } from "@rithik/bocchi-the-website/lib/utils"

const todaysDateAtom = atom(new Date())

const attemptsHistoryAtom = atomWithStorage<string[]>(
  "attemptsHistory",
  [],
  undefined,
  {
    getOnInit: true,
  },
)

const ranInitialization = atom(false)
const initializeGameStateEffect = atomEffect((get, set) => {
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

const bocchleQueryAtom = api.bocchle.atomWithQuery((get: Getter) => ({
  todaysDate: get(todaysDateAtom),
  timezoneOffset: get(todaysDateAtom).getTimezoneOffset(),
}))

const validateAnswer = async (get: Getter, givenAnswer: string) => {
  const { episode: actualAnswer } = await get(bocchleQueryAtom)
  const sanitizedAnswer = givenAnswer.replace(/^0+/, "")
  const episodesForEd = edToEpisodes.get(actualAnswer as string)

  return (
    sanitizedAnswer === actualAnswer ||
    (episodesForEd?.includes(sanitizedAnswer) ?? false)
  )
}
const validateAnswerAtom = atom(null, (get, set, givenAnswer: string) =>
  validateAnswer(get, givenAnswer),
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
    status: (await validateAnswer(get, a)) ? "correct" : "incorrect",
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

const unsuccessfulAttemptsAtom = atom(async (get) => {
  const attempts = await get(attemptsHistoryWithStateAtom)
  return attempts.filter((a) => a.status === "incorrect").length
})

const hasWonAtom = atom((get) => {
  const attempts = get(unwrap(attemptsHistoryWithStateAtom))
  return attempts?.[attempts.length - 1]?.status === "correct" ?? false
})

const hasLostAtom = atom((get) => get(unwrap(unsuccessfulAttemptsAtom)) === 6)

const gameEndedAtom = atom((get) => get(hasWonAtom) || get(hasLostAtom))

const lastAttemptDateAtom = atomWithStorage("lastAttemptDate", "", undefined, {
  getOnInit: true,
})

const currentFrameAtom = atom((get) => {
  const query = get(unwrap(bocchleQueryAtom))
  const unsuccessfulAttempts = get(unwrap(unsuccessfulAttemptsAtom))!

  if (!query) return null

  const { frames } = query
  return frames[unsuccessfulAttempts > 5 ? 5 : unsuccessfulAttempts]!
})

const loadNextFrameAtom = atom(null, (get, _set) => {
  const unsuccessfulAttempts = get(unwrap(unsuccessfulAttemptsAtom))!
  if (unsuccessfulAttempts === 5) return
  const { frames } = get(unwrap(bocchleQueryAtom))!
  const img = new Image()
  img.src = frames[unsuccessfulAttempts + 1]!
})

const answerAtom = atom(
  async (get) => (await get(bocchleQueryAtom)).episode as Episode,
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
