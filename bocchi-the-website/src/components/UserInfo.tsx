import * as React from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@boccher/components/primitives/DropdownMenu"
import { Button } from "@boccher/components/primitives/Button"
import useQueryUserIdentity from "@boccher/hooks/useQueryUserIdentity"
import UserAvatar from "@boccher/components/UserAvatar"
import useMutationSignout from "@boccher/hooks/useMutationSignout"
import { Icons } from "@boccher/components/primitives/Icons"

const UserInfo = () => {
  const { isFetched, data: userIdentity } = useQueryUserIdentity({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const { mutate, isLoading } = useMutationSignout()

  if (!isFetched || !userIdentity) return null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <UserAvatar user={userIdentity} />
          <span className="sr-only">{userIdentity.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" forceMount>
        <DropdownMenuLabel>
          {userIdentity.name}#{userIdentity.discriminator}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => mutate()} disabled={isLoading}>
          <Icons.logout className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserInfo
