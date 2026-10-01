import Link from "next/link";
import { notFound } from "next/navigation";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published_at: string | null;
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
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const response = await fetch(
      `${baseUrl}/api/articles/${encodeURIComponent(slug)}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Record<string, any>;

    if (!data.success || !data.article) {
      return null;
    }

    if (data.article.status !== "published") {
      return null;
    }

    return data.article;
  } catch (error) {
    console.error(error);
    return null;
  }
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