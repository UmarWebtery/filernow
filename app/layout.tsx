import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/utils/cn";
import FilerSplashLoader from "@/components/ui-custom/FilerSplashLoader";
import { CalculatorContextProvider } from "@/context/CalculatorContext";
import { FilerStatusContextProvider } from "@/context/FilerStatusContext";
import { AuthDrawerProvider } from "@/context/AuthDrawerContext";
import { SiteIdentityProvider } from "@/context/SiteIdentityContext";
import { getSiteIdentity } from "@/lib/api/site-identity";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteIdentity();

  return {
    title: "Income Tax Return, NTN Registration & Tax Filing | Filernow.com",
    description: "Get your income tax return filed within just 1 day — fast, secure, and fully online. FilerNow helps salaried individuals, freelancers, and businesses stay compliant with tax laws.",
    icons: {
      icon: site.faviconUrl,
      shortcut: site.faviconUrl,
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const site = await getSiteIdentity();

  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", plusJakarta.variable, inter.variable, "font-sans")}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                  const stored = localStorage.getItem('theme');
                  if (stored === 'dark') {
                      document.documentElement.classList.add('dark');
                  }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col text-text-dark bg-page-bg default-transition"
        suppressHydrationWarning
      >
        <SiteIdentityProvider site={site}>
          <FilerStatusContextProvider>
            <CalculatorContextProvider>
              <AuthDrawerProvider>
                <FilerSplashLoader />
                {children}
              </AuthDrawerProvider>
            </CalculatorContextProvider>
          </FilerStatusContextProvider>
        </SiteIdentityProvider>
      </body>
    </html>
  );
}