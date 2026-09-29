import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

function createSlug(title: string) {
  return title
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function GET() {
  try {
    const { env } = await getCloudflareContext({
      async: true,
    });

    const result = await env.pca_aisyiyah_sugio_db
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
         ORDER BY
           CASE
             WHEN status = 'published' THEN 0
             ELSE 1
           END,
           published_at DESC,
           id DESC`
      )
      .all();

    return NextResponse.json({
      success: true,
      articles: result.results,
    });
  } catch (error) {
    console.error("GET /api/articles error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data berita",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({
      async: true,
    });

    const body = (await request.json()) as Record<string, any>;

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const excerpt =
      typeof body.excerpt === "string"
        ? body.excerpt.trim()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    const publishedAt =
      typeof body.published_at === "string"
        ? body.published_at.trim()
        : "";

    const status =
      body.status === "published"
        ? "published"
        : "draft";

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "Judul berita wajib diisi",
        },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "Isi berita wajib diisi",
        },
        { status: 400 }
      );
    }

    const baseSlug = createSlug(title);

    if (!baseSlug) {
      return NextResponse.json(
        {
          success: false,
          error: "Judul berita tidak dapat dibuat menjadi slug",
        },
        { status: 400 }
      );
    }

    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const existing = await env.pca_aisyiyah_sugio_db
        .prepare(
          `SELECT id
           FROM articles
           WHERE slug = ?
           LIMIT 1`
        )
        .bind(slug)
        .first();

      if (!existing) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const finalPublishedAt =
      status === "published"
        ? publishedAt || new Date().toISOString()
        : publishedAt || null;

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `INSERT INTO articles (
          title,
          slug,
          excerpt,
          content,
          image_url,
          published_at,
          status
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        title,
        slug,
        excerpt || null,
        content,
        imageUrl || null,
        finalPublishedAt,
        status
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "Berita berhasil ditambahkan",
      id: result.meta.last_row_id,
      slug,
    });
  } catch (error) {
    console.error("POST /api/articles error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan berita",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { env } = await getCloudflareContext({
      async: true,
    });

    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "ID berita tidak valid",
        },
        { status: 400 }
      );
    }

    const body = (await request.json()) as Record<string, any>;

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const excerpt =
      typeof body.excerpt === "string"
        ? body.excerpt.trim()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    const publishedAt =
      typeof body.published_at === "string"
        ? body.published_at.trim()
        : "";

    const status =
      body.status === "published"
        ? "published"
        : "draft";

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "Judul berita wajib diisi",
        },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "Isi berita wajib diisi",
        },
        { status: 400 }
      );
    }

    const existing = await env.pca_aisyiyah_sugio_db
      .prepare(
        `SELECT id, slug
         FROM articles
         WHERE id = ?
         LIMIT 1`
      )
      .bind(id)
      .first<{
        id: number;
        slug: string;
      }>();

    if (!existing) {
      return NextResponse.json(
        {
          success: false,
          error: "Berita tidak ditemukan",
        },
        { status: 404 }
      );
    }

    const baseSlug = createSlug(title);

    if (!baseSlug) {
      return NextResponse.json(
        {
          success: false,
          error: "Judul berita tidak dapat dibuat menjadi slug",
        },
        { status: 400 }
      );
    }

    let slug = baseSlug;
    let counter = 2;

    while (true) {
      const duplicate = await env.pca_aisyiyah_sugio_db
        .prepare(
          `SELECT id
           FROM articles
           WHERE slug = ?
           AND id != ?
           LIMIT 1`
        )
        .bind(slug, id)
        .first();

      if (!duplicate) break;

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const finalPublishedAt =
      status === "published"
        ? publishedAt || new Date().toISOString()
        : publishedAt || null;

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `UPDATE articles
         SET title = ?,
             slug = ?,
             excerpt = ?,
             content = ?,
             image_url = ?,
             published_at = ?,
             status = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`
      )
      .bind(
        title,
        slug,
        excerpt || null,
        content,
        imageUrl || null,
        finalPublishedAt,
        status,
        id
      )
      .run();

    if (result.meta.changes === 0) {
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
      message: "Berita berhasil diperbarui",
      slug,
    });
  } catch (error) {
    console.error("PUT /api/articles error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui berita",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { env } = await getCloudflareContext({
      async: true,
    });

    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "ID berita tidak valid",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `DELETE FROM articles
         WHERE id = ?`
      )
      .run();

    if (result.meta.changes === 0) {
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
      message: "Berita berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/articles error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menghapus berita",
      },
      { status: 500 }
    );
  }
}