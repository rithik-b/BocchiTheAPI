import { ThemeToggle } from "@components/ThemeToggle"
import Link from "next/link"

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 grid w-full grid-cols-3 border-b border-b-slate-200 bg-white p-4 dark:border-b-slate-900 dark:bg-slate-800">
      <h2 className="col-start-1 hidden self-center text-left text-2xl font-extrabold tracking-tight md:flex">
        <Link href="/docs">API Docs</Link>
      </h2>
      <h1 className="col-start-1 scroll-m-20 text-right text-5xl font-extrabold tracking-tight sm:col-start-2 sm:text-center">
        <Link href="/">Boccher</Link>
      </h1>
      <div className="col-start-3 flex items-center justify-end">
        <ThemeToggle />
      </div>
    </header>
  )
}

export default SiteHeader
