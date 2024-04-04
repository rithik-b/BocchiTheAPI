"use client"

import { api } from "@rithik/bocchi-the-website/trpc/react"
import ImageFrame from "../_components/ImageFrame"
import { Suspense, useCallback, useEffect, useMemo, useState } from "react"
import { useAtomCallback } from "jotai/utils"
import { cn, getDateString } from "@rithik/bocchi-the-website/lib/utils"
import { useAtom, useAtomValue, useSetAtom } from "jotai/react"
import Keypad from "./_components/Keypad"
import GameStateAtoms from "./GameStateAtoms"
import AttemptsHistory from "./_components/AttemptsHistory"
import Results from "./_components/Results"
import { VariantProps, cva } from "class-variance-authority"

const useResetAtomsOnNewDay = () => {
  const resetAtomsIfNeeded = useAtomCallback(
    useCallback((get, set) => {
      const todaysDate = getDateString(get(GameStateAtoms.todaysDate))
      const lastAttemptDate = get(GameStateAtoms.lastAttemptDate)
      if (todaysDate !== lastAttemptDate) {
        set(GameStateAtoms.unsuccessfulAttempts, 0)
        set(GameStateAtoms.attemptsHistory, [])
        set(GameStateAtoms.lastAttemptDate, todaysDate)
      }
    }, []),
  )

  useEffect(() => resetAtomsIfNeeded(), [resetAtomsIfNeeded])
}

const answerVariants = cva("min-h-7 text-xl transition-all", {
  variants: {
    status: {
      incorrect: "animate-shake text-red-600",
      correct: "text-green-600",
    },
  },
})

const BocchlePage = () => {
  useResetAtomsOnNewDay()
  const todaysDate = useAtomValue(GameStateAtoms.todaysDate)
  const [unsuccessfulAttempts, setUnsuccessfulAttempts] = useAtom(
    GameStateAtoms.unsuccessfulAttempts,
  )
  const setAttemptsHistory = useSetAtom(GameStateAtoms.attemptsHistory)
  const gameEnded = useAtomValue(GameStateAtoms.gameEnded)
  const [answer, setAnswer] = useState("")
  const [answerStatus, setAnswerStatus] =
    useState<VariantProps<typeof answerVariants>["status"]>(undefined)

  const { data: currentFrame } = api.bocchle.todaysFrames.useQuery({
    todaysDate,
    attempt: unsuccessfulAttempts > 5 ? 5 : unsuccessfulAttempts,
  })
  const { mutateAsync: validateAsync } =
    api.bocchle.validateAnswer.useMutation()

  useEffect(() => {
    if (answer.length !== 2) return

    const validateAnswer = async () => {
      const isCorrect = await validateAsync({
        todaysDate,
        answer,
      })
      if (!isCorrect) {
        setAnswerStatus("incorrect")
        setTimeout(() => {
          setUnsuccessfulAttempts((a) => a + 1)
          setAttemptsHistory((h) => [
            ...h,
            { attempt: answer, isCorrect: false },
          ])
          setAnswer("")
          setAnswerStatus(undefined)
        }, 1500)
      } else {
        setAnswerStatus("correct")
        setTimeout(() => {
          setAttemptsHistory((h) => [
            ...h,
            { attempt: answer, isCorrect: true },
          ])
          setAnswer("")
          setAnswerStatus(undefined)
        }, 1500)
      }
    }

    void validateAnswer()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer])

  return (
    <main className="flex flex-col items-center justify-center gap-5 pb-4">
      <div className="flex w-full flex-col items-center md:max-w-[768px]">
        <ImageFrame src={currentFrame} />
      </div>
      <div className="flex flex-col items-center gap-2 px-5">
        {!!currentFrame && <AttemptsHistory />}
        {!!currentFrame && (
          <div
            className={cn(
              "flex h-64 flex-col items-center gap-2 overflow-hidden transition-[height] duration-300",
              gameEnded && "h-0",
            )}
          >
            <span className={answerVariants({ status: answerStatus })}>
              {answer}
            </span>
            <Keypad value={answer} onChange={setAnswer} />
          </div>
        )}
        {gameEnded && <Results />}
      </div>
    </main>
  )
}

export default BocchlePage
