"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";

type GalleryItem = {
  id: number;
  title: string | null;
  image_url: string;
  created_at: string;
};

export default function GallerySection() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  const fetchGallery = useCallback(async () => {
    try {
      const response = await fetch("/api/gallery", { cache: "no-store" });
      const data = (await response.json()) as Record<string, any>;

      if (data.success) {
        setGallery(data.gallery || []);
      }
    } catch (error) {
      console.error("Gagal mengambil data galeri:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGallery();
  }, [fetchGallery]);

  useEffect(() => {
    if (gallery.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % gallery.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [gallery.length]);

  const nextSlide = () => {
    if (gallery.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % gallery.length);
  };

  const prevSlide = () => {
    if (gallery.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
  };

  const getVisibleItems = () => {
    if (gallery.length === 0) return [];

    const visibleCount = 3;

    return Array.from({ length: Math.min(visibleCount, gallery.length) }, (_, offset) =>
      gallery[(currentIndex + offset) % gallery.length],
    );
  };

  const visibleItems = getVisibleItems();

  return (
    <section id="galeri" className="bg-[color:var(--cream)] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-[color:var(--gold-dark)]">
              Dokumentasi
            </p>

            <h2 className="font-display text-3xl text-[color:var(--primary-dark)] md:text-4xl">
              Galeri kegiatan
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-[color:var(--ink)]/65 md:text-base">
              Momen dan dokumentasi kegiatan PCA Aisyiyah Sugio.
            </p>
          </div>

          {!loading && gallery.length > 0 && (
            <Link href="/galeri" className="hidden shrink-0 text-sm font-semibold text-[color:var(--primary)] transition hover:text-[color:var(--gold-dark)] sm:block">
              Lihat semua →
            </Link>
          )}
        </div>

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="aspect-[4/3] animate-pulse rounded-[1.6rem] bg-[color:var(--sage)]" />
            ))}
          </div>
        )}

        {!loading && gallery.length === 0 && (
          <div className="rounded-[1.6rem] border border-[color:var(--primary)]/10 bg-white/60 px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--sage)] text-[color:var(--primary)]">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className="h-7 w-7">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
            </div>

            <h3 className="font-display text-xl text-[color:var(--primary-dark)]">Belum ada dokumentasi</h3>
            <p className="mt-2 text-sm text-[color:var(--ink)]/60">Foto kegiatan akan ditampilkan di sini.</p>
          </div>
        )}

        {!loading && gallery.length > 0 && (
          <>
            <div className="relative">
              <div className="hidden gap-5 sm:grid sm:grid-cols-2 md:grid-cols-3">
                {visibleItems.map((item) => (
                  <div key={`${item.id}-${currentIndex}`} className="group overflow-hidden rounded-[1.6rem] bg-white shadow-[0_20px_40px_rgba(11,79,63,0.07)]">
                    <Link href="/galeri">
                      <div className="relative aspect-[4/3] overflow-hidden">
                        <img
                          src={`/api/images/${item.image_url}`}
                          alt={item.title || "Dokumentasi PCA Aisyiyah Sugio"}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                        {item.title && (
                          <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 text-white opacity-0 transition group-hover:translate-y-0 group-hover:opacity-100">
                            <p className="text-sm font-medium">{item.title}</p>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>

              <div className="sm:hidden">
                <Link href="/galeri">
                  <div key={`${gallery[currentIndex].id}-${currentIndex}`} className="group overflow-hidden rounded-[1.6rem] bg-white shadow-[0_20px_40px_rgba(11,79,63,0.07)]">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <img
                        src={`/api/images/${gallery[currentIndex].image_url}`}
                        alt={gallery[currentIndex].title || "Dokumentasi PCA Aisyiyah Sugio"}
                        className="h-full w-full object-cover"
                      />

                      {gallery[currentIndex].title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-5 pb-5 pt-12">
                          <p className="text-sm font-medium text-white">{gallery[currentIndex].title}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </div>

              {gallery.length > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={prevSlide}
                      aria-label="Foto sebelumnya"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--primary)]/15 bg-white text-[color:var(--primary)] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--primary)] hover:text-white"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      onClick={nextSlide}
                      aria-label="Foto berikutnya"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--primary)]/15 bg-white text-[color:var(--primary)] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:bg-[color:var(--primary)] hover:text-white"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {gallery.map((item, index) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setCurrentIndex(index)}
                        aria-label={`Foto ${index + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          index === currentIndex ? "w-6 bg-[color:var(--primary)]" : "w-2 bg-[color:var(--primary)]/20"
                        }`}
                      />
                    ))}
                  </div>

                  <Link href="/galeri" className="text-sm font-semibold text-[color:var(--primary)] sm:hidden">
                    Semua →
                  </Link>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}