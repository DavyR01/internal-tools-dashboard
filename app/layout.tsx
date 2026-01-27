import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
   subsets: ["latin"],
   variable: "--font-inter",
});

export const metadata: Metadata = {
   title: "Internal Tools Dashboard",
   description: "TechCorp Internal Tools Management Dashboard",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="fr" className={inter.variable}>
         <body className="font-sans">
            <Providers>{children}</Providers>
         </body>
      </html>
   );
}
