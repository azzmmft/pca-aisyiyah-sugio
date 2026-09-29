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

export default function BeritaPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const response = await fetch("/api/articles");
        const data = (await response.json()) as Record<string, any>;

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Gagal mengambil berita");
        }

        const publishedArticles = (data.articles || []).filter(
          (article: Article) => article.status === "published"
        );

        setArticles(publishedArticles);
      } catch (error) {
        console.error("Gagal mengambil berita:", error);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E4]">
      {/* HERO */}
      <section className="bg-[#0B4F3F] px-6 py-20 text-white md:py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#C68A2E]">
            Kabar & Informasi
          </p>

          <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-fraunces)] text-5xl font-semibold leading-tight md:text-6xl">
            Berita PCA Aisyiyah Sugio
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-white/75 md:text-lg">
            Kabar, informasi, dan cerita kegiatan Pimpinan Cabang Aisyiyah
            Sugio.
          </p>
        </div>
      </section>

      {/* BERITA */}
      <section className="px-6 py-16 md:py-20">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="overflow-hidden rounded-3xl bg-white"
                >
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
          ) : articles.length === 0 ? (
            <div className="rounded-3xl bg-white px-6 py-16 text-center">
              <div className="text-5xl">📰</div>

              <h2 className="mt-4 text-xl font-semibold text-[#0B4F3F]">
                Belum ada berita
              </h2>

              <p className="mt-2 text-sm text-[#1C2620]/60">
                Informasi dan berita terbaru akan ditampilkan di halaman ini.
              </p>
            </div>
          ) : (
            <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="group overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                >
                  <Link href={`/berita/${article.slug}`}>
                    {/* IMAGE */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-[#E7EFE9]">
                      {article.image_url ? (
                        <img
                          src={getImageUrl(article.image_url)}
                          alt={article.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-5xl">
                          📰
                        </div>
                      )}
                    </div>

                    {/* CONTENT */}
                    <div className="p-6">
                      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#C68A2E]">
                        {formatDate(article.published_at)}
                      </p>

                      <h2 className="mt-3 line-clamp-2 font-[family-name:var(--font-fraunces)] text-2xl font-semibold leading-tight text-[#0B4F3F]">
                        {article.title}
                      </h2>

                      {article.excerpt && (
                        <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#1C2620]/60">
                          {article.excerpt}
                        </p>
                      )}

                      <div className="mt-5 text-sm font-semibold text-[#0B4F3F]">
                        Baca selengkapnya →
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}