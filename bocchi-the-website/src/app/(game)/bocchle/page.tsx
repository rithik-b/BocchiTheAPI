"use client"

import ImageFrame from "../../_components/ImageFrame"
import { useEffect, useState } from "react"
import { cn } from "@rithik/bocchi-the-website/lib/utils"
import { useAtom, useAtomValue, useSetAtom } from "jotai/react"
import Keypad, { keyButtonStyle } from "../_components/Keypad"
import BocchleStateAtoms from "./BocchleStateAtoms"
import AttemptsHistory from "./_components/AttemptsHistory"
import Results from "./_components/Results"
import Attempt from "../_components/Attempt"
import VictoryAnimation from "./_components/VictoryAnimation"
import { atom } from "jotai"
import { motion } from "framer-motion"
import Tutorial from "./_components/Tutorial/Tutorial"
import Collapsible from "@rithik/bocchi-the-website/components/Collapsible"

const imageFrameStyles = cn("flex w-full md:max-w-[768px]")

const BocchlePagePlaceholder = () => {
  return (
    <>
      <div className={imageFrameStyles}>
        <ImageFrame src={undefined} />
      </div>
      <AttemptsHistory placeholder />
    </>
  )
}

const BocchlePage = () => {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <main className="flex h-full flex-col items-center gap-5 pb-4">
      {isClient ? <BocchlePageClient /> : <BocchlePagePlaceholder />}
    </main>
  )
}

const answerStatusAtom = atom<"correct" | "incorrect" | undefined>(undefined)
const layoutIdAtom = atom((get) => {
  if (!get(answerStatusAtom)) return "attempt-placeholder"
  return `attempt-${get(BocchleStateAtoms.attemptsHistory).length}`
})

const BocchlePageClient = () => {
  const currentFrame = useAtomValue(BocchleStateAtoms.currentFrame)
  const setAttemptsHistory = useSetAtom(BocchleStateAtoms.attemptsHistory)
  const gameEnded = useAtomValue(BocchleStateAtoms.gameEnded)
  const layoutId = useAtomValue(layoutIdAtom)
  const [answer, setAnswer] = useState("")
  const [answerStatus, setAnswerStatus] = useAtom(answerStatusAtom)
  const [hasLoadedImage, setHasLoadedImage] = useState(false)
  const [playVictoryAnimation, setPlayVictoryAnimation] = useState(false)
  const validateAnswer = useSetAtom(BocchleStateAtoms.validateAnswer)
  const loadNextFrame = useSetAtom(BocchleStateAtoms.loadNextFrame)

  useEffect(() => {
    const validate = async () => {
      if (answer.length !== 2) return

      const isCorrect = await validateAnswer(answer)

      if (!isCorrect) {
        setAnswerStatus("incorrect")
        setHasLoadedImage(false)
        loadNextFrame()
        setTimeout(() => {
          setAttemptsHistory((h) => [...h, answer])
          setAnswer("")
          setAnswerStatus(undefined)
        }, 1500)
      } else {
        setAnswerStatus("correct")
        setTimeout(() => {
          setAttemptsHistory((h) => [...h, answer])
          setAnswer("")
          setAnswerStatus(undefined)
          setPlayVictoryAnimation(true)
        }, 1500)
      }
    }

    void validate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer])

  return (
    <>
      {playVictoryAnimation && <VictoryAnimation />}
      <div className={imageFrameStyles}>
        <ImageFrame src={currentFrame} onLoad={() => setHasLoadedImage(true)} />
      </div>
      <div
        className={cn(
          "flex h-full w-full flex-col items-center gap-5 px-5 sm:gap-2",
          !gameEnded && !!currentFrame && "justify-between",
        )}
      >
        <AttemptsHistory placeholder={!currentFrame} />
        <Collapsible open={!gameEnded}>
          <Keypad
            value={answer}
            onChange={setAnswer}
            disabled={!hasLoadedImage}
            helpButton={<Tutorial className={keyButtonStyle} />}
          >
            <Attempt
              className={cn(answerStatus === "incorrect" && "animate-shake")}
              status={answerStatus}
              variant="input"
            >
              <motion.span key={layoutId} layoutId={layoutId}>
                {answer}
              </motion.span>
            </Attempt>
          </Keypad>
        </Collapsible>
        {gameEnded && !!currentFrame && <Results />}
      </div>
    </>
  )
}

export default BocchlePage
