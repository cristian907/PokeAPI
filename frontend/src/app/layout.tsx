import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PokeAPI Explorer | Premium",
  description: "Explora la Pokédex de forma dinámica e interactiva con nuestra aplicación premium.",
};

const navLinks = [
  { name: "Pokémon", href: "/" },
  { name: "Moves", href: "/moves" },
  { name: "Map", href: "/map" },
  { name: "Items", href: "/items" },
  { name: "Berries", href: "/berries" },
  { name: "Machines", href: "/machines" },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}>
      <body className="min-h-full flex flex-col bg-slate-900 text-slate-100 selection:bg-rose-500 selection:text-white">
        
        {/* Navbar Premium */}
        <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-slate-900/70 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.1)] transition-all duration-300">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              
              {/* Logo */}
              <div className="flex-shrink-0 flex items-center gap-2 group cursor-pointer">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-500 to-orange-400 flex items-center justify-center shadow-[0_0_15px_rgba(244,63,94,0.5)] group-hover:rotate-180 transition-transform duration-700 ease-in-out">
                  <div className="w-3 h-3 rounded-full bg-white shadow-inner"></div>
                </div>
                <Link href="/">
                  <span className="font-extrabold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-orange-300 hover:from-rose-300 hover:to-orange-200 transition-all">
                    PokeAPI Explorer
                  </span>
                </Link>
              </div>

              {/* Navigation Links (Desktop) */}
              <div className="hidden md:flex space-x-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="px-3 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-all duration-200 ease-in-out"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
        
        {/* Footer */}
        <footer className="w-full border-t border-white/5 py-8 mt-auto backdrop-blur-md bg-slate-900/50 text-center text-slate-500 text-sm">
          <p>Built with Next.js, Express & PokeAPI</p>
        </footer>
      </body>
    </html>
  );
}
