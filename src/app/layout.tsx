import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Amigui Secreto",
  description: "Organiza tu amigo secreto en minutos: sorteo justo, enlaces privados y listas de deseos.",
  robots: { index: false },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <header className="mx-auto w-full max-w-2xl px-4 pt-6 sm:px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold tracking-tight">
            <span className="inline-block size-2.5 rounded-full bg-accent" aria-hidden />
            Amigui Secreto
          </Link>
        </header>
        <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8 sm:px-6 sm:py-12">{children}</main>
        <footer className="mx-auto w-full max-w-2xl px-4 pb-8 text-xs text-muted sm:px-6">
          Hecho con cariño para regalar sorpresas.
        </footer>
      </body>
    </html>
  );
}
