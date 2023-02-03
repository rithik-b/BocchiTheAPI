import Link from "next/link"

function SiteFooter() {
  return (
    <footer className="flex w-full justify-center py-8 md:hidden">
      <Link href="/docs" className="text-center text-gray-400">
        API Docs
      </Link>
    </footer>
  )
}

export default SiteFooter
