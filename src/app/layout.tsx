import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nansen Design Agent",
  description: "AI-powered design system integration for Nansen",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-dark/background/default text-dark/text/primary antialiased">
        {children}
      </body>
    </html>
  );
}
