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
          description,
          address,
          image_url,
          sort_order,
          created_at
         FROM branches
         ORDER BY sort_order ASC, id ASC`
      )
      .all();

    return NextResponse.json({
      success: true,
      branches: result.results,
    });
  } catch (error) {
    console.error("GET /api/branches error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data ranting",
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

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const address =
      typeof body.address === "string"
        ? body.address.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    const sortOrder =
      Number.isFinite(Number(body.sort_order))
        ? Number(body.sort_order)
        : 0;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama ranting wajib diisi",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `INSERT INTO branches
          (name, description, address, image_url, sort_order)
         VALUES (?, ?, ?, ?, ?)`
      )
      .bind(
        name,
        description || null,
        address || null,
        imageUrl || null,
        sortOrder
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "Ranting berhasil ditambahkan",
      id: result.meta.last_row_id,
    });
  } catch (error) {
    console.error("POST /api/branches error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan ranting",
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
          error: "ID ranting tidak valid",
        },
        { status: 400 }
      );
    }

    const body = (await request.json()) as Record<string, any>;

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    const address =
      typeof body.address === "string"
        ? body.address.trim()
        : "";

    const imageUrl =
      typeof body.image_url === "string"
        ? body.image_url.trim()
        : "";

    const sortOrder =
      Number.isFinite(Number(body.sort_order))
        ? Number(body.sort_order)
        : 0;

    if (!name) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama ranting wajib diisi",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `UPDATE branches
         SET name = ?,
             description = ?,
             address = ?,
             image_url = ?,
             sort_order = ?
         WHERE id = ?`
      )
      .bind(
        name,
        description || null,
        address || null,
        imageUrl || null,
        sortOrder,
        id
      )
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Ranting tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Data ranting berhasil diperbarui",
    });
  } catch (error) {
    console.error("PUT /api/branches error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui ranting",
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
          error: "ID ranting tidak valid",
        },
        { status: 400 }
      );
    }

    const result = await env.pca_aisyiyah_sugio_db
      .prepare(
        `DELETE FROM branches
         WHERE id = ?`
      )
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Ranting tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Ranting berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/branches error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menghapus ranting",
      },
      { status: 500 }
    );
  }
}