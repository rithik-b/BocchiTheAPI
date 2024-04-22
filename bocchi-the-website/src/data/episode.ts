export const episodes = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
  "op",
  "ed1",
  "ed2",
  "ed3",
] as const

export type Episode = (typeof episodes)[number]

export const formattedEpisodes = new Map<Episode, string>([
  ["1", "Episode 1"],
  ["2", "Episode 2"],
  ["3", "Episode 3"],
  ["4", "Episode 4"],
  ["5", "Episode 5"],
  ["6", "Episode 6"],
  ["7", "Episode 7"],
  ["8", "Episode 8"],
  ["9", "Episode 9"],
  ["10", "Episode 10"],
  ["11", "Episode 11"],
  ["12", "Episode 12"],
  ["op", "Opening"],
  ["ed1", "Ending 1"],
  ["ed2", "Ending 2"],
  ["ed3", "Ending 3"],
])

export const mvToEpisodes = new Map([
  ["op", ["1", "2", "3", "4", "5", "6", "7", "9", "10", "11"]],
  ["ed1", ["1", "2", "3"]],
  ["ed2", ["4", "5", "6", "7"]],
  ["ed3", ["9", "10", "11"]],
])
