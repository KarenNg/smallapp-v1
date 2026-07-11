"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import AuthNav from "./AuthNav";

const NAV_ITEMS = [
  { href: "/leads", label: "Leads" },
  { href: "/upgrade", label: "Upgrade" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 shrink-0 border-r border-neutral-200 bg-white flex flex-col justify-between h-screen sticky top-0">
      <div>
        <div className="flex items-center gap-3 px-4 py-4 border-b border-neutral-200">
          <div className="flex items-center justify-center w-9 h-9 rounded-md bg-[#0a2472] text-white text-sm font-bold">
            RW
          </div>
          <span className="font-semibold text-sm tracking-tight text-[#0a2472] leading-tight">
            RiskWise <br />
            <span className="text-neutral-500 font-normal">Consulting</span>
          </span>
        </div>
        <nav className="p-2 space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-neutral-100 text-black"
                    : "text-neutral-500 hover:bg-neutral-50 hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="p-3 border-t border-neutral-200">
        <AuthNav />
      </div>
    </aside>
  );
}
