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
      <body className="antialiased">
        <header className="border-b border-neutral-200 bg-white">
          <div className="max-w-4xl mx-auto px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-black text-white text-xs font-bold">
                RW
              </div>
              <span className="font-semibold text-sm tracking-tight">
                RiskWise <span className="text-neutral-500 font-normal">Consulting</span>
              </span>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
