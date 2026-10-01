"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menuItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "⌂",
  },
  {
    label: "Produk",
    href: "/admin/products",
    icon: "▣",
  },
  {
    label: "Agenda",
    href: "/admin/agendas",
    icon: "◷",
  },
  {
    label: "Berita",
    href: "/admin/articles",
    icon: "▤",
  },
  {
    label: "Kegiatan",
    href: "/admin/activities",
    icon: "♧",
  },
  {
    label: "Galeri",
    href: "/admin/gallery",
    icon: "▧",
  },
];

const profileItems = [
  {
    label: "Sejarah",
    href: "/admin/profile/sejarah",
  },
  {
    label: "Visi & Misi",
    href: "/admin/profile/visi-misi",
  },
  {
    label: "Struktur Organisasi",
    href: "/admin/profile/struktur-organisasi",
  },
  {
    label: "Kepengurusan",
    href: "/admin/profile/kepengurusan",
  },
  {
    label: "Ranting",
    href: "/admin/profile/ranting",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isProfileActive = pathname.startsWith("/admin/profile");

  const [isProfileOpen, setIsProfileOpen] =
    useState(isProfileActive);

  /*
   * Kalau user berpindah langsung ke salah satu
   * halaman profile, accordion otomatis terbuka.
   */
  useEffect(() => {
    if (isProfileActive) {
      setIsProfileOpen(true);
    }
  }, [isProfileActive]);

  /*
   * Tutup sidebar mobile ketika berpindah halaman.
   */
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  /*
   * Mencegah body bisa discroll ketika sidebar mobile terbuka.
   */
  useEffect(() => {
    if (!isMobileOpen) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  function closeMobileSidebar() {
    setIsMobileOpen(false);
  }

  return (
    <>
      {/* =========================================
          MOBILE HEADER
      ========================================= */}
      <div className="fixed left-0 right-0 top-0 z-30 flex h-16 items-center justify-between border-b border-black/5 bg-[#F5F0E4] px-4 shadow-sm md:hidden">
        <div>
          <p className="font-serif text-lg font-bold text-[#082F26]">
            PCA Aisyiyah
          </p>

          <p className="text-[10px] text-[#1C2620]/50">
            Sugio · Admin Panel
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen(true)}
          aria-label="Buka menu"
          aria-expanded={isMobileOpen}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#082F26] text-white transition hover:bg-[#0B4F3F]"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-5 w-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Tutup menu"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-[2px] md:hidden"
        />
      )}

      {/* =========================================
          SIDEBAR
      ========================================= */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-[#082F26] text-white shadow-2xl transition-transform duration-300 ease-out md:z-40 md:w-64 md:translate-x-0 md:shadow-none ${
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* =========================================
            LOGO
        ========================================= */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-6">
          <div>
            <h1 className="font-serif text-xl font-bold">
              PCA Aisyiyah
            </h1>

            <p className="mt-1 text-xs text-white/60">
              Sugio · Admin Panel
            </p>
          </div>

          {/* Close button mobile */}
          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Tutup menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 6l12 12M18 6L6 18"
              />
            </svg>
          </button>
        </div>

        {/* =========================================
            NAVIGATION
        ========================================= */}
        <nav className="flex-1 overflow-y-auto px-3 py-5">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
            Menu
          </p>

          {/* Main menu */}
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" &&
                  pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileSidebar}
                  className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/65 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span className="w-5 text-center text-base">
                    {item.icon}
                  </span>

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* =========================================
              PROFILE
          ========================================= */}
          <div className="my-5 border-t border-white/10" />

          <button
            type="button"
            onClick={() =>
              setIsProfileOpen((current) => !current)
            }
            className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-sm transition ${
              isProfileActive
                ? "bg-white/10 text-white"
                : "text-white/65 hover:bg-white/5 hover:text-white"
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="w-5 text-center text-base">
                ◉
              </span>

              <span>Profil</span>
            </span>

            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`h-4 w-4 transition-transform duration-200 ${
                isProfileOpen
                  ? "rotate-180"
                  : ""
              }`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m6 9 6 6 6-6"
              />
            </svg>
          </button>

          {/* Profile submenu */}
          <div
            className={`grid transition-all duration-200 ${
              isProfileOpen
                ? "grid-rows-[1fr] opacity-100"
                : "grid-rows-[0fr] opacity-0"
            }`}
          >
            <div className="min-h-0 overflow-hidden">
              <div className="ml-3 mt-1 space-y-1 border-l border-white/10 pl-3">
                {profileItems.map((item) => {
                  const isActive =
                    pathname === item.href;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMobileSidebar}
                      className={`block rounded-lg px-3 py-2.5 text-sm transition ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/55 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </nav>

        {/* =========================================
            FOOTER
        ========================================= */}
        <div className="border-t border-white/10 p-4">
          <Link
            href="/"
            onClick={closeMobileSidebar}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
          >
            <span className="text-base">←</span>
            <span>Kembali ke Website</span>
          </Link>
        </div>
      </aside>
    </>
  );
}