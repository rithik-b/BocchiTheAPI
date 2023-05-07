import UserIdentity from "@boccher/types/UserIdentity"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@boccher/components/primitives/Avatar"

interface Props {
  user: UserIdentity
}

const UserAvatar = (props: Props) => {
  const { user } = props
  return (
    <Avatar>
      <AvatarImage src={user.avatarUrl} alt={user.name} />
      <AvatarFallback>
        {user.name.match(/\b[A-Z]/g)?.join("") || ""}
      </AvatarFallback>
    </Avatar>
  )
}

export default UserAvatar
