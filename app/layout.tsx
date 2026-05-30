import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Trends Dashboard",
  description: "Research product keywords and trends with Google Trends data.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
