import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Celovia — Be My Valentine",
  description:
    "Create a beautiful, AI-personalized Valentine's invitation and share it with someone special.",
  openGraph: {
    title: "Celovia — Be My Valentine",
    description:
      "Create a beautiful, AI-personalized Valentine's invitation and share it with someone special.",
    type: "website",
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
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>♥️</text></svg>" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;700&family=Dancing+Script:wght@400;700&family=Inter:wght@400;700&family=Lora:wght@400;700&family=Nunito:wght@400;700&family=Oswald:wght@400;700&family=Playfair+Display:wght@400;700&family=Quicksand:wght@400;700&family=Raleway:wght@400;700&family=Space+Grotesk:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
