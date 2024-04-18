"use client"

import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { Gamepad, Home, Menu } from "lucide-react"
import { cn } from "@rithik/bocchi-the-website/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@rithik/bocchi-the-website/components/ui/sheet"
import { useState } from "react"

const linkStyles = cn(
  "transition-colors hover:text-pink-400 dark:hover:text-slate-300",
)

const sheetLinkStyles = cn(
  "flex w-full items-center justify-center gap-1 text-center text-5xl font-bold tracking-tight sm:text-3xl",
  linkStyles,
)

const sheetLinkIconStyles = cn("size-14 sm:size-8")

function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky flex w-full scroll-m-20 items-center justify-between border-b border-b-pink-50 bg-pink-50 p-4 dark:border-b-slate-900 dark:bg-slate-800">
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger className="px-3">
          <Menu />
        </SheetTrigger>
        <SheetContent
          className="max-w-screen flex w-full flex-col justify-center gap-14 border-none text-center sm:max-w-fit sm:gap-8 sm:text-left"
          side="left"
        >
          <Link
            className={sheetLinkStyles}
            href="/"
            onClick={() => setIsMenuOpen(false)}
          >
            <Home className={sheetLinkIconStyles} />
            Home
          </Link>
          <Link
            className={sheetLinkStyles}
            href="/bocchle"
            onClick={() => setIsMenuOpen(false)}
          >
            <Gamepad className={sheetLinkIconStyles} />
            Bocchle
          </Link>
        </SheetContent>
      </Sheet>
      <h1 className="text-5xl font-extrabold tracking-tight">
        <Link className={linkStyles} href="/">
          Boccher
        </Link>
      </h1>
      <ThemeToggle />
    </header>
  )
}

export default SiteHeader
