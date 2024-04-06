"use client"

import { api } from "@rithik/bocchi-the-website/trpc/react"
import ImageFrame from "../_components/ImageFrame"
import { useCallback, useEffect, useState } from "react"
import { useAtomCallback } from "jotai/utils"
import { cn, getDateString } from "@rithik/bocchi-the-website/lib/utils"
import { useAtomValue, useSetAtom } from "jotai/react"
import Keypad from "./_components/Keypad"
import GameStateAtoms from "./GameStateAtoms"
import AttemptsHistory from "./_components/AttemptsHistory"
import Results from "./_components/Results"
import Attempt from "./_components/Attempt"
import {
  type Episode,
  edToEpisodes,
} from "@rithik/bocchi-the-website/data/episode"
import VictoryAnimation from "./_components/VictoryAnimation"

const useResetAtomsOnNewDay = () => {
  const resetAtomsIfNeeded = useAtomCallback(
    useCallback((get, set) => {
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
    }, []),
  )

  useEffect(() => resetAtomsIfNeeded(), [resetAtomsIfNeeded])
}

const validateAnswer = (givenAnswer: string, actualAnswer: string) => {
  const sanitizedAnswer = givenAnswer.replace(/^0+/, "")
  const episodesForEd = edToEpisodes.get(actualAnswer)
  return (
    sanitizedAnswer === actualAnswer ||
    (episodesForEd?.includes(sanitizedAnswer) ?? false)
  )
}

const BocchlePage = () => {
  useResetAtomsOnNewDay()
  const todaysDate = useAtomValue(GameStateAtoms.todaysDate)
  const unsuccessfulAttempts = useAtomValue(GameStateAtoms.unsuccessfulAttempts)
  const setAttemptsHistory = useSetAtom(GameStateAtoms.attemptsHistory)
  const gameEnded = useAtomValue(GameStateAtoms.gameEnded)
  const [answer, setAnswer] = useState("")
  const [answerStatus, setAnswerStatus] = useState<
    "correct" | "incorrect" | undefined
  >(undefined)
  const [hasLoadedImage, setHasLoadedImage] = useState(false)
  const [playAnimation, setPlayAnimation] = useState(false)

  const { data: currentFrame } = api.bocchle.todaysFrames.useQuery({
    todaysDate,
    timezoneOffset: todaysDate.getTimezoneOffset(),
    attempt: unsuccessfulAttempts > 5 ? 5 : unsuccessfulAttempts,
  })

  useEffect(() => {
    if (answer.length !== 2) return

    const isCorrect = validateAnswer(
      answer,
      (currentFrame?.episode as string) ?? "",
    )

    if (!isCorrect) {
      setAnswerStatus("incorrect")
      setHasLoadedImage(false)
      setTimeout(() => {
        setAttemptsHistory((h) => [...h, { attempt: answer, isCorrect: false }])
        setAnswer("")
        setAnswerStatus(undefined)
      }, 1500)
    } else {
      setAnswerStatus("correct")
      setTimeout(() => {
        setAttemptsHistory((h) => [...h, { attempt: answer, isCorrect: true }])
        setAnswer("")
        setAnswerStatus(undefined)
        setPlayAnimation(true)
      }, 1500)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer])

  return (
    <main className="flex h-full flex-col items-center gap-5 pb-4">
      {playAnimation && <VictoryAnimation />}
      <div className="flex w-full flex-col items-center md:max-w-[768px]">
        <ImageFrame
          src={currentFrame?.url}
          onLoad={() => setHasLoadedImage(true)}
        />
      </div>
      <div
        className={cn(
          "flex h-full w-full flex-col items-center gap-5 px-5 sm:gap-2",
          !gameEnded && !!currentFrame && "justify-between",
        )}
      >
        <AttemptsHistory placeholder={!currentFrame} />
        {!!currentFrame && (
          <div
            className={cn(
              "flex h-full max-h-96 w-full flex-col items-center overflow-hidden duration-300",
              gameEnded && "max-h-0",
            )}
          >
            <Keypad
              value={answer}
              onChange={setAnswer}
              disabled={!hasLoadedImage}
            >
              <Attempt
                className={cn(
                  answerStatus === "incorrect" && "animate-shake",
                  "h-full max-h-16 min-h-8 w-full sm:h-8",
                )}
                status={answerStatus}
              >
                {answer}
              </Attempt>
            </Keypad>
          </div>
        )}
        {gameEnded && !!currentFrame && (
          <Results answer={currentFrame.episode as Episode} />
        )}
      </div>
    </main>
  )
}

export default BocchlePage
