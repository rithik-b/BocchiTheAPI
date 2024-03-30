import RandomFrame from "./_components/RandomFrame"
import { api } from "../trpc/server"

const Home = async () => {
  const firstFrame = await api.frames.randomFrame()
  return <RandomFrame firstFrame={firstFrame} />
}

export default Home
