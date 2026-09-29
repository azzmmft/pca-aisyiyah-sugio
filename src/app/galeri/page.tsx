"use client";

import { useEffect, useState } from "react";

type GalleryItem = {
  id: number;
  title: string | null;
  image_url: string;
  created_at: string;
};

function getImageUrl(key: string) {
  return `/api/images/${key}`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function GaleriPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const response = await fetch("/api/gallery");
        const data = (await response.json()) as Record<string, any>;

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Gagal mengambil galeri");
        }

        setGallery(data.gallery || []);
      } catch (error) {
        console.error("Gagal mengambil galeri:", error);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E4]">
      {/* HERO */}
      <section className="bg-[#0B4F3F] px-6 py-20 text-white md:py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C68A2E]">
            Dokumentasi
          </p>

          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-fraunces)] text-5xl font-semibold leading-tight md:text-6xl">
            Galeri Kegiatan
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            Dokumentasi kegiatan dan aktivitas Pimpinan Cabang Aisyiyah
            Sugio.
          </p>
        </div>
      </section>

      {/* GALLERY */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-7xl">
          {loading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="aspect-[4/3] animate-pulse overflow-hidden rounded-3xl bg-[#E7EFE9]"
                />
              ))}
            </div>
          ) : gallery.length === 0 ? (
            <div className="rounded-3xl bg-white px-6 py-16 text-center">
              <div className="text-5xl">📷</div>

              <h2 className="mt-4 text-xl font-semibold text-[#0B4F3F]">
                Belum ada dokumentasi
              </h2>

              <p className="mt-2 text-sm text-[#1C2620]/60">
                Dokumentasi kegiatan akan ditampilkan di halaman ini.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {gallery.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E7EFE9]">
                    <img
                      src={getImageUrl(item.image_url)}
                      alt={item.title || "Dokumentasi PCA Aisyiyah Sugio"}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />

                    {/* OVERLAY */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-5 pt-16 opacity-0 transition duration-300 group-hover:opacity-100">
                      <p className="text-xs font-medium text-white/70">
                        {formatDate(item.created_at)}
                      </p>

                      {item.title && (
                        <h2 className="mt-1 text-base font-semibold text-white">
                          {item.title}
                        </h2>
                      )}
                    </div>
                  </div>

                  {/* MOBILE / NORMAL INFO */}
                  <div className="p-5">
                    {item.title ? (
                      <h2 className="line-clamp-2 font-[family-name:var(--font-fraunces)] text-xl font-semibold leading-tight text-[#0B4F3F]">
                        {item.title}
                      </h2>
                    ) : (
                      <h2 className="font-[family-name:var(--font-fraunces)] text-xl font-semibold text-[#0B4F3F]">
                        Dokumentasi Kegiatan
                      </h2>
                    )}

                    <p className="mt-2 text-xs text-[#1C2620]/50">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}