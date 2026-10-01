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

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const closeMenu = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const getNavLinkClass = () => `
    relative text-sm font-medium transition-all duration-200
    ${
      scrolled
        ? "text-[color:var(--ink)]/80 hover:text-[color:var(--primary)]"
        : "text-[color:var(--cream)]/90 hover:text-[color:var(--gold)]"
    }
    after:absolute after:-bottom-1.5 after:left-0 after:h-px after:w-full
    after:origin-left after:scale-x-0
    ${
      scrolled
        ? "after:bg-[color:var(--primary)]"
        : "after:bg-[color:var(--gold)]"
    }
    after:transition-transform after:duration-200
    hover:after:scale-x-100
  `;

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? "border-[color:var(--primary)]/10 bg-[color:var(--cream)]/80 shadow-[0_14px_40px_rgba(8,47,38,0.08)] backdrop-blur-xl"
          : "border-white/10 bg-[linear-gradient(to_right,rgba(18,42,82,0.8),rgba(30,104,87,0.8))] shadow-lg backdrop-blur-md"
      }`}
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            href="/#beranda"
            onClick={closeMenu}
            className="flex items-center gap-3"
          >
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-full bg-[color:var(--primary)] shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <img
                src="/images/logo-putih.png"
                alt="Logo PCA"
                className="h-full w-full object-cover"
              />
            </div>

            <span className="leading-tight">
              <span
                className={`block font-display text-lg transition-colors duration-300 ${
                  scrolled
                    ? "text-[color:var(--primary-dark)]"
                    : "text-[color:var(--cream)]"
                }`}
              >
                Aisyiyah Sugio
              </span>

              <span
                className={`block text-[11px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                  scrolled
                    ? "text-[color:var(--ink)]/60"
                    : "text-[color:var(--gold)]"
                }`}
              >
                Pimpinan Cabang
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex">
            <Link
              href="/#beranda"
              className={getNavLinkClass()}
            >
              Beranda
            </Link>

            {/* Profile Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setProfileOpen(true)}
              onMouseLeave={() => setProfileOpen(false)}
            >
              <button
                type="button"
                onClick={() =>
                  setProfileOpen((prev) => !prev)
                }
                className={`${getNavLinkClass()} flex items-center gap-1.5`}
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
                <div
                  className={`overflow-hidden rounded-[1.4rem] border p-2 shadow-[0_20px_45px_rgba(12,38,30,0.25)] ${
                    scrolled
                      ? "border-black/10 bg-[color:var(--cream)]"
                      : "border-white/15 bg-[color:var(--primary-dark)]/95 backdrop-blur-xl"
                  }`}
                >
                  {profileMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className={`block rounded-xl px-4 py-2.5 text-sm transition-all duration-200 ${
                        scrolled
                          ? "text-[color:var(--ink)]/75 hover:bg-[color:var(--sage)] hover:text-[color:var(--primary)]"
                          : "text-[color:var(--cream)]/80 hover:bg-white/10 hover:text-[color:var(--gold)]"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/#agenda"
              className={getNavLinkClass()}
            >
              Agenda
            </Link>

            <Link
              href="/#produk"
              className={getNavLinkClass()}
            >
              Produk
            </Link>

            <Link
              href="/#kegiatan"
              className={getNavLinkClass()}
            >
              Kegiatan
            </Link>

            <Link
              href="/berita"
              className={getNavLinkClass()}
            >
              Berita
            </Link>

            <Link
              href="/galeri"
              className={getNavLinkClass()}
            >
              Galeri
            </Link>

            <Link
              href="/#kontak"
              className={getNavLinkClass()}
            >
              Kontak
            </Link>

            {/* Login Admin */}
            <Link
              href="/admin/login"
              className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors duration-200 md:translate-x-2 ${
                scrolled
                  ? "border-[color:var(--primary)]/15 bg-white/50 text-[color:var(--primary-dark)] hover:bg-[color:var(--sage)]"
                  : "border-white/20 bg-white/10 text-[color:var(--cream)] hover:bg-white/20"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m10 17 5-5-5-5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H3"
                />
              </svg>

              Login
            </Link>
          </nav>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() =>
              setMenuOpen((prev) => !prev)
            }
            className={`rounded-full border p-2 transition-colors md:hidden ${
              scrolled
                ? "border-[color:var(--primary)]/10 bg-white/30 text-[color:var(--primary-dark)]"
                : "border-white/20 bg-black/20 text-[color:var(--cream)] hover:bg-black/40"
            }`}
            aria-label={
              menuOpen
                ? "Tutup menu"
                : "Buka menu"
            }
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
                  d="M6 18 18 6M6 6l12 12"
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

        {/* Mobile Navigation Drawer */}
        <div
          className={`overflow-hidden transition-all duration-300 md:hidden ${
            menuOpen
              ? "max-h-[800px] pb-4"
              : "max-h-0"
          }`}
        >
          <nav
            className={`flex flex-col gap-1 rounded-2xl p-3 text-sm font-medium ${
              scrolled
                ? "text-[color:var(--ink)]/80"
                : "border border-white/10 bg-black/40 text-[color:var(--cream)]/90 backdrop-blur-xl"
            }`}
          >
            <Link
              href="/#beranda"
              onClick={closeMenu}
              className="rounded-xl border-b border-white/10 px-2 py-3 transition-colors hover:text-[color:var(--gold)]"
            >
              Beranda
            </Link>

            {/* Mobile Profile */}
            <div className="rounded-xl border-b border-white/10 px-2">
              <button
                type="button"
                onClick={() =>
                  setProfileOpen((prev) => !prev)
                }
                className="flex w-full items-center justify-between py-3 text-left transition-colors hover:text-[color:var(--gold)]"
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m6 9 6 6 6-6"
                  />
                </svg>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  profileOpen
                    ? "max-h-96 pb-2"
                    : "max-h-0"
                }`}
              >
                <div className="ml-3 border-l border-[color:var(--gold)]/40 pl-4">
                  {profileMenu.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={closeMenu}
                      className="block py-2.5 text-sm opacity-80 transition-colors hover:text-[color:var(--gold)] hover:opacity-100"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href="/#agenda"
              onClick={closeMenu}
              className="rounded-xl border-b border-white/10 px-2 py-3 transition-colors hover:text-[color:var(--gold)]"
            >
              Agenda
            </Link>

            <Link
              href="/#produk"
              onClick={closeMenu}
              className="rounded-xl border-b border-white/10 px-2 py-3 transition-colors hover:text-[color:var(--gold)]"
            >
              Produk
            </Link>

            <Link
              href="/#kegiatan"
              onClick={closeMenu}
              className="rounded-xl border-b border-white/10 px-2 py-3 transition-colors hover:text-[color:var(--gold)]"
            >
              Kegiatan
            </Link>

            <Link
              href="/berita"
              onClick={closeMenu}
              className="rounded-xl border-b border-white/10 px-2 py-3 transition-colors hover:text-[color:var(--gold)]"
            >
              Berita
            </Link>

            <Link
              href="/galeri"
              onClick={closeMenu}
              className="rounded-xl border-b border-white/10 px-2 py-3 transition-colors hover:text-[color:var(--gold)]"
            >
              Galeri
            </Link>

            <Link
              href="/#kontak"
              onClick={closeMenu}
              className="rounded-xl border-b border-white/10 px-2 py-3 transition-colors hover:text-[color:var(--gold)]"
            >
              Kontak
            </Link>

            {/* Mobile Login Admin */}
            <Link
              href="/admin/login"
              onClick={closeMenu}
              className={`mt-2 flex items-center justify-center gap-2 rounded-xl px-4 py-3 font-semibold transition-all duration-300 ${
                scrolled
                  ? "bg-[color:var(--primary)] text-white hover:bg-[color:var(--primary-dark)]"
                  : "border border-[color:var(--gold)]/40 bg-white/10 text-[color:var(--gold)] hover:bg-white/15"
              }`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m10 17 5-5-5-5"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H3"
                />
              </svg>

              Login
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}