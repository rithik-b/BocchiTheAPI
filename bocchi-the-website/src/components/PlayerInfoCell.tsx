import UserIdentity from "@boccher/types/UserIdentity"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@boccher/components/primitives/Avatar"

interface Props {
  player: UserIdentity
}

const PlayerInfoCell = (props: Props) => {
  const { player } = props

  return (
    <div className="flex items-center">
      <div className="h-10 w-10 flex-shrink-0">
        <Avatar>
          <AvatarImage src={player.avatarUrl} alt={player.name} />
          <AvatarFallback>{player.name}</AvatarFallback>
        </Avatar>
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
