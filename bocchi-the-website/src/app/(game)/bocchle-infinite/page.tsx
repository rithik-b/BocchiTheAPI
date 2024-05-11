"use client"

import { Button } from "@rithik/bocchi-the-website/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@rithik/bocchi-the-website/components/ui/card"
import { Slider } from "@rithik/bocchi-the-website/components/ui/slider"
import { useAtom, useAtomValue, useSetAtom } from "jotai"
import BocchleInfiniteStateAtoms from "./BocchleInfiniteStateAtoms"
import { cn } from "@rithik/bocchi-the-website/lib/utils"
import ImageFrame from "../../_components/ImageFrame"
import Keypad from "../_components/Keypad"
import Attempt from "../_components/Attempt"
import Collapsible from "@rithik/bocchi-the-website/components/Collapsible"
import Results from "./_components/Results"
import HUD from "./_components/HUD/HUD"

const imageFrameStyles = cn("w-full md:max-w-[768px]")

const Setup = () => {
  const [maxLives, setMaxLives] = useAtom(BocchleInfiniteStateAtoms.maxLives)
  const setCurrentPage = useSetAtom(BocchleInfiniteStateAtoms.currentPage)

  return (
    <div className="flex w-full justify-center px-4 pt-4">
      <Card className={imageFrameStyles}>
        <CardHeader>
          <CardTitle>Bocchle Infinite</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex w-full justify-between gap-5">
            <label>Lives</label>
            <div className="flex w-full max-w-[300px] items-center gap-2">
              <Slider
                min={1}
                max={5}
                step={1}
                value={[maxLives]}
                onValueChange={(value) => setMaxLives(value[0]!)}
              />
              <span>{maxLives}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => setCurrentPage("game")}>
            Start
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

const Game = () => {
  const currentFrame = useAtomValue(BocchleInfiniteStateAtoms.currentFrame)
  const [answer, setAnswer] = useAtom(BocchleInfiniteStateAtoms.answer)
  const answerStatus = useAtomValue(BocchleInfiniteStateAtoms.answerStatus)
  const [hasLoadedImage, setHasLoadedImage] = useAtom(
    BocchleInfiniteStateAtoms.hasLoadedImage,
  )
  const gameEnded = useAtomValue(BocchleInfiniteStateAtoms.gameEnded)

  return (
    <div className={cn(imageFrameStyles, "flex flex-col gap-4")}>
      <ImageFrame src={currentFrame} onLoad={() => setHasLoadedImage(true)} />
      <Collapsible
        open={!gameEnded}
        className="flex flex-col items-center gap-4"
      >
        <HUD />
        <Keypad value={answer} onChange={setAnswer} disabled={!hasLoadedImage}>
          <Attempt
            className={cn(answerStatus === "incorrect" && "animate-shake")}
            status={answerStatus}
            variant="input"
          >
            {answer}
          </Attempt>
        </Keypad>
      </Collapsible>
      {gameEnded && <Results />}
    </div>
  )
}

const InfinitePage = () => {
  const currentPage = useAtomValue(BocchleInfiniteStateAtoms.currentPage)
  return (
    <main className="flex h-full flex-col items-center gap-5 pb-4">
      {currentPage === "setup" ? <Setup /> : null}
      {currentPage === "game" ? <Game /> : null}
    </main>
  )
}

export default InfinitePage
