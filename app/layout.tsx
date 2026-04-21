import type { Metadata } from "next";
import "./globals.css";
import BackgroundMusic from "./BackgroundMusic";

export const metadata: Metadata = {
  title: "IDLOVESTORY",
  description:
    "Wedding invitation for Ibierebo & Damilola — A celebration of love, faith, and friendship.",
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
        <BackgroundMusic />
        {children}
      </body>
    </html>
  );
}
