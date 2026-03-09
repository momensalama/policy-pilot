import type { Metadata } from "next";
import { Inter, Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Policy Pilot - AI-Powered Company Policy Generator",
    template: "%s | Policy Pilot",
  },
  description:
    "Collect company information through a guided assessment, then use AI to generate tailored company policies. Built with Next.js, PostgreSQL, and Groq.",
  keywords: [
    "company policy generator",
    "AI policy",
    "assessment wizard",
    "policy management",
    "Groq AI",
  ],
  authors: [{ name: "Momen Salama" }],
  openGraph: {
    title: "Policy Pilot - AI-Powered Company Policy Generator",
    description:
      "Collect company information through a guided assessment, then use AI to generate tailored company policies.",
    url: "https://policy-pilot.vercel.app",
    siteName: "Policy Pilot",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Policy Pilot - AI-Powered Company Policy Generator",
    description:
      "Collect company information through a guided assessment, then use AI to generate tailored company policies.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body className={`${inter.variable} ${geistMono.variable} antialiased`}>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            className:
              "!bg-card !text-card-foreground !border !border-border !shadow-md",
          }}
        />
      </body>
    </html>
  );
}
