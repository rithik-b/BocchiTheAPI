import { atom, useAtomValue } from "jotai"
import { env } from "@rithik/bocchi-the-website/env"
import Share from "../../_components/Share"
import BocchleInfiniteStateAtoms from "../BocchleInfiniteStateAtoms"

const shareUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/bocchle-infinite`

const shareMessageAtom = atom((get) => {
  const score = get(BocchleInfiniteStateAtoms.score)
  const maxLives = get(BocchleInfiniteStateAtoms.maxLives)
  return `Bocchle ∞\n${score} points\n${maxLives} lives`
})

const BocchleInfiniteShare = () => {
  const shareMessage = useAtomValue(shareMessageAtom)
  return <Share shareMessage={shareMessage} shareUrl={shareUrl} />
}

export default BocchleInfiniteShare
