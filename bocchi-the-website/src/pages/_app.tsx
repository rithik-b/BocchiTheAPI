import { type AppType } from "next/app"
import { api } from "@utils/api"
import "@styles/globals.css"
import SiteHeader from "@components/SiteHeader"
import { ThemeProvider } from "next-themes"
import React from "react"
import { Inter as FontSans } from "@next/font/google"
import SiteFooter from "@components/SiteFooter"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>{`
              :root {
                --font-sans: ${fontSans.style.fontFamily};
              }
              }`}</style>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <div className="min-h-screen bg-pink-100 dark:bg-slate-900">
          <SiteHeader />
          <Component {...pageProps} />
          <SiteFooter />
        </div>
      </ThemeProvider>
    </>
  )
}

export default api.withTRPC(MyApp)
