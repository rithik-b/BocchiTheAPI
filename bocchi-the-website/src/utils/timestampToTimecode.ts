function timestampToTimecode(timestamp: number) {
  const minutes = Math.floor(timestamp / 60)
  const seconds = Math.floor(timestamp % 60)
  const timecode = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`
  return timecode
}

export default timestampToTimecode
