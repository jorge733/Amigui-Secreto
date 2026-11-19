import type { Metadata, Viewport } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { GiftIcon } from "@/components/icons";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amigui Secreto",
  description: "Organiza tu amigo secreto en minutos: sorteo justo, enlaces privados y listas de deseos.",
  robots: { index: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fbf7f2" },
    { media: "(prefers-color-scheme: dark)", color: "#110d0c" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} ${fraunces.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col font-sans">
        <header className="mx-auto w-full max-w-2xl px-4 pt-6 sm:px-6">
          <Link
            href="/"
            className="group inline-flex items-center gap-2.5 rounded-lg font-display text-lg font-semibold tracking-tight"
          >
            <span className="inline-flex size-8 items-center justify-center rounded-lg bg-accent text-accent-contrast shadow-sm shadow-accent/30 transition group-hover:-rotate-6">
              <GiftIcon size={17} />
            </span>
            Amigui Secreto
          </Link>
        </header>
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-12">{children}</main>
        <footer className="mx-auto w-full max-w-2xl px-4 pb-8 sm:px-6">
          <div className="flex items-center justify-between gap-4 border-t border-border pt-6 text-xs text-muted">
            <span>Hecho con cariño para regalar sorpresas.</span>
            <span aria-hidden>🎁</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
