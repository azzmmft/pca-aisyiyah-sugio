"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
  status: "draft" | "published";
};

function getImageUrl(key: string | null) {
  if (!key) return "";
  return `/api/images/${key}`;
}

function formatDate(date: string | null) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function NewsSection() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    async function loadArticles() {
      try {
        const response = await fetch("/api/articles");
        const data = (await response.json()) as Record<string, any>;

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Gagal mengambil berita");
        }

        const publishedArticles = (data.articles || [])
          .filter((article: Article) => article.status === "published")
          .slice(0, 6);

        setArticles(publishedArticles);
      } catch (error) {
        console.error("Gagal mengambil berita:", error);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  const totalSlides = articles.length;

  function nextSlide() {
    if (totalSlides === 0) return;
    setCurrentIndex((current) => (current >= totalSlides - 1 ? 0 : current + 1));
  }

  function previousSlide() {
    if (totalSlides === 0) return;
    setCurrentIndex((current) => (current <= 0 ? totalSlides - 1 : current - 1));
  }

  return (
    <section className="bg-[color:var(--sage)]/60 py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C68A2E]">
              Kabar & Informasi
            </p>

            <h2 className="font-display text-3xl text-[color:var(--primary-dark)] md:text-4xl">
              Berita Terbaru
            </h2>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#1C2620]/65 md:text-base">
              Simak kabar terbaru seputar kegiatan dan informasi PCA Aisyiyah Sugio.
            </p>
          </div>

          <Link
            href="/berita"
            className="inline-flex w-fit items-center text-sm font-semibold text-[#0B4F3F] transition hover:text-[#C68A2E]"
          >
            Lihat semua berita →
          </Link>
        </div>

        {loading && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div key={item} className="overflow-hidden rounded-[1.8rem] bg-white">
                <div className="aspect-[16/10] animate-pulse bg-[#E7EFE9]" />
                <div className="space-y-3 p-6">
                  <div className="h-3 w-24 animate-pulse rounded bg-[#E7EFE9]" />
                  <div className="h-5 w-4/5 animate-pulse rounded bg-[#E7EFE9]" />
                  <div className="h-4 w-full animate-pulse rounded bg-[#E7EFE9]" />
                  <div className="h-4 w-2/3 animate-pulse rounded bg-[#E7EFE9]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && articles.length === 0 && (
          <div className="rounded-[1.8rem] bg-white px-6 py-14 text-center">
            <div className="text-5xl">📰</div>
            <h3 className="mt-4 text-lg font-semibold text-[#0B4F3F]">Belum ada berita</h3>
            <p className="mt-2 text-sm text-[#1C2620]/55">Berita terbaru akan ditampilkan di sini.</p>
          </div>
        )}

        {!loading && articles.length > 0 && (
          <div className="relative">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {articles.slice(0, 3).map((article) => (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-[1.8rem] border border-[color:var(--primary)]/5 bg-white shadow-[0_18px_36px_rgba(11,79,63,0.05)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_22px_45px_rgba(11,79,63,0.09)]"
                >
                  <Link href={`/berita/${article.slug}`}>
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#E7EFE9]">
                      {article.image_url ? (
                        <img
                          src={getImageUrl(article.image_url)}
                          alt={article.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">📰</div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-70" />
                    </div>

                    <div className="p-6">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#C68A2E]">
                        {formatDate(article.published_at)}
                      </p>

                      <h3 className="mt-3 line-clamp-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold leading-tight text-[#0B4F3F]">
                        {article.title}
                      </h3>

                      {article.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#1C2620]/60">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#0B4F3F] transition group-hover:text-[#C68A2E]">
                        Baca selengkapnya <span aria-hidden="true">→</span>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>

            {articles.length > 3 && (
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={previousSlide}
                  aria-label="Berita sebelumnya"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0B4F3F]/15 bg-white text-[#0B4F3F] transition duration-300 hover:-translate-y-0.5 hover:bg-[#0B4F3F] hover:text-white"
                >
                  ←
                </button>

                <div className="flex gap-2">
                  {articles.slice(0, 6).map((article, index) => (
                    <button
                      key={article.id}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      aria-label={`Berita ${index + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        index === currentIndex ? "w-6 bg-[#0B4F3F]" : "w-2 bg-[#0B4F3F]/20"
                      }`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={nextSlide}
                  aria-label="Berita berikutnya"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-[#0B4F3F]/15 bg-white text-[#0B4F3F] transition duration-300 hover:-translate-y-0.5 hover:bg-[#0B4F3F] hover:text-white"
                >
                  →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}