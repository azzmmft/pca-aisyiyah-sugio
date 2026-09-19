"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-[#082F26] text-white">
      
      {/* Logo */}
      <div className="border-b border-white/10 px-6 py-6">
        <h1 className="font-serif text-xl font-bold">
          PCA Aisyiyah
        </h1>

        <p className="mt-1 text-xs text-white/60">
          Sugio · Admin Panel
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5">
        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          Menu
        </p>

        {menuItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/admin" &&
              pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
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

        <div className="my-5 border-t border-white/10" />

        <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-white/40">
          Pengaturan
        </p>

        <Link
          href="/admin/settings"
          className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
            pathname.startsWith("/admin/settings")
              ? "bg-white/10 text-white"
              : "text-white/65 hover:bg-white/5 hover:text-white"
          }`}
        >
          <span className="w-5 text-center">⚙</span>
          <span>Profil & Kontak</span>
        </Link>
      </nav>

      {/* Footer */}
      <div className="border-t border-white/10 p-4">
        <button
          className="w-full rounded-xl px-3 py-3 text-left text-sm text-white/60 transition hover:bg-white/5 hover:text-white"
        >
          ← Keluar
        </button>
      </div>
    </aside>
  );
}