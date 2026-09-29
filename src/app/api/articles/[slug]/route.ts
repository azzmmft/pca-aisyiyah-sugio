import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const { slug } = await context.params;

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
          status,
          created_at,
          updated_at
        FROM articles
        WHERE slug = ?
        LIMIT 1`
      )
      .bind(slug)
      .first();

    if (!article) {
      return NextResponse.json(
        {
          success: false,
          error: "Berita tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      article,
    });
  } catch (error) {
    console.error("GET /api/articles/[slug] error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil berita",
      },
      { status: 500 }
    );
  }
}