import { useAtomValue, useSetAtom } from "jotai"
import { memo } from "react"
import BocchleInfiniteShare from "./Share"
import BocchleInfiniteStateAtoms from "../BocchleInfiniteStateAtoms"
import { Button } from "@rithik/bocchi-the-website/components/ui/button"

const Results = () => {
  const score = useAtomValue(BocchleInfiniteStateAtoms.score)
  const setCurrentPage = useSetAtom(BocchleInfiniteStateAtoms.currentPage)

  return (
    <div className="flex flex-col items-center gap-5">
      <span className="text-center text-3xl">Game Over</span>
      <span className="text-center text-2xl font-medium">
        Your score was {score}!
      </span>
      <div className="flex w-96 flex-col gap-2">
        <BocchleInfiniteShare />
        <Button variant="secondary" onClick={() => setCurrentPage("setup")}>
          Restart
        </Button>
      </div>
    </div>
  )
}

export default memo(Results)
