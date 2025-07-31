import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Project Magang",
  description: "Dashboard PowerBI",
  icons: {
    icon: "/favicon-32x32.png",
    apple: "/apple-touch-icon.png",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider defaultTheme="dark" storageKey="vision-ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
