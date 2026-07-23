import "./globals.css";

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://commitment-issues-alpha.vercel.app";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Commitment Issues — a personality readout for your git habits",
  description:
    "Paste a git log or connect GitHub to see when you actually code, your longest streak, your messiest day, and the archetype that best explains your commit history.",
  openGraph: {
    title: "Commitment Issues",
    description:
      "Your git commit history has been quietly building a personality profile of you. Let's read it back to you.",
    url: SITE_URL,
    siteName: "Commitment Issues",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Commitment Issues",
    description:
      "Your git commit history has been quietly building a personality profile of you. Let's read it back to you.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}