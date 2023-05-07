import * as React from "react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@boccher/components/primitives/DropdownMenu"
import { Button } from "@boccher/components/primitives/Button"
import useQueryUserIdentity from "@boccher/hooks/useQueryUserIdentity"
import UserAvatar from "@boccher/components/UserAvatar"
import { LogOut } from "lucide-react"
import { useCallback } from "react"
import { env } from "@boccher/env/client.mjs"
import { useRouter } from "next/router"

const UserInfo = () => {
  const { isFetched, data: userIdentity } = useQueryUserIdentity({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  })

  const router = useRouter()

  const logout = useCallback(async () => {
    await fetch(`${env.NEXT_PUBLIC_QUIZ_API_URL}/auth/signout`, {
      method: "POST",
      credentials: "include",
    })

    router.reload()
  }, [router])

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
        <DropdownMenuItem onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default UserInfo
