import { ThemeToggle } from "@components/ThemeToggle"

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 grid w-full grid-cols-3 border-b border-b-slate-200 bg-white p-4 dark:border-b-slate-900 dark:bg-slate-800">
      <h1 className="scroll-m-20 text-5xl font-extrabold tracking-tight sm:col-start-1 sm:text-left md:col-start-2 md:text-center">
        Boccher
      </h1>
      <div className="col-start-3 flex items-center justify-end">
        <ThemeToggle />
      </div>
    </header>
  )
}

export default SiteHeader
