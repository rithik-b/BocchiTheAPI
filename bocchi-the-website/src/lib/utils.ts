import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { env } from "../env"
import { mvToEpisodes } from "../data/episode"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function getDateString(date: Date, offset: number) {
  date = new Date(date.getTime() - offset * 60 * 1000) // Need to adjust for timezone offset
  const day = String(date.getUTCDate()).padStart(2, "0")
  const month = String(date.getUTCMonth() + 1).padStart(2, "0") // Months are 0-based, so we add 1
  const year = date.getUTCFullYear()

  return `${year}-${month}-${day}`
}

export function getDaysSinceStart(todaysDate: Date) {
  function dateToDays(dateString: string) {
    const date = new Date(dateString + "T00:00:00Z")
    return date.getTime() / (1000 * 60 * 60 * 24)
  }

  return (
    Math.floor(
      dateToDays(getDateString(todaysDate, todaysDate.getTimezoneOffset())) -
        dateToDays(env.NEXT_PUBLIC_START_DATE),
    ) + 1
  )
}

export function validateAnswer(givenAnswer: string, actualAnswer: string) {
  const sanitizedAnswer = givenAnswer.replace(/^0+/, "")
  const episodesForEd = mvToEpisodes.get(actualAnswer)

  return (
    sanitizedAnswer === actualAnswer ||
    (episodesForEd?.includes(sanitizedAnswer) ?? false)
  )
}
