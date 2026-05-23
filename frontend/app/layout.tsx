import type { Metadata } from "next";
import { JetBrains_Mono, DM_Sans } from "next/font/google";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "DataMirror — See Your Browser's Shadow Profile",
  description:
    "Every website you visit builds a profile of you. DataMirror shows you yours — in real time. See your fingerprint, your ad value, and how AI exploits your browser signals.",
  keywords: ["browser fingerprint", "privacy", "ad tracking", "data profile", "surveillance"],
  openGraph: {
    title: "DataMirror — See Your Browser's Shadow Profile",
    description: "See exactly what data your browser leaks and what it's worth to advertisers.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${jetbrainsMono.variable} ${dmSans.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-[#050508] text-gray-100 antialiased crt-overlay">
        {children}
      </body>
    </html>
  );
}
