import type { Metadata } from "next";
import { Inter, Syne, Bebas_Neue, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: ["400"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: 'Omnibox | Next-Gen Cloud Storage',
  description: 'Immersive cloud storage portal with high-end design.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // h-full antialiased dibiarkan karena aman
      className={`${inter.variable} ${syne.variable} ${bebasNeue.variable} ${playfair.variable} h-full antialiased`}
    >
      {/* FIX PENTING: overflow-x-hidden DIHAPUS dari <body>.
        Ini yang bikin GSAP Pinning lu jebol/mati dari tadi!
      */}
      <body className="min-h-full flex flex-col bg-omni-black text-omni-silver font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}