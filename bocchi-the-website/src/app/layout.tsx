import "@rithik/bocchi-the-website/styles/globals.css"

import { TRPCReactProvider } from "@rithik/bocchi-the-website/trpc/react"
import { GeistSans } from "geist/font/sans"
import { ThemeProvider } from "next-themes"
import SiteFooter from "./_components/SiteFooter"
import SiteHeader from "./_components/SiteHeader"

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
    <html lang="en" suppressHydrationWarning>
      <body className={GeistSans.className}>
        <TRPCReactProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="min-h-screen bg-pink-100 dark:bg-slate-900">
              <SiteHeader />
              {children}
              <SiteFooter />
            </div>
          </ThemeProvider>
        </TRPCReactProvider>
      </body>
    </html>
  )
}
