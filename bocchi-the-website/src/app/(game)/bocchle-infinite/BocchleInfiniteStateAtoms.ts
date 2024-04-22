import { queryAtomWithRetry } from "@rithik/bocchi-the-website/lib/atomUtils"
import { validateAnswer } from "@rithik/bocchi-the-website/lib/utils"
import { api } from "@rithik/bocchi-the-website/trpc/react"
import { type Getter, type SetStateAction, type Setter, atom } from "jotai"
import { atomEffect } from "jotai-effect"
import { unwrap } from "jotai/utils"

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

const answerStatusAtom = atom<"correct" | "incorrect" | undefined>(undefined)
const hasLoadedImageAtom = atom(false)
const answerAtom = (() => {
  const _answerAtom = atom("")

  const validateAnswerEffect = (
    get: Getter,
    set: Setter,
    givenAnswer: string,
  ) => {
    if (givenAnswer.length !== 2) return

    const query = get(unwrap(bocchleInfiniteQueryAtom))
    if (!query) return

    const isCorrect = validateAnswer(givenAnswer, query.source as string)

    set(answerStatusAtom, isCorrect ? "correct" : "incorrect")
    set(hasLoadedImageAtom, false)
    set(bocchleInfiniteQueryAtom)

    setTimeout(() => {
      set(answerStatusAtom, undefined)
      set(_answerAtom, "")
    }, 1500)
  }

  return atom(
    (get) => get(_answerAtom),
    (get, set, update: SetStateAction<string>) => {
      const givenAnswer =
        typeof update === "function" ? update(get(_answerAtom)) : update
      validateAnswerEffect(get, set, givenAnswer)
      return set(_answerAtom, update)
    },
  )
})()

const scoreAtom = atom(0)
const gameEndedAtom = atom((get) => get(livesAtom) <= 0)

const currentFrameAtom = atom((get) => {
  const query = get(unwrap(bocchleInfiniteQueryAtom))
  return query?.url ?? null
})

const BocchleInfiniteStateAtoms = {
  currentPage: currentPageAtom,
  maxLives: maxLivesAtom,
  lives: livesAtom,
  bocchleInfiniteQuery: bocchleInfiniteQueryAtom,
  answer: answerAtom,
  answerStatus: answerStatusAtom,
  hasLoadedImage: hasLoadedImageAtom,
  score: scoreAtom,
  gameEnded: gameEndedAtom,
  currentFrame: currentFrameAtom,
}

export default BocchleInfiniteStateAtoms
