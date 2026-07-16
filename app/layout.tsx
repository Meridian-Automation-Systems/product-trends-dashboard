import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Trends",
  description:
    "Live Google Trends research for product keywords, with a built-in AI analyst.",
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
