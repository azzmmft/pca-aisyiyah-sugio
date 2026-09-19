import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type ProductInput = {
  name: string;
  price: string;
  description?: string;
  image_url?: string | null;
};

async function getDatabase(): Promise<D1Database> {
  const { env } = await getCloudflareContext({ async: true });

  return env.pca_aisyiyah_sugio_db;
}

// ========================================
// GET - Ambil semua produk
// ========================================

export async function GET() {
  try {
    const db = await getDatabase();

    const result = await db
      .prepare(
        `SELECT id, name, price, description, image_url, created_at
         FROM products
         ORDER BY id DESC`
      )
      .all();

    return NextResponse.json({
      success: true,
      products: result.results,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengambil data produk",
      },
      { status: 500 }
    );
  }
}

// ========================================
// POST - Tambah produk
// ========================================

export async function POST(request: Request) {
  try {
    const db = await getDatabase();

    const body = (await request.json()) as ProductInput;

    const {
      name,
      price,
      description,
      image_url,
    } = body;

    if (!name?.trim() || !price?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama produk dan harga wajib diisi",
        },
        { status: 400 }
      );
    }

    const result = await db
      .prepare(
        `INSERT INTO products
        (name, price, description, image_url)
        VALUES (?, ?, ?, ?)`
      )
      .bind(
        name.trim(),
        price.trim(),
        description?.trim() || "",
        image_url || null
      )
      .run();

    return NextResponse.json(
      {
        success: true,
        message: "Produk berhasil ditambahkan",
        product_id: result.meta.last_row_id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menambahkan produk",
      },
      { status: 500 }
    );
  }
}

// ========================================
// PUT - Edit produk
// ========================================

export async function PUT(request: Request) {
  try {
    const db = await getDatabase();

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID produk wajib diberikan",
        },
        { status: 400 }
      );
    }

    const body = (await request.json()) as ProductInput;

    const {
      name,
      price,
      description,
      image_url,
    } = body;

    if (!name?.trim() || !price?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama produk dan harga wajib diisi",
        },
        { status: 400 }
      );
    }

    const result = await db
      .prepare(
        `UPDATE products
         SET name = ?,
             price = ?,
             description = ?,
             image_url = ?
         WHERE id = ?`
      )
      .bind(
        name.trim(),
        price.trim(),
        description?.trim() || "",
        image_url || null,
        id
      )
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Produk tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil diperbarui",
    });
  } catch (error) {
    console.error("PUT /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui produk",
      },
      { status: 500 }
    );
  }
}

// ========================================
// DELETE - Hapus produk
// ========================================

export async function DELETE(request: Request) {
  try {
    const db = await getDatabase();

    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID produk wajib diberikan",
        },
        { status: 400 }
      );
    }

    const result = await db
      .prepare("DELETE FROM products WHERE id = ?")
      .bind(id)
      .run();

    if (result.meta.changes === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Produk tidak ditemukan",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produk berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/products error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal menghapus produk",
      },
      { status: 500 }
    );
  }
}