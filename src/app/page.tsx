"use client";

import { useState } from "react";

const products = [
  {
    name: "Keripik Pisang Renyah",
    price: "Rp 15.000 / kemasan",
    icon: (
      <svg
        className="h-12 w-12 text-[color:var(--primary)]/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 7l8-4 8 4M4 7v10l8 4m-8-14l8 4m0 10l8-4V7m-8 14V11"
        />
      </svg>
    ),
  },
  {
    name: "Sambal Bawang Khas Sugio",
    price: "Rp 20.000 / botol",
    icon: (
      <svg
        className="h-12 w-12 text-[color:var(--primary)]/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3c-4 3-6 6.5-6 10a6 6 0 0012 0c0-3.5-2-7-6-10z"
        />
      </svg>
    ),
  },
  {
    name: "Kerajinan Anyaman Bambu",
    price: "Mulai Rp 35.000",
    icon: (
      <svg
        className="h-12 w-12 text-[color:var(--primary)]/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 21V9l8-6 8 6v12M9 21v-6h6v6"
        />
      </svg>
    ),
  },
];

const agendas = [
  {
    day: "13",
    date: "Sep 2026",
    title: "Rapat Pimpinan Cabang",
    detail: "09.00 · Kantor Sekretariat PCA Sugio",
  },
  {
    day: "15",
    date: "Sep 2026",
    title: "Lomba Tumpeng Antar Ranting",
    detail: "13.00 · Balai Desa Sugio",
  },
  {
    day: "17",
    date: "Sep 2026",
    title: "Pelatihan UMKM & Pemasaran Digital",
    detail: "08.30 · Aula PCA Sugio",
  },
];

const activities = [
  "Pengajian rutin bulanan Ranting Sugio",
  "Pembagian sembako untuk lansia binaan",
  "Workshop kemasan produk UMKM",
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <main className="antialiased">
      {/* HEADER */}
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

      {/* HERO */}
      <section
        id="beranda"
        className="hero-pattern text-[color:var(--cream)]"
      >
        <div className="mx-auto max-w-6xl px-5 py-24 text-center md:px-8 md:py-32">
          <p className="rise-in mb-4 text-sm tracking-wide text-[color:var(--cream)]/70">
            Sugio, Lamongan · Jawa Timur
          </p>

          <h1 className="rise-in d1 mx-auto max-w-3xl font-display text-4xl font-medium leading-[1.08] sm:text-5xl md:text-6xl">
            Selamat datang di PCA Aisyiyah Sugio
          </h1>

          <p className="rise-in d2 mx-auto mt-6 max-w-xl text-base text-[color:var(--cream)]/80 md:text-lg">
            Pusat informasi kegiatan dakwah, sosial, dan produk binaan usaha
            perempuan di lingkungan Cabang Aisyiyah Sugio.
          </p>

          <a
            href="#produk"
            className="rise-in d3 mt-9 inline-block rounded-full bg-[color:var(--gold)] px-8 py-3.5 text-sm font-semibold text-[color:var(--primary-dark)] transition-colors hover:bg-[color:var(--gold-dark)]"
          >
            Lihat produk binaan
          </a>
        </div>
      </section>

      {/* PROFIL */}
      <section
        id="profil"
        className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20"
      >
        <div className="grid items-start gap-8 md:grid-cols-3 md:gap-10">
          <div>
            <h2 className="font-display text-2xl text-[color:var(--primary-dark)] md:text-3xl">
              Tentang kami
            </h2>
          </div>

          <div className="text-[15px] leading-relaxed text-[color:var(--ink)]/80 md:col-span-2">
            <p>
              Pimpinan Cabang Aisyiyah (PCA) Sugio adalah organisasi otonom
              perempuan Muhammadiyah yang bergerak di bidang dakwah, pendidikan,
              kesehatan, dan pemberdayaan ekonomi keluarga. Melalui program
              binaan UMKM, pengajian rutin, dan kegiatan sosial, PCA Sugio hadir
              mendampingi warga di tingkat kecamatan Sugio.
            </p>
          </div>
        </div>
      </section>

      {/* PRODUK */}
      <section
        id="produk"
        className="bg-[color:var(--sage)]/60 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl text-[color:var(--primary-dark)] md:text-3xl">
              Produk binaan
            </h2>

            <p className="max-w-xs text-sm text-[color:var(--ink)]/60">
              Hasil usaha kelompok binaan ibu-ibu Aisyiyah Sugio
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.name} className="group">
                <div className="placeholder-tile flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl">
                  {product.icon}
                </div>

                <div className="flex items-baseline justify-between pt-4">
                  <h3 className="font-display text-lg text-[color:var(--primary-dark)]">
                    {product.name}
                  </h3>
                </div>

                <p className="mt-1 text-sm text-[color:var(--ink)]/60">
                  {product.price}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AGENDA */}
      <section
        id="agenda"
        className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20"
      >
        <h2 className="mb-10 font-display text-2xl text-[color:var(--primary-dark)] md:text-3xl">
          Agenda terdekat
        </h2>

        <div className="divide-y divide-black/10 border-b border-t border-black/10">
          {agendas.map((agenda) => (
            <div
              key={agenda.title}
              className="flex items-center gap-5 py-5 md:gap-8"
            >
              <div className="w-16 shrink-0 text-center">
                <div className="font-display text-2xl leading-none text-[color:var(--primary)]">
                  {agenda.day}
                </div>

                <div className="mt-1 text-[11px] text-[color:var(--ink)]/50">
                  {agenda.date}
                </div>
              </div>

              <div className="flex-1 border-l border-[color:var(--gold)]/50 pl-5">
                <h3 className="text-[15px] font-medium">{agenda.title}</h3>

                <p className="mt-0.5 text-sm text-[color:var(--ink)]/55">
                  {agenda.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* KEGIATAN / GALERI */}
      <section
        id="kegiatan"
        className="bg-[color:var(--primary-dark)] py-16 md:py-20"
      >
        <div id="galeri" className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="mb-10 font-display text-2xl text-[color:var(--cream)] md:text-3xl">
            Kegiatan terbaru
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {activities.map((activity) => (
              <figure key={activity}>
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[color:var(--primary)] to-[#0f382c]">
                  <svg
                    className="h-10 w-10 text-white/25"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    />
                    <circle
                      cx="12"
                      cy="13"
                      r="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <figcaption className="mt-3 text-sm text-[color:var(--cream)]/70">
                  {activity}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER / KONTAK */}
      <footer id="kontak" className="bg-[color:var(--ink)] text-[color:var(--cream)]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="font-display text-2xl">Hubungi kami</h2>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[color:var(--cream)]/60">
                Jl. Raya Sugio No. 12, Kecamatan Sugio, Kabupaten Lamongan,
                Jawa Timur. Terbuka untuk kerja sama, konsultasi produk, dan
                informasi kegiatan.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <a
                href="#"
                className="flex items-center gap-3 transition-colors hover:text-[color:var(--gold)]"
              >
                <InstagramIcon />
                Instagram — @aisyiyah.sugio
              </a>

              <a
                href="#"
                className="flex items-center gap-3 transition-colors hover:text-[color:var(--gold)]"
              >
                <TiktokIcon />
                TikTok — @aisyiyahsugio
              </a>

              <a
                href="#"
                className="flex items-center gap-3 transition-colors hover:text-[color:var(--gold)]"
              >
                <WhatsappIcon />
                WhatsApp — 0812-3456-7890
              </a>

              <a
                href="#"
                className="flex items-center gap-3 transition-colors hover:text-[color:var(--gold)]"
              >
                <EmailIcon />
                Email — pca.sugio@aisyiyah.or.id
              </a>
            </div>
          </div>

          <div className="mt-10 border-t border-white/10 pt-6 text-xs text-[color:var(--cream)]/40">
            © 2026 PCA Aisyiyah Sugio. Semua hak cipta dilindungi.
          </div>
        </div>
      </footer>
    </main>
  );
}

function InstagramIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.2"
        cy="6.8"
        r="0.6"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 4v9.5a3.5 3.5 0 11-3.5-3.5c.3 0 .6.03.85.08M14 4c.3 2 1.8 3.5 4 3.7"
      />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 12a8 8 0 10-14.9 4L4 20l4.2-1.1A8 8 0 0020 12z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7l9 6 9-6"
      />
    </svg>
  );
}