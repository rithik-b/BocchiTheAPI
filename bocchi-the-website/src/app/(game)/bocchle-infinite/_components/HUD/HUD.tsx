import Lives from "./Lives"
import Score from "./Score"

const HUD = () => {
  return (
    <div className="flex w-full items-end justify-between px-5 md:px-0">
      <Score />
      <Lives />
    </div>
  )
}

export default HUD
