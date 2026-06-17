import type { Metadata } from "next";
import { Poppins, Inter, Noto_Sans_Bengali, Geist } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { LanguageProvider } from "@/context/LanguageContext";
import { Toaster } from "@/components/ui/sonner";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


// ─── Brand Fonts (SRS Section 5.9) ────────────────────────
const poppins = Poppins({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSansBengali = Noto_Sans_Bengali({
  variable: "--font-bengali",
  subsets: ["bengali"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// ─── Site Metadata ─────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: "PBVM Purulia | Paschim Banga Vigyan Mancha",
    template: "%s | PBVM Purulia",
  },
  description:
    "Official website of Paschim Banga Vigyan Mancha (West Bengal Vigyan Mancha), Purulia District Branch — Promoting Scientific Temperament for a Rational and Progressive Society.",
  keywords: [
    "PBVM Purulia",
    "Paschim Banga Vigyan Mancha",
    "West Bengal Vigyan Mancha",
    "science",
    "Purulia",
    "বিজ্ঞান মঞ্চ",
    "পুরুলিয়া",
  ],
  authors: [{ name: "PBVM Purulia District Branch" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "PBVM Purulia",
    title: "PBVM Purulia | Paschim Banga Vigyan Mancha",
    description:
      "Promoting Scientific Temperament for a Rational and Progressive Society.",
  },
  robots: { index: true, follow: true },
};

// ─── Root Layout ───────────────────────────────────────────
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", poppins.variable, inter.variable, notoSansBengali.variable, "font-sans", geist.variable)}
    >
      <body className="min-h-full flex flex-col">
        <LanguageProvider>
          {children}
          <Toaster richColors closeButton position="top-right" />
        </LanguageProvider>
      </body>
    </html>
  );
}

