import { atom, useAtomValue } from "jotai"
import BocchleInfiniteStateAtoms from "../../BocchleInfiniteStateAtoms"
import { cn } from "@rithik/bocchi-the-website/lib/utils"

const Dorito = ({ className }: { className?: string }) => {
  return (
    <svg
      className={className}
      width="67"
      height="141"
      viewBox="0 0 67 141"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Path"
        fill="#f1d679"
        fill-rule="evenodd"
        stroke="#000000"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M 63 3 L 9 60 L 2 77 L 2 86 L 5 94 L 53 140 L 55 138 L 62 73 L 63 3 Z"
      />
    </svg>
  )
}

const livesStateAtom = atom((get) => {
  const lives = get(BocchleInfiniteStateAtoms.lives)
  const maxLives = get(BocchleInfiniteStateAtoms.maxLives)
  return Array.from({ length: maxLives }, (_, i) => i < lives).reverse()
})

const Lives = () => {
  const livesState = useAtomValue(livesStateAtom)
  return (
    <div className="flex">
      {livesState.map((fill, i) => (
        <Dorito
          className={cn(
            "size-8 -rotate-12 transition-opacity duration-300",
            !fill && "opacity-50",
          )}
          key={i}
        />
      ))}
    </div>
  )
}

export default Lives
