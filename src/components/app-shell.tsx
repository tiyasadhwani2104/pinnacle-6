"use client";

import { useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { Topbar } from "@/components/topbar";

const pageTitles: Record<string, string> = {
  "/": "Dashboard",
  "/ingest": "Ingest",
  "/posts": "Posts",
  "/campaigns": "Campaigns",
  "/audit": "Audit",
};

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const title = useMemo(() => pageTitles[pathname] ?? "Aegis-LLM", [pathname]);

  return (
    <div className="min-h-screen bg-transparent">
      <Sidebar mobileOpen={mobileOpen} onCloseMobile={() => setMobileOpen(false)} />
      <div className="md:pl-72">
        <Topbar title={title} onOpenSidebar={() => setMobileOpen(true)} />
        <main className="mx-auto max-w-7xl p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
