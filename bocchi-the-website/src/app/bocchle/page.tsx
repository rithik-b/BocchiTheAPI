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

const BocchlePage = () => {
  useResetAtomsOnNewDay()
  const todaysDate = useAtomValue(GameStateAtoms.todaysDate)
  const [unsuccessfulAttempts, setUnsuccessfulAttempts] = useAtom(
    GameStateAtoms.unsuccessfulAttempts,
  )
  const setAttemptsHistory = useSetAtom(GameStateAtoms.attemptsHistory)
  const gameEnded = useAtomValue(GameStateAtoms.gameEnded)
  const [answer, setAnswer] = useState("")
  const [isIncorrect, setIsIncorrect] = useState(false)

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
        setIsIncorrect(true)
        setTimeout(() => {
          setUnsuccessfulAttempts((a) => a + 1)
          setAttemptsHistory((h) => [
            ...h,
            { attempt: answer, isCorrect: false },
          ])
          setAnswer("")
          setIsIncorrect(false)
        }, 1500)
      } else {
        setTimeout(() => {
          setAttemptsHistory((h) => [
            ...h,
            { attempt: answer, isCorrect: true },
          ])
          setAnswer("")
        }, 1500)
      }
    }

    void validateAnswer()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer])

  return (
    <main className="flex flex-col items-center gap-5 pb-5">
      <div className="flex w-full flex-col items-center gap-2 md:max-w-[768px]">
        <ImageFrame src={currentFrame} />
      </div>
      {!!currentFrame && <AttemptsHistory />}
      <span
        className={cn(
          "min-h-6",
          isIncorrect ? "animate-shake text-red-600" : "",
        )}
      >
        {answer}
      </span>
      {!gameEnded && !!currentFrame && (
        <Keypad value={answer} onChange={setAnswer} disabled={!currentFrame} />
      )}
      {gameEnded && <Results />}
    </main>
  )
}

export default BocchlePage
