"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Activity = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export default function ActivitySection() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [visibleCols, setVisibleCols] = useState(3); // Default desktop: 3 cols

  useEffect(() => {
    async function loadActivities() {
      try {
        const response = await fetch("/api/activities");
        const data = (await response.json()) as Record<string, any>;

        if (data.success && Array.isArray(data.activities)) {
          setActivities(data.activities);
        }
      } catch (error) {
        console.error("Gagal mengambil kegiatan:", error);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  // Update visible columns count based on screen width
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth < 640) {
        setVisibleCols(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCols(2);
      } else {
        setVisibleCols(3);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const maxIndex = Math.max(0, activities.length - visibleCols);
  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < maxIndex;

  // Auto-play interval
  useEffect(() => {
    if (activities.length <= visibleCols) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [activities.length, visibleCols, maxIndex]);

  function nextSlide() {
    if (canScrollRight) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setCurrentIndex(0); // Reset ke awal jika tombol ditekan di ujung
    }
  }

  function previousSlide() {
    if (canScrollLeft) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setCurrentIndex(maxIndex); // Ke ujung jika tombol ditekan di awal
    }
  }

  return (
    <section id="kegiatan" className="bg-[color:var(--primary-dark)] py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Header Section */}
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">
              Aktivitas Kami
            </span>
            <h2 className="font-display text-3xl text-[color:var(--cream)] md:text-4xl">
              Kegiatan Terbaru
            </h2>
          </div>

          <Link
            href="/kegiatan"
            className="group hidden items-center gap-2 text-sm font-medium text-[color:var(--cream)]/80 transition hover:text-[color:var(--gold)] sm:flex"
          >
            <span>Lihat selengkapnya</span>
            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4 animate-pulse"
              >
                <div className="aspect-[16/10] w-full rounded-xl bg-white/10" />
                <div className="mt-4 h-4 w-1/3 rounded bg-white/10" />
                <div className="mt-2 h-5 w-5/6 rounded bg-white/10" />
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && activities.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center backdrop-blur-sm">
            <p className="text-sm text-[color:var(--cream)]/60">Belum ada kegiatan yang ditampilkan.</p>
          </div>
        )}

        {/* Carousel Content */}
        {!loading && activities.length > 0 && (
          <div className="relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / visibleCols)}%)`,
                }}
              >
                {activities.map((activity) => (
                  <article
                    key={activity.id}
                    className="w-full shrink-0 px-2 sm:w-1/2 lg:w-1/3"
                  >
                    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-3.5 transition duration-300 hover:border-[color:var(--gold)]/40 hover:bg-white/[0.08] hover:shadow-xl">
                      {/* Image Container */}
                      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br from-[color:var(--primary)] to-[#0f382c]">
                        {activity.image_url ? (
                          <img
                            src={`/api/images/${activity.image_url}`}
                            alt={activity.title}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
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
                              <circle cx="12" cy="13" r="3.2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}

                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
                        <div className="absolute bottom-3 left-3 right-3">
                          <span className="inline-block rounded-md bg-black/40 px-2 py-1 text-[10px] font-medium uppercase tracking-wider text-[color:var(--gold)] backdrop-blur-md">
                            Kegiatan
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-1 flex-col justify-between pt-4 pb-1 px-1">
                        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-[color:var(--cream)] transition group-hover:text-[color:var(--gold)]">
                          {activity.title}
                        </h3>

                        {activity.description && (
                          <p className="mt-2 line-clamp-2 text-xs text-[color:var(--cream)]/60">
                            {activity.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Navigation Controls */}
            {activities.length > visibleCols && (
              <div className="mt-8 flex items-center justify-between">
                {/* Tombol Panah Kiri & Kanan  */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={previousSlide}
                    disabled={!canScrollLeft}
                    aria-label="Scroll Kiri"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--primary)]/20 bg-white/70 text-[color:var(--primary-dark)] shadow-sm backdrop-blur-md transition hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    type="button"
                    onClick={nextSlide}
                    disabled={!canScrollRight}
                    aria-label="Scroll Kanan"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--primary)]/20 bg-white/70 text-[color:var(--primary-dark)] shadow-sm backdrop-blur-md transition hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Dot Indicators */}
                <div className="flex items-center gap-1.5">
                  {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      aria-label={`Ke slide ${index + 1}`}
                      onClick={() => setCurrentIndex(index)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentIndex === index
                          ? "w-7 bg-[color:var(--gold)]"
                          : "w-2 bg-white/20 hover:bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Mobile View All Link */}
        {!loading && activities.length > 0 && (
          <div className="mt-8 sm:hidden text-center">
            <Link
              href="/kegiatan"
              className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--cream)]/80 transition hover:text-[color:var(--gold)]"
            >
              <span>Lihat selengkapnya</span>
              <span>→</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}