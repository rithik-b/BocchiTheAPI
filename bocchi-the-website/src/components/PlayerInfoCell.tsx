import UserIdentity from "@boccher/types/UserIdentity"
import UserAvatar from "@boccher/components/UserAvatar"

interface Props {
  player: UserIdentity
}

const PlayerInfoCell = (props: Props) => {
  const { player } = props

  return (
    <div className="flex items-center">
      <div className="h-10 w-10 flex-shrink-0">
        <UserAvatar user={player} />
      </div>
      <div className="ml-4 flex flex-row gap-1">
        <div className="text-md font-medium text-gray-900 dark:text-slate-100">
          {player.name}
        </div>
        <div className="text-md text-gray-500 dark:text-slate-400">
          #{player.discriminator}
        </div>
      </div>
    </div>
  )
}

export default PlayerInfoCell
