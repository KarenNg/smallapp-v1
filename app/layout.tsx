import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RiskWise Consulting",
  description: "Lead capture and touchpoint tracking",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
