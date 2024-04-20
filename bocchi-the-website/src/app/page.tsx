import RandomFrame from "./_components/RandomFrame"
import { api } from "../trpc/server"

export const metadata = {
  title: "Boccher",
  description: "Get a random Boccher frame",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

// no cache
export const dynamic = "force-dynamic"

const Home = async () => {
  const firstFrame = await api.randomFrame()
  return <RandomFrame firstFrame={firstFrame} />
}

export default Home
