import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Shared Leash — A gentle space to grieve and remember",
  description: "A compassionate AI companion for those grieving the loss of a beloved pet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="flex-1 flex flex-col">{children}</div>
        <footer className="border-t border-amber-900/10 py-4 text-center text-xs text-amber-900/60">
          {/* <a href="/terms" className="hover:underline">Terms of Service</a> */}
        </footer>
      </body>
    </html>
  );
}
