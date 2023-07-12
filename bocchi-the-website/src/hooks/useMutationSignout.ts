import { useMutation, UseMutationOptions } from "@tanstack/react-query"
import { useRouter } from "next/router"
import { env } from "@boccher/env/client.mjs"

function useMutationSignout(
  options?: Omit<UseMutationOptions, "mutationKey" | "mutationFn">
) {
  const router = useRouter()

  return useMutation(
    ["signout"],
    async () => {
      const response = await fetch(
        `${env.NEXT_PUBLIC_QUIZ_API_URL}/auth/signout`,
        {
          method: "POST",
          credentials: "include",
        }
      )

      if (!response.ok) throw new Error(response.statusText)

      router.reload()
    },
    options
  )
}

export default useMutationSignout
