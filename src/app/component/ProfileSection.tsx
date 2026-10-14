"use client";

import React from "react";

// Data pilar utama untuk kemudahan pemeliharaan
const PILLARS = [
  {
    tag: "Dakwah & Edukasi",
    title: "Religiusitas",
    desc: "Pengajian rutin & pencerahan ilmu keislaman.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    tag: "Sosial & Kesehatan",
    title: "Kesejahteraan",
    desc: "Pendampingan kesehatan & aksi kepedulian.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    tag: "Kemandirian Ekonomi",
    title: "Pemberdayaan",
    desc: "Binaan UMKM & usaha mandiri perempuan.",
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "30", label: "Ranting Aisyiyah" },
  { value: "200+", label: "Anggota Aktif" },
  { value: "20+", label: "UMKM Binaan" },
];

export default function ProfileSection() {
  return (
    <section id="profil" className="relative overflow-hidden py-24 md:py-24">
      {/* Dynamic Ambient Background Elements (Glow & Blur Effect) */}
      <div 
        aria-hidden 
        className="pointer-events-none absolute left-1/2 top-1/4 -z-10 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[color:var(--gold)]/10 blur-[120px]" 
      />
      <div 
        aria-hidden 
        className="pointer-events-none absolute -right-20 top-1/2 -z-10 h-[350px] w-[350px] rounded-full bg-[color:var(--primary)]/10 blur-[100px]" 
      />

      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Kolom Kiri: Header & Mini Statistics */}
          <div className="space-y-8 lg:col-span-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)]/15 bg-white/40 px-3.5 py-1.5 text-xs font-semibold tracking-wider text-[color:var(--primary-dark)] backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--gold)] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--gold-dark)]"></span>
              </span>
              TENTANG PCA AISYIYAH SUGIO
            </div>

            <h2 className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-[color:var(--primary-dark)] sm:text-5xl">
              Mewujudkan gerakan perempuan yang{" "}
              <span className="relative inline-block text-[color:var(--gold-dark)] italic">
                aktif, sehat,
              </span>{" "}
              dan berdampak.
            </h2>

            <p className="text-base leading-relaxed text-[color:var(--ink)]/75 md:text-lg">
              Pimpinan Cabang Aisyiyah (PCA) Sugio bergerak secara dinamis di bidang dakwah, pendidikan, kesehatan, dan pemberdayaan ekonomi keluarga untuk mendampingi serta menguatkan peran perempuan.
            </p>

            {/* Micro Stats Grid */}
            <div className="grid grid-cols-3 gap-4 border-t border-[color:var(--primary)]/10 pt-6">
              {STATS.map((stat, index) => (
                <div key={index}>
                  <div className="font-display text-2xl font-bold text-[color:var(--primary-dark)] sm:text-3xl">
                    {stat.value}
                  </div>
                  <div className="mt-1 text-xs font-medium text-[color:var(--ink)]/60">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Kolom Kanan: Bento Layout & Pillar Cards */}
          <div className="space-y-6 lg:col-span-7">
            
            {/* Visi / Quote Card (Glow Glassmorphism Effect) */}
            <div className="group relative overflow-hidden rounded-3xl border border-white/60 bg-gradient-to-br from-white/80 via-white/40 to-white/20 p-8 shadow-[0_20px_50px_rgba(11,79,63,0.06)] backdrop-blur-xl transition duration-500 hover:border-[color:var(--gold)]/40 hover:shadow-[0_25px_60px_rgba(198,138,46,0.12)]">
              {/* Subtle top reflection line */}
              <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent" />
              
              <div className="relative z-10 space-y-4">
                <svg className="h-8 w-8 text-[color:var(--gold-dark)]/60" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>

                <p className="font-display text-xl leading-relaxed text-[color:var(--primary-dark)] md:text-2xl">
                  “Setiap program kami dirancang untuk memperkuat peran perempuan dalam membangun keluarga dan masyarakat yang lebih mandiri.”
                </p>

                <div className="flex items-center gap-3 pt-2">
                  <div className="h-0.5 w-8 bg-[color:var(--gold)]" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-[color:var(--gold-dark)]">
                    Pimpinan Cabang Aisyiyah Sugio
                  </span>
                </div>
              </div>
            </div>

            {/* 3 Pillars Grid */}
            <div className="grid gap-4 sm:grid-cols-3">
              {PILLARS.map((pillar, idx) => (
                <div
                  key={idx}
                  className="group relative flex flex-col justify-between rounded-2xl border border-[color:var(--primary)]/10 bg-white/50 p-5 backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--primary)]/30 hover:bg-white/90 hover:shadow-[0_16px_35px_rgba(11,79,63,0.08)]"
                >
                  <div>
                    <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[color:var(--primary)]/10 text-[color:var(--primary-dark)] transition-colors duration-300 group-hover:bg-[color:var(--gold)] group-hover:text-[color:var(--primary-dark)]">
                      {pillar.icon}
                    </div>
                    <span className="block text-[10px] font-bold uppercase tracking-widest text-[color:var(--gold-dark)]">
                      {pillar.tag}
                    </span>
                    <h3 className="mt-1 font-display text-lg font-medium text-[color:var(--primary-dark)]">
                      {pillar.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-[color:var(--ink)]/70">
                      {pillar.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
            <div className="mt-8 text-center">
              <a
                href="/profil"
                className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--primary)] transition hover:text-[color:var(--gold-dark)]"
              >
                Lihat profil
                <span aria-hidden="true">→</span>
              </a>
            </div>
      </div>
    </section>
  );
}