import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const ALLOWED_SLUGS = ["sejarah", "visi-misi"];

export async function GET(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (!slug || !ALLOWED_SLUGS.includes(slug)) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug profile tidak valid",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `SELECT id, slug, title, content, updated_at
         FROM profile_sections
         WHERE slug = ?
         LIMIT 1`
      )
      .bind(slug)
      .first();

    if (!result) {
      return NextResponse.json(
        {
          success: false,
          error: "Data profile tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      section: result,
    });
  } catch (error) {
    console.error("GET /api/profile-sections error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data profile",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const url = new URL(request.url);
    const slug = url.searchParams.get("slug");

    if (!slug || !ALLOWED_SLUGS.includes(slug)) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug profile tidak valid",
        },
        { status: 400 }
      );
    }

    const body = (await request.json()) as Record<string, any>;

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    if (!title || !content) {
      return NextResponse.json(
        {
          success: false,
          error: "Judul dan isi profile wajib diisi",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `UPDATE profile_sections
         SET title = ?,
             content = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE slug = ?`
      )
      .bind(title, content, slug)
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Data profile tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile berhasil diperbarui",
    });
  } catch (error) {
    console.error("PUT /api/profile-sections error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui data profile",
      },
      { status: 500 }
    );
  }
}