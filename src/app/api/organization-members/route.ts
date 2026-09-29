import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `SELECT
          id,
          name,
          position,
          division,
          photo_url,
          sort_order,
          created_at
         FROM organization_members
         ORDER BY sort_order ASC, id ASC`
      )
      .all();

    return NextResponse.json({
      success: true,
      members: result.results,
    });
  } catch (error) {
    console.error(
      "GET /api/organization-members error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data kepengurusan",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const body = (await request.json()) as Record<string, any>;

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const position =
      typeof body.position === "string"
        ? body.position.trim()
        : "";

    const division =
      typeof body.division === "string"
        ? body.division.trim()
        : "";

    const photoUrl =
      typeof body.photo_url === "string"
        ? body.photo_url.trim()
        : "";

    const sortOrder =
      Number.isFinite(Number(body.sort_order))
        ? Number(body.sort_order)
        : 0;

    if (!name || !position) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama dan jabatan wajib diisi",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `INSERT INTO organization_members
          (name, position, division, photo_url, sort_order)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(
        name,
        position,
        division || null,
        photoUrl || null,
        sortOrder
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "Pengurus berhasil ditambahkan",
      id: result.meta.last_row_id,
    });
  } catch (error) {
    console.error(
      "POST /api/organization-members error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan pengurus",
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
          error: "ID pengurus tidak valid",
        },
        { status: 400 }
      );
    }

    const body = (await request.json()) as Record<string, any>;

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const position =
      typeof body.position === "string"
        ? body.position.trim()
        : "";

    const division =
      typeof body.division === "string"
        ? body.division.trim()
        : "";

    const photoUrl =
      typeof body.photo_url === "string"
        ? body.photo_url.trim()
        : "";

    const sortOrder =
      Number.isFinite(Number(body.sort_order))
        ? Number(body.sort_order)
        : 0;

    if (!name || !position) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama dan jabatan wajib diisi",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `UPDATE organization_members
         SET name = ?,
             position = ?,
             division = ?,
             photo_url = ?,
             sort_order = ?
         WHERE id = ?`
      )
      .bind(
        name,
        position,
        division || null,
        photoUrl || null,
        sortOrder,
        id
      )
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Pengurus tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data pengurus berhasil diperbarui",
    });
  } catch (error) {
    console.error(
      "PUT /api/organization-members error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui pengurus",
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
          error: "ID pengurus tidak valid",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `DELETE FROM organization_members
         WHERE id = ?`
      )
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Pengurus tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Pengurus berhasil dihapus",
    });
  } catch (error) {
    console.error(
      "DELETE /api/organization-members error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menghapus pengurus",
      },
      { status: 500 }
    );
  }
}