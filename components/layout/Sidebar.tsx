"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, ReceiptText, LogOut, Menu, X } from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: ReceiptText,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (loggingOut) return;

    setLoggingOut(true);
    setError("");

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "same-origin",
      });

      if (!response.ok) {
        throw new Error("Logout failed.");
      }

      setIsMenuOpen(false);
      router.replace("/login");
      router.refresh();
    } catch {
      setError("Failed to log out. Please try again.");
      setLoggingOut(false);
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden min-h-screen w-60 shrink-0 flex-col border-r border-border bg-white px-5 py-9 md:flex">
        {/* Brand */}
        <Link href="/dashboard" className="mb-16 flex items-center gap-3 px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-white">
            C
          </div>

          <span className="text-2xl font-bold tracking-tight text-text-primary">
            cashie<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${
                  isActive
                    ? "bg-primary-light font-semibold text-primary"
                    : "text-text-secondary hover:bg-background-secondary"
                }`}
              >
                <Icon size={19} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Logout */}
        <div className="mt-auto pt-8">
          {error && (
            <p role="alert" className="mb-3 px-4 text-xs text-red-600">
              {error}
            </p>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LogOut size={19} />
            {loggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="border-b border-border bg-white md:hidden">
        <div className="flex h-20 items-center justify-between px-5">
          {/* Brand */}
          <Link
            href="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-lg font-bold text-white">
              C
            </div>

            <span className="text-xl font-bold tracking-tight text-text-primary">
              cashie<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Menu Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="cashie-mobile-menu"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border text-text-primary transition-colors hover:bg-background-secondary"
          >
            {isMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav
            id="cashie-mobile-menu"
            aria-label="Mobile navigation"
            className="space-y-2 border-t border-border px-5 pb-5 pt-4"
          >
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm transition-colors ${
                    isActive
                      ? "bg-primary-light font-semibold text-primary"
                      : "text-text-secondary hover:bg-background-secondary"
                  }`}
                >
                  <Icon size={19} />
                  {item.name}
                </Link>
              );
            })}

            <div className="border-t border-border pt-3">
              {error && (
                <p role="alert" className="mb-3 px-4 text-xs text-red-600">
                  {error}
                </p>
              )}

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-text-secondary transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LogOut size={19} />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          </nav>
        )}
      </div>
    </>
  );
}
