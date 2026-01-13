import "./globals.css"
import { VercelToolbar } from "@vercel/toolbar/next"

import { GeistSans } from "geist/font/sans"

export const metadata = {
  title: "Tech Shop",
  description: "Your one-stop shop for all tech needs",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const shouldInjectToolbar = true //  process.env.NODE_ENV === "development"

  return (
    <html lang="en">
      <body className={GeistSans.className}>
        {shouldInjectToolbar && <VercelToolbar />}
        <div className="toolbar-content-container">{children}</div>
      </body>
    </html>
  )
}
