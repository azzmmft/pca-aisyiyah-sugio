"use client";

import { useEffect, useState } from "react";

type Branch = {
  id: number;
  name: string;
  description?: string | null;
  address?: string | null;
  image_url?: string | null;
  sort_order: number;
};

export default function RantingPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBranches() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/branches");

        if (!response.ok) {
          throw new Error(
            "Gagal mengambil data ranting"
          );
        }

        const data = (await response.json()) as Record<string, any>;

        if (!data.success) {
          throw new Error(
            data.error || "Gagal mengambil data ranting"
          );
        }

        setBranches(data.branches || []);
      } catch (error) {
        console.error("Fetch branches error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data ranting"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBranches();
  }, []);

  return (
    <main className="bg-[color:var(--cream)]">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[color:var(--primary-dark)] py-20 md:py-28">
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
            Ranting
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-7 text-[color:var(--cream)]/65 md:text-base">
            Mengenal ranting-ranting Aisyiyah yang berada
            dalam wilayah Pimpinan Cabang Aisyiyah Sugio.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          {loading && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-80 animate-pulse rounded-2xl bg-[color:var(--primary)]/10"
                />
              ))}
            </div>
          )}

          {!loading && error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-5 text-sm leading-6 text-red-700">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            branches.length === 0 && (
              <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white px-6 py-12 text-center shadow-sm">
                <p className="text-sm text-[color:var(--ink)]/60">
                  Informasi ranting belum tersedia.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            branches.length > 0 && (
              <>
                <div className="mb-10 text-center">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
                    Wilayah Ranting
                  </p>

                  <h2 className="mt-3 font-display text-3xl text-[color:var(--primary-dark)] md:text-4xl">
                    Ranting Aisyiyah Sugio
                  </h2>

                  <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[color:var(--ink)]/55">
                    Daftar ranting Aisyiyah yang berada di
                    bawah koordinasi PCA Aisyiyah Sugio.
                  </p>
                </div>

                <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {branches.map((branch) => (
                    <article
                      key={branch.id}
                      className="overflow-hidden rounded-2xl border border-[color:var(--primary)]/10 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                      <div className="h-52 bg-[color:var(--sage)]">
                        {branch.image_url ? (
                          <img
                            src={`/api/images/${branch.image_url}`}
                            alt={branch.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[color:var(--primary)]/10 text-3xl text-[color:var(--primary)]/30">
                              🏠
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <p className="text-xs font-medium uppercase tracking-[0.15em] text-[color:var(--gold-dark)]">
                          Ranting #{branch.sort_order}
                        </p>

                        <h3 className="mt-2 font-display text-xl text-[color:var(--primary-dark)]">
                          {branch.name}
                        </h3>

                        {branch.address && (
                          <p className="mt-3 flex gap-2 text-sm leading-6 text-[color:var(--ink)]/55">
                            <span aria-hidden="true">
                              •
                            </span>
                            <span>{branch.address}</span>
                          </p>
                        )}

                        {branch.description && (
                          <p className="mt-3 text-sm leading-7 text-[color:var(--ink)]/60">
                            {branch.description}
                          </p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </>
            )}
        </div>
      </section>

      {/* NAVIGATION */}
      <section className="border-t border-[color:var(--primary)]/10 bg-[color:var(--sage)]/50 py-12">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 sm:flex-row sm:items-center sm:justify-between md:px-8">
          <a
            href="/profil/kepengurusan"
            className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--primary)] transition hover:text-[color:var(--gold-dark)]"
          >
            <span aria-hidden="true">←</span>
            Kepengurusan
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