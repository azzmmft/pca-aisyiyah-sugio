"use client";

import { useEffect, useState } from "react";

type ProfileSection = {
  id: number;
  slug: string;
  title: string;
  content: string;
  updated_at?: string;
};

export default function VisiMisiPage() {
  const [section, setSection] = useState<ProfileSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchSection() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/profile-sections?slug=visi-misi"
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data visi dan misi");
        }

        const data = (await response.json()) as Record<string, any>;

        if (!data.success) {
          throw new Error(
            data.error || "Gagal mengambil data visi dan misi"
          );
        }

        setSection(data.section || null);
      } catch (error) {
        console.error("Fetch visi-misi error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data visi dan misi"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSection();
  }, []);

  const paragraphs =
    section?.content
      ?.split(/\n\s*\n/)
      .map((item) => item.trim())
      .filter(Boolean) || [];

  return (
    <main className="bg-[color:var(--cream)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[color:var(--primary-dark)] py-20 md:py-10">
        <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[color:var(--gold)]/10" />

        <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-[color:var(--sage)]/10" />

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
            Visi & Misi
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--cream)]/65 md:text-base">
            Arah dan tujuan yang menjadi landasan gerak Pimpinan
            Cabang Aisyiyah Sugio.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-5 md:px-8">
          {loading && (
            <div className="grid gap-6 md:grid-cols-2">
              <div className="h-64 animate-pulse rounded-2xl bg-[color:var(--primary)]/10" />
              <div className="h-64 animate-pulse rounded-2xl bg-[color:var(--primary)]/10" />
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
                Informasi visi dan misi belum tersedia.
              </p>
            </div>
          )}

          {!loading && !error && section && (
            <>
              <div className="mb-12 text-center">
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
                  Landasan Organisasi
                </p>

                <h2 className="mt-3 font-display text-3xl text-[color:var(--primary-dark)] md:text-4xl">
                  {section.title}
                </h2>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Visi */}
                <article className="relative overflow-hidden rounded-2xl bg-[color:var(--primary-dark)] p-7 md:p-9">
                  <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-[color:var(--gold)]/10" />

                  <div className="relative">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold)]">
                      01
                    </p>

                    <h3 className="mt-3 font-display text-2xl text-[color:var(--cream)] md:text-3xl">
                      Visi
                    </h3>

                    {paragraphs[0] ? (
                      <p className="mt-6 text-sm leading-7 text-[color:var(--cream)]/70 md:text-base">
                        {paragraphs[0]}
                      </p>
                    ) : (
                      <p className="mt-6 text-sm text-[color:var(--cream)]/50">
                        Visi belum tersedia.
                      </p>
                    )}
                  </div>
                </article>

                {/* Misi */}
                <article className="rounded-2xl border border-[color:var(--primary)]/10 bg-white p-7 shadow-sm md:p-9">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
                    02
                  </p>

                  <h3 className="mt-3 font-display text-2xl text-[color:var(--primary-dark)] md:text-3xl">
                    Misi
                  </h3>

                  <div className="mt-6 space-y-4">
                    {paragraphs.length > 1 ? (
                      paragraphs.slice(1).map((paragraph, index) => (
                        <div
                          key={index}
                          className="flex gap-4"
                        >
                          <span className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[color:var(--sage)] text-xs font-medium text-[color:var(--primary)]">
                            {index + 1}
                          </span>

                          <p className="text-sm leading-7 text-[color:var(--ink)]/65">
                            {paragraph}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-[color:var(--ink)]/50">
                        Misi belum tersedia.
                      </p>
                    )}
                  </div>
                </article>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Navigation */}
      <section className="border-t border-[color:var(--primary)]/10 bg-[color:var(--sage)]/50 py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <a
            href="/profil/sejarah"
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--primary)] transition hover:text-[color:var(--gold-dark)]"
          >
            <span aria-hidden="true">←</span>
            Sejarah
          </a>

          <a
            href="/profil"
            className="text-sm font-medium text-[color:var(--primary)] transition hover:text-[color:var(--gold-dark)]"
          >
            Kembali ke Profil
          </a>
        </div>
      </section>
    </main>
  );
}