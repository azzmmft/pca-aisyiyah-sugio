"use client";

import { useEffect, useState } from "react";

type OrganizationStructure = {
  id: number;
  image_url: string;
  updated_at?: string;
};

export default function StrukturOrganisasiPage() {
  const [structure, setStructure] =
    useState<OrganizationStructure | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchStructure() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/organization-structure"
        );

        if (!response.ok) {
          throw new Error(
            "Gagal mengambil struktur organisasi"
          );
        }

        const data = (await response.json()) as Record<string, any>;

        if (!data.success) {
          throw new Error(
            data.error ||
              "Gagal mengambil struktur organisasi"
          );
        }

        setStructure(data.structure || null);
      } catch (error) {
        console.error(
          "Fetch organization structure error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil struktur organisasi"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStructure();
  }, []);

  return (
    <main className="bg-[color:var(--cream)]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[color:var(--primary-dark)] py-20 md:py-10">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[color:var(--gold)]/10" />

        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[color:var(--sage)]/10" />

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
            Struktur Organisasi
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--cream)]/65 md:text-base">
            Mengenal susunan dan struktur organisasi Pimpinan
            Cabang Aisyiyah Sugio.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          {loading && (
            <div className="flex min-h-[400px] animate-pulse items-center justify-center rounded-2xl bg-[color:var(--primary)]/10" />
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm leading-6 text-red-700">
              {error}
            </div>
          )}

          {!loading && !error && !structure && (
            <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white px-6 py-12 text-center shadow-sm">
              <p className="text-sm text-[color:var(--ink)]/60">
                Struktur organisasi belum tersedia.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            structure &&
            structure.image_url && (
              <div>
                <div className="mb-10 text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
                    Susunan Organisasi
                  </p>

                  <h2 className="mt-3 font-display text-3xl text-[color:var(--primary-dark)] md:text-4xl">
                    PCA Aisyiyah Sugio
                  </h2>

                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink)]/55">
                    Susunan struktur organisasi Pimpinan Cabang
                    Aisyiyah Sugio.
                  </p>
                </div>

                <div className="overflow-hidden rounded-2xl border border-[color:var(--primary)]/10 bg-white p-3 shadow-sm md:p-6">
                  <div className="flex justify-center overflow-auto rounded-xl bg-[color:var(--cream)]/40 p-3 md:p-6">
                    <img
                      src={`/api/images/${structure.image_url}`}
                      alt="Struktur organisasi PCA Aisyiyah Sugio"
                      className="h-auto max-h-[900px] w-auto max-w-full object-contain"
                    />
                  </div>
                </div>
              </div>
            )}
        </div>
      </section>

      {/* NAVIGATION */}
      <section className="border-t border-[color:var(--primary)]/10 bg-[color:var(--sage)]/50 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
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
            Visi & Misi
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}