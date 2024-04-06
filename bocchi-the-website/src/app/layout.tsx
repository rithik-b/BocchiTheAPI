import "@rithik/bocchi-the-website/styles/globals.css"

import { TRPCReactProvider } from "@rithik/bocchi-the-website/trpc/react"
import { GeistSans } from "geist/font/sans"
import { ThemeProvider } from "next-themes"
import SiteFooter from "./_components/SiteFooter"
import SiteHeader from "./_components/SiteHeader"
import { cn } from "../lib/utils"
import { Toaster } from "../components/ui/sonner"

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
          "flex h-full flex-col bg-pink-100 dark:bg-slate-900",
          GeistSans.className,
        )}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <TRPCReactProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
            <Toaster />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
