"use client";

import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-[color:var(--cream)]/95 backdrop-blur">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex h-20 items-center justify-between">
          <a
            href="#beranda"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--primary)] font-display text-lg text-[color:var(--cream)]">
              PCA
            </span>

            <span className="leading-tight">
              <span className="block font-display text-lg text-[color:var(--primary-dark)]">
                Aisyiyah Sugio
              </span>

              <span className="block text-[11px] tracking-wide text-[color:var(--ink)]/60">
                Pimpinan Cabang Aisyiyah
              </span>
            </span>
          </a>

          {/* DESKTOP NAVIGATION */}
          <nav className="hidden items-center gap-8 text-sm font-medium text-[color:var(--ink)]/80 md:flex">
            <a
              href="#beranda"
              className="transition-colors hover:text-[color:var(--primary)]"
            >
              Beranda
            </a>

            <a
              href="#profil"
              className="transition-colors hover:text-[color:var(--primary)]"
            >
              Profil
            </a>

            <a
              href="#agenda"
              className="transition-colors hover:text-[color:var(--primary)]"
            >
              Agenda
            </a>

            <a
              href="#produk"
              className="transition-colors hover:text-[color:var(--primary)]"
            >
              Produk
            </a>

            <a
              href="#kegiatan"
              className="transition-colors hover:text-[color:var(--primary)]"
            >
              Kegiatan
            </a>

            <a
              href="#galeri"
              className="transition-colors hover:text-[color:var(--primary)]"
            >
              Galeri
            </a>

            <a
              href="#kontak"
              className="transition-colors hover:text-[color:var(--primary)]"
            >
              Kontak
            </a>
          </nav>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 text-[color:var(--primary-dark)] md:hidden"
            aria-label="Buka menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 7h16M4 12h16M4 17h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* MOBILE NAVIGATION */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-96" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-1 pb-5 text-sm font-medium text-[color:var(--ink)]/80">
            {[
              ["Beranda", "#beranda"],
              ["Profil", "#profil"],
              ["Agenda", "#agenda"],
              ["Produk", "#produk"],
              ["Kegiatan", "#kegiatan"],
              ["Galeri", "#galeri"],
              ["Kontak", "#kontak"],
            ].map(([label, href]) => (
              <a
                key={label}
                href={href}
                onClick={closeMenu}
                className="border-b border-black/5 py-2"
              >
                {label}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
