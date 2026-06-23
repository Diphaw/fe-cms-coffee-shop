"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Coffee } from "lucide-react";
import { auth } from "@/lib/auth";
import { NAV_ITEMS } from "../constants";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    auth.clearToken();
    router.push("/login");
  };

  return (
    <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0 min-h-screen">
      {/* Brand Header */}
      <div className="p-6 border-b border-border flex flex-col gap-1">
        <span className="text-lg font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Coffee className="w-5 h-5 text-[#c8a96e]" /> Coffee Shop CMS
        </span>
        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Sistem Admin
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
            >
              <Icon
                className={`w-4 h-4 transition-transform duration-200 ${active ? "scale-110" : ""}`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Action */}
      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors duration-200 cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          Keluar
        </button>
      </div>
    </aside>
  );
}
