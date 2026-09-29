"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const profileMenu = [
  { label: "Tentang PCA", href: "/profil" },
  { label: "Sejarah", href: "/profil/sejarah" },
  { label: "Visi & Misi", href: "/profil/visi-misi" },
  {
    label: "Struktur Organisasi",
    href: "/profil/struktur-organisasi",
  },
  { label: "Kepengurusan", href: "/profil/kepengurusan" },
  { label: "Ranting", href: "/profil/ranting" },
];

const navLinkClass =
  "relative text-sm font-medium text-[color:var(--ink)]/75 transition-all duration-200 hover:text-[color:var(--primary)] after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-[color:var(--primary)] after:transition-transform after:duration-200 hover:after:scale-x-100";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? "border-[color:var(--primary)]/10 bg-[color:var(--cream)]/80 shadow-[0_14px_40px_rgba(8,47,38,0.08)] backdrop-blur-xl"
          : "border-black/5 bg-[color:var(--cream)]/80 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link href="/#beranda" onClick={closeMenu} className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[color:var(--primary)] font-display text-lg text-[color:var(--cream)] shadow-[0_10px_20px_rgba(11,79,63,0.2)]">
              PCA
            </span>

            <span className="leading-tight">
              <span className="block font-display text-lg text-[color:var(--primary-dark)]">
                Aisyiyah Sugio
              </span>

              <span className="block text-[11px] tracking-[0.18em] text-[color:var(--ink)]/60 uppercase">
                Pimpinan Cabang
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link href="/#beranda" className={`${navLinkClass} relative`}>
              Beranda
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className={`${navLinkClass} relative flex items-center gap-1.5`}
                aria-expanded={profileOpen}
              >
                Profil

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              <div
                className={`absolute left-1/2 top-full z-50 w-60 -translate-x-1/2 pt-3 transition-all duration-250 ${
                  profileOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-2 opacity-0"
                }`}
              >
                <div className="overflow-hidden rounded-[1.4rem] border border-black/10 bg-[color:var(--cream)] p-2 shadow-[0_20px_45px_rgba(12,38,30,0.18)]">
                  {profileMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="block rounded-xl px-4 py-2.5 text-sm text-[color:var(--ink)]/75 transition-all duration-200 hover:bg-[color:var(--sage)] hover:text-[color:var(--primary)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/#agenda" className={`${navLinkClass} relative`}>
              Agenda
            </Link>
            <Link href="/#produk" className={`${navLinkClass} relative`}>
              Produk
            </Link>
            <Link href="/#kegiatan" className={`${navLinkClass} relative`}>
              Kegiatan
            </Link>
            <Link href="/berita" className={`${navLinkClass} relative`}>
              Berita
            </Link>
            <Link href="/galeri" className={`${navLinkClass} relative`}>
              Galeri
            </Link>
            <Link href="/#kontak" className={`${navLinkClass} relative`}>
              Kontak
            </Link>
          </nav>

          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="rounded-full border border-[color:var(--primary)]/10 bg-white/30 p-2 text-[color:var(--primary-dark)] md:hidden"
            aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
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
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>

        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen ? "max-h-[720px] pb-4" : "max-h-0"
          }`}
        >
          <nav className="flex flex-col gap-1 text-sm font-medium text-[color:var(--ink)]/80">
            <Link href="/#beranda" onClick={closeMenu} className="rounded-xl border-b border-black/5 px-2 py-3 transition-colors hover:text-[color:var(--primary)]">
              Beranda
            </Link>

            <div className="rounded-xl border-b border-black/5 px-2">
              <button
                type="button"
                onClick={() => setProfileOpen((prev) => !prev)}
                className="flex w-full items-center justify-between py-3 text-left transition-colors hover:text-[color:var(--primary)]"
                aria-expanded={profileOpen}
              >
                <span>Profil</span>

                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-4 w-4 transition-transform duration-200 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  profileOpen ? "max-h-96 pb-2" : "max-h-0"
                }`}
              >
                <div className="ml-3 border-l border-[color:var(--primary)]/20 pl-4">
                  {profileMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="block py-2.5 text-sm text-[color:var(--ink)]/65 transition-colors hover:text-[color:var(--primary)]"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link href="/#agenda" onClick={closeMenu} className="rounded-xl border-b border-black/5 px-2 py-3 transition-colors hover:text-[color:var(--primary)]">
              Agenda
            </Link>
            <Link href="/#produk" onClick={closeMenu} className="rounded-xl border-b border-black/5 px-2 py-3 transition-colors hover:text-[color:var(--primary)]">
              Produk
            </Link>
            <Link href="/#kegiatan" onClick={closeMenu} className="rounded-xl border-b border-black/5 px-2 py-3 transition-colors hover:text-[color:var(--primary)]">
              Kegiatan
            </Link>
            <Link href="/berita" onClick={closeMenu} className="rounded-xl border-b border-black/5 px-2 py-3 transition-colors hover:text-[color:var(--primary)]">
              Berita
            </Link>
            <Link href="/galeri" onClick={closeMenu} className="rounded-xl border-b border-black/5 px-2 py-3 transition-colors hover:text-[color:var(--primary)]">
              Galeri
            </Link>
            <Link href="/#kontak" onClick={closeMenu} className="rounded-xl px-2 py-3 transition-colors hover:text-[color:var(--primary)]">
              Kontak
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
