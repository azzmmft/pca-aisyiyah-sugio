import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({
      async: true,
    });

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "File foto wajib dipilih",
        },
        { status: 400 }
      );
    }

    // Validasi tipe file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format foto harus JPG, PNG, atau WEBP",
        },
        { status: 400 }
      );
    }

    // Validasi ukuran
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Ukuran foto maksimal 5 MB",
        },
        { status: 400 }
      );
    }

    // Ambil ekstensi
    const extension =
      file.type === "image/jpeg"
        ? "jpg"
        : file.type === "image/png"
          ? "png"
          : "webp";

    // Nama file unik
    const fileName = `products/${crypto.randomUUID()}.${extension}`;

    // Upload ke R2
    const uploaded = await env.R2_BUCKET.put(
      fileName,
      file,
      {
        httpMetadata: {
          contentType: file.type,
          cacheControl: "public, max-age=31536000, immutable",
        },
      }
    );

    if (!uploaded) {
      throw new Error("Upload ke R2 gagal");
    }

    return NextResponse.json({
      success: true,
      key: fileName,
      message: "Foto berhasil diupload",
    });
  } catch (error) {
    console.error("POST /api/upload error:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal mengupload foto",
      },
      { status: 500 }
    );
  }
}