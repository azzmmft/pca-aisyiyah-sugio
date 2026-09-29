import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `SELECT id, title, content, updated_at
         FROM profile
         WHERE id = 1
         LIMIT 1`
      )
      .first();

    return NextResponse.json({
      success: true,
      profile: result || null,
    });
  } catch (error) {
    console.error("GET /api/profile error:", error);

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
        `UPDATE profile
         SET title = ?,
             content = ?,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = 1`
      )
      .bind(title, content)
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Data profile belum tersedia",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile berhasil diperbarui",
    });
  } catch (error) {
    console.error("PUT /api/profile error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui profile",
      },
      { status: 500 }
    );
  }
}