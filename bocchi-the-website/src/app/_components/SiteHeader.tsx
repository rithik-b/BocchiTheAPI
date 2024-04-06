"use client"

import Link from "next/link"
import { ThemeToggle } from "./ThemeToggle"
import { Gamepad, Menu } from "lucide-react"
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

function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky flex w-full scroll-m-20 items-center justify-between border-b border-b-pink-50 bg-pink-50 p-4 dark:border-b-slate-900 dark:bg-slate-800">
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger className="visible lg:hidden">
          <Menu />
        </SheetTrigger>
        <SheetContent
          className="max-w-screen flex w-full flex-col justify-center gap-14 border-none text-center sm:max-w-fit sm:gap-8 sm:text-left"
          side="left"
        >
          <Link
            className={cn(
              "flex items-center gap-1 text-2xl font-bold tracking-tight",
              linkStyles,
            )}
            href="/bocchle"
            onClick={() => setIsMenuOpen(false)}
          >
            <Gamepad />
            Bocchle
          </Link>
        </SheetContent>
      </Sheet>
      <h1 className="text-5xl font-extrabold tracking-tight">
        <Link className={linkStyles} href="/">
          Boccher
        </Link>
      </h1>
      <div className="flex items-center justify-end gap-5">
        <Link
          className={cn(
            "hidden items-center gap-1 text-2xl font-bold tracking-tight lg:flex",
            linkStyles,
          )}
          href="/bocchle"
        >
          <Gamepad />
          Bocchle
        </Link>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default SiteHeader
