import type { Metadata } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, Newsreader } from "next/font/google";
import "./globals.css";

const fontSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const fontDisplay = Newsreader({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const fontMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "DataPulse — Salud de datos",
  description:
    "Demo comercial de monitoreo de salud de datos: score, alertas e informe ejecutivo para PyMEs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full flex flex-col">{children}</body>
    </html>
  );
}
