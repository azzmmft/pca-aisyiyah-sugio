import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `SELECT id, image_url, updated_at
         FROM organization_structure
         WHERE id = 1
         LIMIT 1`
      )
      .first();

    return NextResponse.json({
      success: true,
      structure: result || null,
    });
  } catch (error) {
    console.error(
      "GET /api/organization-structure error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil struktur organisasi",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const body = (await request.json()) as Record<string, any>;

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Gambar struktur organisasi wajib diisi",
        },
        { status: 400 }
      );
    }

    const existing = await env.pca_aisyiyah_sugio_db
      .prepare(
        `SELECT id
         FROM organization_structure
         WHERE id = 1
         LIMIT 1`
      )
      .first();

    if (existing) {
      await env.pca_aisyiyah_sugio_db
        .prepare(
          `UPDATE organization_structure
           SET image_url = ?,
               updated_at = CURRENT_TIMESTAMP
           WHERE id = 1`
        )
        .bind(imageUrl)
        .run();
    } else {
      await env.pca_aisyiyah_sugio_db
        .prepare(
          `INSERT INTO organization_structure
           (id, image_url)
           VALUES (1, ?)`
        )
        .bind(imageUrl)
        .run();
    }

    return NextResponse.json({
      success: true,
      message: "Struktur organisasi berhasil diperbarui",
    });
  } catch (error) {
    console.error(
      "PUT /api/organization-structure error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui struktur organisasi",
      },
      { status: 500 }
    );
  }
}