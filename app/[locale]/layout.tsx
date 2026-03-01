import { Inter, Cormorant_Garamond } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { auth } from "@/auth";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SessionWrapper from "@/components/SessionWrapper";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-cormorant",
  weight: ["300", "400", "500", "600", "700"],
});

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
 const { locale } = await params;
  const messages = await getMessages({ locale });
  const session = await auth();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <SessionWrapper session={session}>
        <Header />

        <main className={`${inter.variable} ${cormorant.variable} min-h-screen antialiased`}>
          {children}
        </main>

        <Footer />
      </SessionWrapper>
    </NextIntlClientProvider>
  );
}
