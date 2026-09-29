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
          description,
          image_url,
          created_at
         FROM activities
         ORDER BY id DESC`
      )
      .all();

    return NextResponse.json({
      success: true,
      activities: result.results,
    });
  } catch (error) {
    console.error("GET /api/activities error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data kegiatan",
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

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "Judul kegiatan wajib diisi",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `INSERT INTO activities
          (title, description, image_url)
         VALUES (?, ?, ?)`
      )
      .bind(
        title,
        description || null,
        imageUrl || null
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "Kegiatan berhasil ditambahkan",
      id: result.meta.last_row_id,
    });
  } catch (error) {
    console.error("POST /api/activities error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan kegiatan",
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
          error: "ID kegiatan tidak valid",
        },
        { status: 400 }
      );
    }

    const body = (await request.json()) as Record<string, any>;

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    if (!title) {
      return NextResponse.json(
        {
          success: false,
          error: "Judul kegiatan wajib diisi",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `UPDATE activities
         SET title = ?,
             description = ?,
             image_url = ?
         WHERE id = ?`
      )
      .bind(
        title,
        description || null,
        imageUrl || null,
        id
      )
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Kegiatan tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kegiatan berhasil diperbarui",
    });
  } catch (error) {
    console.error("PUT /api/activities error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui kegiatan",
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
          error: "ID kegiatan tidak valid",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `DELETE FROM activities
         WHERE id = ?`
      )
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Kegiatan tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Kegiatan berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/activities error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menghapus kegiatan",
      },
      { status: 500 }
    );
  }
}