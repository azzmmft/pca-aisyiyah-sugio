import Link from "next/link";
import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published_at: string | null;
  status: string;
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

async function getArticle(slug: string): Promise<Article | null> {
  const { env } = await getCloudflareContext({ async: true });

  const article = await env.pca_aisyiyah_sugio_db
    .prepare(
      `SELECT
        id,
        title,
        slug,
        excerpt,
        content,
        image_url,
        published_at,
        status
      FROM articles
      WHERE slug = ?
      LIMIT 1`
    )
    .bind(slug)
    .first<Article>();

  if (!article || article.status !== "published") {
    return null;
  }

  return article;
}

export default async function ArticleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const article = await getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#F5F0E4]">
      {/* HEADER */}
      <section className="px-6 pb-10 pt-16 md:pb-14 md:pt-24">
        <div className="mx-auto max-w-4xl">
          <Link
            href="/berita"
            className="text-sm font-semibold text-[#0B4F3F] transition hover:text-[#C68A2E]"
          >
            ← Kembali ke Berita
          </Link>

          <p className="mt-10 text-sm font-semibold uppercase tracking-[0.18em] text-[#C68A2E]">
            {formatDate(article.published_at)}
          </p>

          <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-4xl font-semibold leading-tight text-[#0B4F3F] md:text-6xl">
            {article.title}
          </h1>

          {article.excerpt && (
            <p className="mt-6 text-lg leading-8 text-[#1C2620]/65 md:text-xl">
              {article.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* COVER */}
      {article.image_url && (
        <section className="px-6">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl">
            <img
              src={getImageUrl(article.image_url)}
              alt={article.title}
              className="h-auto max-h-[600px] w-full object-cover"
            />
          </div>
        </section>
      )}

      {/* ARTICLE */}
      <article className="px-6 py-12 md:py-16">
        <div className="mx-auto max-w-3xl">
          <div className="whitespace-pre-line text-base leading-8 text-[#1C2620]/80 md:text-lg md:leading-9">
            {article.content}
          </div>
        </div>
      </article>

      {/* BACK */}
      <section className="px-6 pb-20">
        <div className="mx-auto max-w-3xl border-t border-[#0B4F3F]/10 pt-8">
          <Link
            href="/"
            className="inline-flex rounded-xl bg-[#0B4F3F] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#082F26]"
          >
            ← Kembali ke Beranda
          </Link>
        </div>
      </section>
    </main>
  );
}