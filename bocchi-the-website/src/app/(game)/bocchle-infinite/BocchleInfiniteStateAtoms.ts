import { queryAtomWithRetry } from "@rithik/bocchi-the-website/lib/atomUtils"
import { validateAnswer } from "@rithik/bocchi-the-website/lib/utils"
import { api } from "@rithik/bocchi-the-website/trpc/react"
import { atom } from "jotai"
import { atomEffect } from "jotai-effect"

const currentPageAtom = atom<"setup" | "game">("setup")

const maxLivesAtom = atom(3)
const livesAtom = (() => {
  const _livesAtom = atom(3)

  const capToMaxLivesEffect = atomEffect((get, set) => {
    const maxLives = get(maxLivesAtom)
    const lives = get(_livesAtom)
    if (lives > maxLives) {
      set(_livesAtom, maxLives)
    }
  })

  return atom(
    (get) => {
      get(capToMaxLivesEffect)
      return get(_livesAtom)
    },
    (_get, set, update: number) => set(_livesAtom, update),
  )
})()

const bocchleInfiniteQueryAtom = queryAtomWithRetry(
  api.randomFrame.atomWithQuery(undefined),
)

const answerAtom = atom("")
const validateBocchleInfiniteAnswerAtom = atom(async (get) => {
  const query = await get(bocchleInfiniteQueryAtom)

  if (!query) return false

  const { source: actualAnswer } = query
  const givenAnswer = get(answerAtom)

  return validateAnswer(givenAnswer, actualAnswer as string)
})

const scoreAtom = atom(0)
const gameEndedAtom = atom((get) => get(livesAtom) <= 0)

const BocchleInfiniteStateAtoms = {
  currentPage: currentPageAtom,
  maxLives: maxLivesAtom,
  lives: livesAtom,
  bocchleInfiniteQuery: bocchleInfiniteQueryAtom,
  answer: answerAtom,
  validateBocchleInfiniteAnswer: validateBocchleInfiniteAnswerAtom,
  score: scoreAtom,
  gameEnded: gameEndedAtom,
}

export default BocchleInfiniteStateAtoms
