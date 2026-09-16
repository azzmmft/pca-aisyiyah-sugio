import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  try {
    const { env } = getCloudflareContext();

    const result = await env.pca_aisyiyah_sugio_db
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
    console.error("Products API Error:", error);

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