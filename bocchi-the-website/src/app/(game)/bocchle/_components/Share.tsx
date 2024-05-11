import { getDaysSinceStart } from "@rithik/bocchi-the-website/lib/utils"
import { atom, useAtomValue } from "jotai"
import BocchleStateAtoms from "../BocchleStateAtoms"
import { env } from "@rithik/bocchi-the-website/env"
import Share from "../../_components/Share"

const shareUrl = `${env.NEXT_PUBLIC_WEBSITE_URL}/bocchle`

const shareMessageAtom = atom((get) => {
  const attempts = get(BocchleStateAtoms.attemptsHistoryWithPlaceHolders)

  const attemptsString = attempts
    .map((a) => {
      switch (a.status) {
        case "correct":
          return "🟩"
        case "incorrect":
          return "🟥"
        default:
          return "⬜️"
      }
    })
    .join("")

  const todaysDate = get(BocchleStateAtoms.todaysDate)

  return `Bocchle ${getDaysSinceStart(todaysDate)} \n` + attemptsString
})

const BocchleShare = () => {
  const shareMessage = useAtomValue(shareMessageAtom)
  return <Share shareMessage={shareMessage} shareUrl={shareUrl} />
}

export default BocchleShare
