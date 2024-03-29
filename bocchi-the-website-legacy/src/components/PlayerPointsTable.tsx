import UserIdentity from "@boccher/models/UserIdentity"
import PlayerInfoCell from "@boccher/components/PlayerInfoCell"
import React, { useMemo } from "react"
import cn from "@boccher/utils/cn"

interface Props {
  players: UserIdentity[] | undefined
  oddPlayers: boolean
}

const PlayerPointsTable = (props: Props) => {
  const { players, oddPlayers } = props
  const playersToDisplay = useMemo(
    () =>
      oddPlayers
        ? players?.filter((_, i) => i % 2 === 0)
        : players?.filter((_, i) => i % 2 === 1),
    [players, oddPlayers]
  )

  if (!playersToDisplay || playersToDisplay.length === 0) return null

  return (
    <div className="flex h-full flex-col justify-center">
      <div
        className={cn(
          "flex flex-col bg-pink-200 p-5 dark:bg-slate-700",
          oddPlayers ? "rounded-r-2xl" : "rounded-l-2xl"
        )}
      >
        {playersToDisplay?.map((player, key) => (
          <PlayerInfoCell player={player} key={key} />
        ))}
      </div>
    </div>
  )
}

export default PlayerPointsTable
