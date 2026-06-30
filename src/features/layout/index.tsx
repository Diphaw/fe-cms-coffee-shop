"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { Sidebar } from "./components/Sidebar";
import { PageLoader } from "@/components/ui/spinner";

export default function CMSLayoutContent({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!Cookies.get("cms_token")) {
      router.push("/login");
    } else {
      setAuthenticated(true);
    }
  }, [router]);

  if (!mounted || !authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <PageLoader label="Memverifikasi Autentikasi..." />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="w-full space-y-8">{children}</div>
      </main>
    </div>
  );
}
