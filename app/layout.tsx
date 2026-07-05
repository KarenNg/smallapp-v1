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
            <div className="flex items-center gap-3 bg-[#0a2472] rounded-lg px-4 py-2">
              <div className="flex items-center justify-center w-10 h-10 rounded-md bg-white text-[#0a2472] text-sm font-bold">
                RW
              </div>
              <span className="font-semibold text-base tracking-tight text-white">
                RiskWise <span className="text-blue-200 font-normal">Consulting</span>
              </span>
            </div>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
