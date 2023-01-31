import { type AppType } from "next/app"

import { api } from "../utils/api"

import "../styles/globals.css"
import SiteHeader from "@components/SiteHeader"

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <SiteHeader />
      <Component {...pageProps} />
    </>
  )
}

export default api.withTRPC(MyApp)
