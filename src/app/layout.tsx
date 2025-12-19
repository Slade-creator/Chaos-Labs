// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Toaster } from "react-hot-toast"; // Optional: for toast notifications

// 🔤 Font configuration (optimized)
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap", // Prevents FOIT
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

// 📡 Metadata (SEO + Social)
export const metadata: Metadata = {
  title: {
    template: "%s | Chaos Evaluation Dashboard",
    default: "Chaos Evaluation Dashboard",
  },
  description:
    "A satirical yet insightful tool to evaluate risk vs consequence using the FAFO (Fuck Around and Find Out) and Crazy/Hot matrices. AI-powered chaos analysis.",
  keywords: [
    "FAFO",
    "chaos engineering",
    "risk assessment",
    "system design",
    "AI humor",
    "dashboard",
  ],
  authors: [{ name: "Elton Chiwala", url: "https://github.com/eltonchiwala" }],
  creator: "Elton Chiwala",
  publisher: "Chaos Labs",
  metadataBase: new URL("https://chaos-dashboard.vercel.app"), // ✅ Update before deploy!
  alternates: {
    canonical: "/",
  },

  openGraph: {
    title: "Chaos Evaluation Dashboard",
    description:
      "How much chaos are you inviting? Describe your action — AI tells you the zone.",
    url: "https://chaos-dashboard.vercel.app",
    siteName: "Chaos Dashboard",
    images: [
      {
        url: "/fafo.png", 
        width: 1200,
        height: 630,
        alt: "Chaos Evaluation Dashboard — FAFO & Crazy/Hot Matrices",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 🔍 Preconnect to critical third-parties */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ⚡ Preload fonts */}
        <link
          rel="preload"
          href="/fonts/Geist.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* 🎨 Theme color for mobile browsers */}
        <meta name="theme-color" media="(prefers-color-scheme: light)" content="#ffffff" />
        <meta name="theme-color" media="(prefers-color-scheme: dark)" content="#0a0a0a" />

        {/* 📱 Mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased 
          bg-background text-foreground 
          selection:bg-orange-500/20`}
      >
        {/* 🌗 ThemeProvider — critical for dark mode */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}

          {/* 🍞 Optional: Toast notifications for copy/share */}
          <Toaster 
            position="top-center"
            toastOptions={{
              className: "bg-gray-900 border border-gray-700 text-gray-100",
              duration: 2000,
            }} 
          />
        </ThemeProvider>
      </body>
    </html>
  );
}