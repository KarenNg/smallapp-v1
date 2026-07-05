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
            <div className="flex items-center gap-3 bg-white border border-neutral-200 rounded-lg px-5 py-2.5">
              <div className="flex items-center justify-center w-12 h-12 rounded-md bg-[#0a2472] text-white text-base font-bold">
                RW
              </div>
              <span className="font-semibold text-lg tracking-tight text-[#0a2472]">
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
