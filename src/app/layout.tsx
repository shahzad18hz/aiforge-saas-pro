import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/layout/Providers";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: { default: "AIForge — AI Content Generator", template: "%s | AIForge" },
  description: "Generate high-quality blog posts, product descriptions, social media posts, emails, and SEO meta tags with AI.",
  keywords: ["AI content generator", "blog generator", "SEO tools", "content writing", "AI writing"],
  authors: [{ name: "AIForge" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "AIForge",
    title: "AIForge — AI Content Generator",
    description: "Generate high-quality content with AI in seconds.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "AIForge" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIForge — AI Content Generator",
    description: "Generate high-quality content with AI in seconds.",
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.variable}>
        <Providers>
          {children}
          <Toaster richColors position="top-right" />
        </Providers>
      </body>
    </html>
  );
}
