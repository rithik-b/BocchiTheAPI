import { type AppType } from "next/app"
import "@boccher/styles/globals.css"
import SiteHeader from "@boccher/components/SiteHeader"
import { ThemeProvider } from "next-themes"
import React from "react"
import { Inter as FontSans } from "@next/font/google"
import SiteFooter from "@boccher/components/SiteFooter"
import { QueryClient } from "@tanstack/query-core"
import { QueryClientProvider } from "@tanstack/react-query"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

const queryClient = new QueryClient()

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <style jsx global>{`
              :root {
                --font-sans: ${fontSans.style.fontFamily};
              }
              }`}</style>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-pink-100 dark:bg-slate-900">
            <SiteHeader />
            <Component {...pageProps} />
            <SiteFooter />
          </div>
        </ThemeProvider>
      </QueryClientProvider>
    </>
  )
}

export default MyApp
