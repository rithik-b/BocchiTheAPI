"use client"

import { Provider, createStore } from "jotai"
import { type PropsWithChildren } from "react"

const jotaiStore = createStore()

const JotaiProvider = ({ children }: PropsWithChildren) => (
  <Provider store={jotaiStore}>{children}</Provider>
)

export default JotaiProvider
