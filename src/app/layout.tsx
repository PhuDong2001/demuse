import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Newsreader } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const sansFont = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const serifFont = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://demuse-two.vercel.app"
  ),
  title: {
    template: "%s · Demuse",
    default: "Demuse — Personal Timetable & Schedule Planner",
  },
  description: "A calm, human-designed personal timetable and schedule management application.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Demuse",
  },
  icons: {
    icon: [
      { url: "/demuse/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/demuse/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon.ico" },
    ],
    apple: [
      { url: "/demuse/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/demuse/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

import { LanguageProvider } from "@/lib/LanguageContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sansFont.variable} ${serifFont.variable} h-full`}>
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="font-sans antialiased min-h-screen bg-[#faf7f2] text-[#1c1917] flex flex-col selection:bg-[#ded7c8] selection:text-[#1c1917]">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', () => {
                  navigator.serviceWorker.register('/sw.js').catch(err => console.log('SW registration note:', err));
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
