import { ThemeToggle } from "@components/ThemeToggle"

function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 grid w-full grid-cols-3 border-b border-b-slate-200 bg-white p-4 dark:border-b-slate-900 dark:bg-slate-800">
      <h1 className="col-start-2 scroll-m-20 text-center text-4xl font-extrabold tracking-tight lg:text-5xl">
        Boccher
      </h1>
      <div className="col-start-3 flex items-center justify-end">
        <ThemeToggle />
      </div>
    </header>
  )
}

export default SiteHeader
