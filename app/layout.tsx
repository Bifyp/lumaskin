import "./globals.css";
import "../styles/animations.css";

import type { Metadata } from "next";

import { Inter, Cormorant_Garamond } from "next/font/google";

import SessionWrapper from "@/components/SessionWrapper";
import { LanguageProvider } from "@/components/LanguageProvider";

import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LumaSkin",
  description: "Premium skincare studio website",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const messages = await getMessages();

  return (
    <html lang="ru">
      <body className={`${inter.variable} ${cormorant.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <LanguageProvider>
            <SessionWrapper session={null}>
              {children}
            </SessionWrapper>
          </LanguageProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
