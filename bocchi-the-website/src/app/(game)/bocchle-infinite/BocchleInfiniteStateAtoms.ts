import { queryAtomWithRetry } from "@rithik/bocchi-the-website/lib/atomUtils"
import { validateAnswer } from "@rithik/bocchi-the-website/lib/utils"
import { api } from "@rithik/bocchi-the-website/trpc/react"
import { type Getter, type SetStateAction, type Setter, atom } from "jotai"
import { atomEffect } from "jotai-effect"
import { unwrap } from "jotai/utils"

const currentPageAtom = atom<"setup" | "game">("setup")

const livesAtom = atom(3)
const maxLivesAtom = (() => {
  const _maxLivesAtom = atom(3)

  return atom(
    (get) => get(_maxLivesAtom),
    (get, set, update: SetStateAction<number>) => {
      const maxLives =
        typeof update === "function" ? update(get(_maxLivesAtom)) : update
      set(_maxLivesAtom, maxLives)
      set(livesAtom, maxLives)
    },
  )
})()

const bocchleInfiniteQueryAtom = queryAtomWithRetry(
  api.randomFrame.atomWithQuery(undefined),
)

const answerStatusAtom = atom<"correct" | "incorrect" | undefined>(undefined)
const hasLoadedImageAtom = atom(false)
const answerAtom = (() => {
  const _answerAtom = atom("")

  const validateBocchleInfiniteAnswer = (
    get: Getter,
    set: Setter,
    givenAnswer: string,
  ) => {
    if (givenAnswer.length !== 2) return

    const query = get(unwrap(bocchleInfiniteQueryAtom))
    if (!query) return

    const isCorrect = validateAnswer(givenAnswer, query.source as string)

    if (isCorrect) set(scoreAtom, (prev) => prev + 1)
    else set(livesAtom, (prev) => prev - 1)

    set(answerStatusAtom, isCorrect ? "correct" : "incorrect")
    set(hasLoadedImageAtom, false)
    set(currentFrameAtom, query.url)
    set(bocchleInfiniteQueryAtom)

    setTimeout(() => {
      set(answerStatusAtom, undefined)
      set(currentFrameAtom, null)
      set(_answerAtom, "")
    }, 1500)
  }

  return atom(
    (get) => get(_answerAtom),
    (get, set, update: SetStateAction<string>) => {
      const givenAnswer =
        typeof update === "function" ? update(get(_answerAtom)) : update
      validateBocchleInfiniteAnswer(get, set, givenAnswer)
      return set(_answerAtom, givenAnswer)
    },
  )
})()

const scoreAtom = atom(0)
const gameEndedAtom = atom((get) => get(livesAtom) <= 0)

const currentFrameAtom = (() => {
  const previousFrameAtom = atom<string | null>(null)

  const loadImageEffect = atomEffect((get) => {
    const query = get(unwrap(bocchleInfiniteQueryAtom))
    if (!query) return

    const img = new Image()
    img.src = query.url
  })

  return atom(
    (get) => {
      get(loadImageEffect)

      const previousFrame = get(previousFrameAtom)
      if (!!previousFrame) return previousFrame

      const query = get(unwrap(bocchleInfiniteQueryAtom))
      return query?.url ?? null
    },
    (_get, set, update: SetStateAction<string | null>) =>
      set(previousFrameAtom, update),
  )
})()

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
