import type { Metadata } from "next";
import { Barlow_Condensed, Inter } from "next/font/google";

import { business, siteUrl } from "@/lib/site";

import "./globals.css";

const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${business.name} | ${business.tagline} Sydney - ${business.promise}`,
    template: `%s | ${business.name}`,
  },
  description:
    "Mobile smash repairs across Sydney. Smash repairs, spray painting, buff and polish, dent and scratch removal - we come to your home or workplace. Free photo quotes.",
  keywords: [
    "mobile smash repairs sydney",
    "mobile panel beater sydney",
    "car scratch repair sydney",
    "dent removal sydney",
    "mobile spray painting sydney",
    "car body repair sydney",
  ],
  openGraph: {
    type: "website",
    locale: "en_AU",
    siteName: business.name,
    title: `${business.name} | ${business.tagline} Sydney`,
    description:
      "We come to you anywhere in Sydney. Smash repairs, spray paint, buff and polish, dent and scratch removal. Free photo quotes, fixed prices.",
    url: siteUrl,
    images: [{ url: "/carbodydoclogo.webp" }],
  },
  robots: { index: true, follow: true },
  icons: {
    icon: "/carbodydoclogo.webp",
    apple: "/carbodydoclogo.webp",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${display.variable} ${body.variable}`}>
      <head>
        {/*
          Scroll-reveal starts elements at opacity 0 and JavaScript fades them in.
          With JavaScript off that would hide the page, so undo it here.
        */}
        <noscript>
          <style>{`[data-reveal],.anim-in,.anim-in-fade{opacity:1!important;animation:none!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
