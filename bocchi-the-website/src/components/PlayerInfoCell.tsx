import UserIdentity from "@boccher/models/UserIdentity"
import UserAvatar from "@boccher/components/UserAvatar"

interface Props {
  player: UserIdentity
}

const PlayerInfoCell = (props: Props) => {
  const { player } = props

  return (
    <div className="flex items-center">
      <UserAvatar user={player} />
      <div className="ml-4 flex flex-row gap-0.5">
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
