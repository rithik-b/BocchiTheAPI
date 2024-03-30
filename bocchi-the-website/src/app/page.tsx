"use client"

import { type NextPage } from "next"
import { Loader2 } from "lucide-react"
import { api } from "../trpc/react"
import { Button } from "../components/ui/button"
import { useState } from "react"
import ImageFrame from "../components/ImageFrame"

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = useState(true)
  const frameQuery = api.frames.randomFrame.useQuery()

  const onClick = () => {
    setIsLoading(true)
    void frameQuery.refetch()
  }

  return (
    <main>
      <div className="flex flex-col items-center gap-2">
        <ImageFrame
          src={frameQuery.data?.url}
          onLoad={() => setIsLoading(false)}
        />
        <Button onClick={onClick} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Getting Boccher" : "Get Boccher"}
        </Button>
      </div>
    </main>
  )
}

export default Home
