import RandomFrame from "./_components/RandomFrame"
import { api } from "../trpc/server"

// no cache
export const dynamic = "force-dynamic"

const Home = async () => {
  const firstFrame = await api.randomFrame()
  return <RandomFrame firstFrame={firstFrame} />
}

export default Home
