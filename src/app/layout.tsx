import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: " Chhatrapati Shivaji Maharaj",
  description: "Music player honoring the legacy of Chhatrapati Shivaji Maharaj with Base blockchain integration",
  other: {
    'base:app_id': '695ab859c63ad876c90820ce',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

