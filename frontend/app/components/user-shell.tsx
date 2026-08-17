import Link from "next/link";
import type { ReactNode } from "react";

type UserShellProps = {
  title: string;
  description: string;
  activePage: string;
  children: ReactNode;
};

const navItems = [
  { name: "Dashboard", href: "/dashboard" },
  { name: "Profile", href: "/profile" },
  { name: "Travel Preferences", href: "/preferences" },
  { name: "Favourite Destinations", href: "/favorites" },
  { name: "Travel History", href: "/history" },
  { name: "Account Settings", href: "/settings" },
];

export function UserShell({ title, description, activePage, children }: UserShellProps) {
  return (
    <div className="min-h-screen bg-[#f4f1eb] text-[#24313f]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <header className="mb-6 rounded-[24px] border border-[#e8dfd2] bg-[#fffdfb] px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#5d7a78]">TripNest</p>
              <h1 className="mt-1 text-2xl font-semibold text-[#23313f]">{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-[#edf5f4] px-3 py-1 text-sm font-medium text-[#496369]">
                Traveler Profile
              </div>
              <Link
                href="/"
                className="rounded-full border border-[#e7e1d7] bg-[#f8f5f0] px-4 py-2 text-sm font-medium text-[#425563] transition hover:border-[#d9e4e1] hover:text-[#2d4c53]"
              >
                Sign out
              </Link>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-[24px] border border-[#e8dfd2] bg-[#fffdfb] p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-3 rounded-2xl bg-[#edf5f4] p-3 text-[#23313f]">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#bfe3d8] text-lg font-bold text-[#213332]">
                A
              </div>
              <div>
                <p className="text-sm text-[#5c6c73]">Welcome back</p>
                <p className="font-semibold">Ariana Smith</p>
              </div>
            </div>

            <nav className="space-y-2">
              {navItems.map((item) => {
                const isActive = item.name === activePage;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={[
                      "flex items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                      isActive
                        ? "bg-[#edf5f4] text-[#2d4c53] ring-1 ring-[#dbeae7]"
                        : "text-[#526673] hover:bg-[#f6f3ee] hover:text-[#24313f]",
                    ].join(" ")}
                  >
                    <span>{item.name}</span>
                    <span className="text-xs">→</span>
                  </Link>
                );
              })}
            </nav>
          </aside>

          <main className="rounded-[24px] border border-[#e8dfd2] bg-[#fffdfb] p-6 shadow-sm">
            <div className="mb-6">
              <p className="text-sm font-medium uppercase tracking-[0.18em] text-[#72818c]">Overview</p>
              <h2 className="mt-2 text-2xl font-semibold text-[#23313f]">{description}</h2>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
