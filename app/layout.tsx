import type { Metadata } from "next";
import "./globals.css";
import BackgroundMusic from "./BackgroundMusic";
import { WeddingAudioProvider } from "./WeddingAudioContext";

export const metadata: Metadata = {
  title: "#TheOriakhiTakeover2026",
  description:
    "Wedding invitation for Gbadamosi Motunrayo & Thomson ORIAKHI — A celebration of love, faith, and friendship.",
  icons: {
    icon: "/DAV_9054-Edit.jpeg",
    apple: "/DAV_9054-Edit.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400&family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased font-sans">
        <WeddingAudioProvider>
          <BackgroundMusic />
          {children}
        </WeddingAudioProvider>
      </body>
    </html>
  );
}
