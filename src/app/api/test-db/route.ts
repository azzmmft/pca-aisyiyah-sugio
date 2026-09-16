import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET() {
  try {
    const { env } = getCloudflareContext();

    const result = await env.pca_aisyiyah_sugio_db
      .prepare("SELECT * FROM products")
      .all();

    return NextResponse.json({
      success: true,
      products: result.results,
    });
  } catch (error) {
    console.error("D1 Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}