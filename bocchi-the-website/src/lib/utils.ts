import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { env } from "../env"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDuration(duration: number) {
  const minutes = Math.floor(duration / 60)
  const seconds = duration % 60
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

export function getDateString(date: Date) {
  const offset = date.getTimezoneOffset()
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
      dateToDays(getDateString(todaysDate)) -
        dateToDays(env.NEXT_PUBLIC_START_DATE),
    ) + 1
  )
}
