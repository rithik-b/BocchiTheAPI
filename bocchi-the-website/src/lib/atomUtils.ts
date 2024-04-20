import { getTRPCErrorFromUnknown } from "@trpc/server"
import { type WritableAtom, atom } from "jotai"
import { atomEffect } from "jotai-effect"

export const queryAtomWithRetry = <T>(
  queryAtom: WritableAtom<Promise<T>, [], void>,
) => {
  const retryEffect = atomEffect((_get, set) => {
    set(queryAtom) // retry
  })

  return atom(
    async (get) => {
      try {
        return await get(queryAtom)
      } catch (e) {
        if (
          getTRPCErrorFromUnknown(e)?.message === "This operation was aborted."
        ) {
          get(retryEffect)
          return null
        }
        throw e
      }
    },
    (_get, set) => {
      set(queryAtom)
    },
  )
}
