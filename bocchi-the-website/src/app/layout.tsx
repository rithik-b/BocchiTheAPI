import "@rithik/bocchi-the-website/styles/globals.css"

import { TRPCReactProvider } from "@rithik/bocchi-the-website/trpc/react"
import { GeistSans } from "geist/font/sans"
import { ThemeProvider } from "next-themes"
import SiteHeader from "./_components/SiteHeader"
import { cn } from "../lib/utils"
import { Toaster } from "../components/ui/sonner"
import JotaiProvider from "../components/JotaiProvider"

export const metadata = {
  title: "Boccher",
  description: "Get a random Boccher frame",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <body
        className={cn(
          // have to make h full important because of vaul changing the body to h auto
          // https://github.com/emilkowalski/vaul/blob/a30da7d1618afd8b33637982695f0676130346ff/src/use-position-fixed.ts#L38
          "flex !h-full flex-col bg-pink-100 dark:bg-slate-900",
          GeistSans.className,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>
            <JotaiProvider>
              <SiteHeader />
              {children}
              <Toaster />
            </JotaiProvider>
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
