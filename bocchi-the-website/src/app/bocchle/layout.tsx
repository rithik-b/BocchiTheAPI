import { env } from "@rithik/bocchi-the-website/env"

export const metadata = {
  title: "Bocchle",
  description: "Guess the Bocchi the Rock episode!",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  metadataBase: new URL(env.NEXT_PUBLIC_WEBSITE_URL),
  openGraph: {
    type: "website",
    title: "Bocchle - Guess the Bocchi the Rock episode!",
    images: [
      {
        url: "/static/bocchle-thumbnail.webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
