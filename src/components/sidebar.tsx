"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Dashboard" },
  { href: "/ingest", label: "Ingest" },
  { href: "/posts", label: "Posts" },
  { href: "/campaigns", label: "Campaigns" },
  { href: "/audit", label: "Audit" },
];

type SidebarProps = {
  mobileOpen: boolean;
  onCloseMobile: () => void;
};

export function Sidebar({ mobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-slate-950/60 md:hidden"
          onClick={onCloseMobile}
          aria-label="Close navigation"
        />
      ) : null}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-cyan-300/20 bg-slate-950/90 p-4 backdrop-blur transition-transform duration-200 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="glass-panel rounded-xl p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Aegis-LLM</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-50">Threat Intelligence</h2>
          <p className="mt-1 text-sm text-slate-400">AI influence and adversarial narrative watch</p>
        </div>
        <nav className="mt-6 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onCloseMobile}
                className={`block rounded-lg border px-3 py-2.5 text-sm font-medium transition ${
                  isActive
                    ? "border-cyan-300/60 bg-cyan-500/15 text-cyan-100"
                    : "border-transparent text-slate-300 hover:border-cyan-300/30 hover:bg-cyan-500/10"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
