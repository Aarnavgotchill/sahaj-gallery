import type { Metadata } from "next";
import { Cormorant_Garamond, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SiteNav from "@/components/SiteNav";
import Footer from "@/components/Footer";
import { getArtist } from "@/lib/data";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
  display: "swap",
});

const label = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-label",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SAHAJ GALLERY — ART IN ARCHITECTURE",
  description:
    "SAHAJ GALLERY explores the intersection of art and architecture through curated exhibitions, publications, and interdisciplinary projects.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const artist = getArtist();

  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${label.variable}`}>
      <body>
        <SiteNav artistName={artist.name} />
        {children}
        <Footer artistName={artist.name} />
      </body>
    </html>
  );
}
