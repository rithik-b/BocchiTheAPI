import { useAtomValue } from "jotai"
import BocchleInfiniteStateAtoms from "../../BocchleInfiniteStateAtoms"

const Score = () => {
  const score = useAtomValue(BocchleInfiniteStateAtoms.score)
  return (
    <span className="text-xl">
      {score} point{score !== 1 && "s"}
    </span>
  )
}

export default Score
