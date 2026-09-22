"use client";

import { useEffect, useState } from "react";

type ProfileSection = {
  id: number;
  slug: string;
  title: string;
  content: string;
  updated_at?: string;
};

export default function SejarahPage() {
  const [section, setSection] = useState<ProfileSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSection() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/profile-sections?slug=sejarah"
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data sejarah");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.error || "Gagal mengambil data sejarah"
          );
        }

        setSection(data.section || null);
      } catch (error) {
        console.error("Fetch sejarah error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data sejarah"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSection();
  }, []);

  return (
    <main className="bg-[color:var(--cream)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[color:var(--primary-dark)] py-20 md:py-10">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[color:var(--gold)]/10" />

        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <a
            href="/profil"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[color:var(--cream)]/60 transition hover:text-[color:var(--cream)]"
          >
            <span aria-hidden="true">←</span>
            Kembali ke Profil
          </a>

          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold)]">
            Profil Organisasi
          </p>

          <h1 className="max-w-3xl font-display text-4xl leading-tight text-[color:var(--cream)] md:text-6xl">
            Sejarah
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--cream)]/65 md:text-base">
            Perjalanan dan sejarah Pimpinan Cabang Aisyiyah
            Sugio dari waktu ke waktu.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          {loading && (
            <div className="space-y-5">
              <div className="h-8 w-2/3 animate-pulse rounded bg-[color:var(--primary)]/10" />
              <div className="h-5 w-full animate-pulse rounded bg-[color:var(--primary)]/10" />
              <div className="h-5 w-full animate-pulse rounded bg-[color:var(--primary)]/10" />
              <div className="h-5 w-11/12 animate-pulse rounded bg-[color:var(--primary)]/10" />
              <div className="h-5 w-10/12 animate-pulse rounded bg-[color:var(--primary)]/10" />

              <div className="h-5 w-full animate-pulse rounded bg-[color:var(--primary)]/10" />
              <div className="h-5 w-9/12 animate-pulse rounded bg-[color:var(--primary)]/10" />
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm leading-6 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && !section && (
            <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white px-6 py-8 text-center">
              <p className="text-sm text-[color:var(--ink)]/60">
                Informasi sejarah belum tersedia.
              </p>
            </div>
          )}

          {!loading && !error && section && (
            <article>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
                Tentang Perjalanan Kami
              </p>

              <h2 className="mt-3 font-display text-3xl leading-tight text-[color:var(--primary-dark)] md:text-4xl">
                {section.title}
              </h2>

              <div className="mt-8 border-l-2 border-[color:var(--gold)]/40 pl-5 md:pl-7">
                <div className="space-y-6">
                  {section.content
                    .split(/\n\s*\n/)
                    .map((paragraph, index) => (
                      <p
                        key={index}
                        className="text-base leading-8 text-[color:var(--ink)]/70"
                      >
                        {paragraph}
                      </p>
                    ))}
                </div>
              </div>
            </article>
          )}
        </div>
      </section>

      {/* Navigation */}
      <section className="border-t border-[color:var(--primary)]/10 bg-[color:var(--sage)]/50 py-12">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <a
            href="/profil"
            className="text-sm font-medium text-[color:var(--primary)] transition hover:text-[color:var(--gold-dark)]"
          >
            ← Kembali ke Profil
          </a>

          <a
            href="/profil/visi-misi"
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--primary)] transition hover:text-[color:var(--gold-dark)]"
          >
            Lanjut ke Visi & Misi
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}