"use client";

import { useEffect, useState } from "react";

type Profile = {
  id: number;
  title: string;
  content: string;
  updated_at?: string;
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/profile");

        if (!response.ok) {
          throw new Error("Gagal mengambil data profil");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.error || "Gagal mengambil data profil"
          );
        }

        setProfile(data.profile || null);
      } catch (error) {
        console.error("Fetch profile error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data profil"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return (
    <main className="bg-[color:var(--cream)]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[color:var(--primary-dark)] py-20 md:py-28">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[color:var(--gold)]/10" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[color:var(--sage)]/10" />

        <div className="relative mx-auto max-w-6xl px-5 md:px-8">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold)]">
            Profil Organisasi
          </p>

          <h1 className="max-w-3xl font-display text-4xl leading-tight text-[color:var(--cream)] md:text-6xl">
            Pimpinan Cabang
            <br />
            Aisyiyah Sugio
          </h1>

          <p className="mt-6 max-w-xl text-sm leading-7 text-[color:var(--cream)]/65 md:text-base">
            Mengenal lebih dekat perjalanan, visi, kepengurusan,
            dan kegiatan Pimpinan Cabang Aisyiyah Sugio.
          </p>
        </div>
      </section>

      {/* Tentang PCA */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
                Tentang Kami
              </p>

              <h2 className="mt-3 font-display text-3xl leading-tight text-[color:var(--primary-dark)] md:text-4xl">
                Mengenal PCA Aisyiyah Sugio
              </h2>
            </div>

            <div>
              {loading && (
                <div className="space-y-3">
                  <div className="h-5 w-full animate-pulse rounded bg-[color:var(--primary)]/10" />
                  <div className="h-5 w-11/12 animate-pulse rounded bg-[color:var(--primary)]/10" />
                  <div className="h-5 w-10/12 animate-pulse rounded bg-[color:var(--primary)]/10" />
                  <div className="h-5 w-8/12 animate-pulse rounded bg-[color:var(--primary)]/10" />
                </div>
              )}

              {!loading && error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                  {error}
                </div>
              )}

              {!loading && !error && !profile && (
                <div className="rounded-xl border border-[color:var(--primary)]/10 bg-white/50 px-5 py-6 text-sm text-[color:var(--ink)]/60">
                  Informasi profil belum tersedia.
                </div>
              )}

              {!loading && !error && profile && (
                <div>
                  <h3 className="font-display text-xl text-[color:var(--primary-dark)]">
                    {profile.title}
                  </h3>

                  <div className="mt-5 space-y-4">
                    {profile.content
                      .split(/\n\s*\n/)
                      .map((paragraph, index) => (
                        <p
                          key={index}
                          className="text-sm leading-7 text-[color:var(--ink)]/65 md:text-base"
                        >
                          {paragraph}
                        </p>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Submenu Profil */}
      <section className="border-t border-[color:var(--primary)]/10 bg-[color:var(--sage)]/50 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
              Tentang Organisasi
            </p>

            <h2 className="mt-2 font-display text-2xl text-[color:var(--primary-dark)] md:text-3xl">
              Kenali PCA Aisyiyah Sugio lebih jauh
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <a
              href="/profil/sejarah"
              className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-[color:var(--gold-dark)]">
                    01
                  </p>

                  <h3 className="mt-2 font-display text-xl text-[color:var(--primary-dark)]">
                    Sejarah
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[color:var(--ink)]/55">
                    Mengenal perjalanan dan sejarah PCA Aisyiyah
                    Sugio.
                  </p>
                </div>

                <span className="text-lg text-[color:var(--primary)] transition group-hover:translate-x-1">
                  →
                </span>
              </div>
            </a>

            <a
              href="/profil/visi-misi"
              className="group rounded-2xl bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-[color:var(--gold-dark)]">
                    02
                  </p>

                  <h3 className="mt-2 font-display text-xl text-[color:var(--primary-dark)]">
                    Visi & Misi
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[color:var(--ink)]/55">
                    Mengenal arah, tujuan, dan nilai yang menjadi
                    landasan organisasi.
                  </p>
                </div>

                <span className="text-lg text-[color:var(--primary)] transition group-hover:translate-x-1">
                  →
                </span>
              </div>
            </a>

            <div className="rounded-2xl bg-white/60 p-6 opacity-70">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[color:var(--gold-dark)]">
                03
              </p>

              <h3 className="mt-2 font-display text-xl text-[color:var(--primary-dark)]">
                Struktur Organisasi
              </h3>

              <p className="mt-2 text-sm leading-6 text-[color:var(--ink)]/55">
                Struktur organisasi PCA Aisyiyah Sugio.
              </p>

              <span className="mt-4 inline-block text-xs text-[color:var(--ink)]/40">
                Segera hadir
              </span>
            </div>

            <div className="rounded-2xl bg-white/60 p-6 opacity-70">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[color:var(--gold-dark)]">
                04
              </p>

              <h3 className="mt-2 font-display text-xl text-[color:var(--primary-dark)]">
                Kepengurusan
              </h3>

              <p className="mt-2 text-sm leading-6 text-[color:var(--ink)]/55">
                Mengenal jajaran pengurus PCA Aisyiyah Sugio.
              </p>

              <span className="mt-4 inline-block text-xs text-[color:var(--ink)]/40">
                Segera hadir
              </span>
            </div>
          </div>

          <div className="mt-4">
            <div className="rounded-2xl bg-white/60 p-6 opacity-70">
              <p className="text-xs font-medium uppercase tracking-[0.15em] text-[color:var(--gold-dark)]">
                05
              </p>

              <h3 className="mt-2 font-display text-xl text-[color:var(--primary-dark)]">
                Ranting
              </h3>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink)]/55">
                Mengenal ranting-ranting Aisyiyah yang berada
                dalam wilayah PCA Sugio.
              </p>

              <span className="mt-4 inline-block text-xs text-[color:var(--ink)]/40">
                Segera hadir
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}