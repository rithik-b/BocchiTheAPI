"use client"

import { type NextPage } from "next"
import React from "react"
import Image from "next/image"
import { Loader2 } from "lucide-react"
import { api } from "../trpc/react"
import { Button } from "../components/ui/button"
import { AspectRatio } from "../components/ui/aspect-ratio"

const Home: NextPage = () => {
  const [isLoading, setIsLoading] = React.useState(true)
  const frameQuery = api.frames.randomFrame.useQuery()

  const onClick = () => {
    setIsLoading(true)
    void frameQuery.refetch()
  }

  return (
    <main>
      <div className="grid place-items-center space-y-2">
        {frameQuery.isFetched && !frameQuery.isError && (
          <div className="lg:h-8/12 grid w-screen content-center bg-pink-300 md:p-8 lg:w-8/12 dark:bg-slate-700">
            <AspectRatio ratio={16 / 9}>
              <Image
                src={frameQuery.data!.url}
                alt="Boccher frame"
                fill
                unoptimized
                className="rounded-md object-cover"
                onLoad={() => setIsLoading(false)}
              />
            </AspectRatio>
          </div>
        )}
        <Button onClick={onClick} disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isLoading ? "Getting Boccher" : "Get Boccher"}
        </Button>
      </div>
    </main>
  )
}

export default Home
