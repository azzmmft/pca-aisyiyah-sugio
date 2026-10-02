import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const ALLOWED_FOLDERS = [
  "products",
  "organization-structure",
  "organization-members",
  "activities",
  "gallery",
  "branches",
  "articles",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024;

type CloudinaryBindings = {
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
};

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({ async: true });

    const formData = await request.formData();

    const file = formData.get("file");

    const requestedFolder = formData.get("folder");

    const folder =
      typeof requestedFolder === "string" &&
      ALLOWED_FOLDERS.includes(requestedFolder)
        ? requestedFolder
        : "products";

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          error: "File foto wajib dipilih",
        },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: "Format foto harus JPG, PNG, atau WEBP",
        },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Ukuran foto maksimal 5 MB",
        },
        { status: 400 }
      );
    }

    const cloudinaryEnv = env as CloudflareEnv & CloudinaryBindings;
    const cloudName = cloudinaryEnv.CLOUDINARY_CLOUD_NAME?.trim();
    const apiKey = cloudinaryEnv.CLOUDINARY_API_KEY?.trim();
    const apiSecret = cloudinaryEnv.CLOUDINARY_API_SECRET?.trim();

    if (!cloudName || !apiKey || !apiSecret) {
      throw new Error("Cloudinary environment variables are not configured");
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(cloudName)) {
      throw new Error("Cloudinary cloud name is invalid");
    }

    const publicId = `${folder}/${crypto.randomUUID()}`;
    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", file, file.name);
    cloudinaryForm.append("public_id", publicId);
    cloudinaryForm.append("overwrite", "false");

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${btoa(`${apiKey}:${apiSecret}`)}`,
        },
        body: cloudinaryForm,
      }
    );

    const uploadResult = (await cloudinaryResponse.json().catch(() => null)) as {
      public_id?: unknown;
      format?: unknown;
      error?: { message?: unknown };
    } | null;

    if (!cloudinaryResponse.ok) {
      const message =
        typeof uploadResult?.error?.message === "string"
          ? uploadResult.error.message
          : `Cloudinary upload failed (${cloudinaryResponse.status})`;
      throw new Error(message);
    }

    if (uploadResult?.public_id !== publicId || typeof uploadResult.format !== "string") {
      throw new Error("Cloudinary returned invalid upload metadata");
    }

    const format = uploadResult.format.toLowerCase();
    const extension = format === "jpeg" ? "jpg" : format;

    if (!["jpg", "png", "webp"].includes(extension)) {
      throw new Error("Cloudinary returned an unsupported image format");
    }

    const key = `cloudinary/${publicId}.${extension}`;

    return NextResponse.json({
      success: true,
      key,
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