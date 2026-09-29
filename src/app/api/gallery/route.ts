import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `SELECT
          id,
          title,
          image_url,
          created_at
         FROM gallery
         ORDER BY id DESC`
      )
      .all();

    return NextResponse.json({
      success: true,
      gallery: result.results,
    });
  } catch (error) {
    console.error("GET /api/gallery error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data galeri",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const body = (await request.json()) as Record<string, any>;

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Foto wajib diupload",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `INSERT INTO gallery
          (title, image_url)
         VALUES (?, ?)`
      )
      .bind(
        title || null,
        imageUrl
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "Foto berhasil ditambahkan ke galeri",
      id: result.meta.last_row_id,
    });
  } catch (error) {
    console.error("POST /api/gallery error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan foto",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "ID foto tidak valid",
        },
        { status: 400 }
      );
    }

    const body = (await request.json()) as Record<string, any>;

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    if (!imageUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "Foto wajib tersedia",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `UPDATE gallery
         SET title = ?,
             image_url = ?
         WHERE id = ?`
      )
      .bind(
        title || null,
        imageUrl,
        id
      )
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Foto tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Foto berhasil diperbarui",
    });
  } catch (error) {
    console.error("PUT /api/gallery error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui foto",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const url = new URL(request.url);
    const id = Number(url.searchParams.get("id"));

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: "ID foto tidak valid",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `DELETE FROM gallery
         WHERE id = ?`
      )
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Foto tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Foto berhasil dihapus dari galeri",
    });
  } catch (error) {
    console.error("DELETE /api/gallery error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menghapus foto",
      },
      { status: 500 }
    );
  }
}