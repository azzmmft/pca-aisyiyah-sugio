import { getCloudflareContext } from "@opennextjs/cloudflare";

type CloudinaryBindings = {
  CLOUDINARY_CLOUD_NAME?: string;
};

const CLOUDINARY_FOLDERS = [
  "products",
  "organization-structure",
  "organization-members",
  "activities",
  "gallery",
  "branches",
  "articles",
];

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      key: string[];
    }>;
  }
) {
  try {
    const { env } = await getCloudflareContext({
      async: true,
    });

    const { key } = await context.params;

    if (key.length === 0 || key[0] !== "cloudinary") {
      return new Response("File tidak ditemukan", {
        status: 404,
      });
    }

    const cloudName = (env as CloudflareEnv & CloudinaryBindings)
      .CLOUDINARY_CLOUD_NAME?.trim();

    if (!cloudName || !/^[a-zA-Z0-9_-]+$/.test(cloudName)) {
      return new Response("Cloudinary is not configured", {
        status: 500,
      });
    }

    const cloudinaryKey = key.slice(1).join("/");
    const supportedFolders = CLOUDINARY_FOLDERS.join("|");
    const match = cloudinaryKey.match(
      new RegExp(`^(${supportedFolders})/([a-zA-Z0-9_-]+)\\.(jpg|png|webp)$`, "i")
    );

    if (!match) {
      return new Response("File tidak ditemukan", {
        status: 404,
      });
    }

    const [, folder, publicId, format] = match;
    const deliveryPath = [folder, publicId]
      .map((segment) => encodeURIComponent(segment))
      .join("/");
    const location = `https://res.cloudinary.com/${cloudName}/image/upload/${deliveryPath}.${format}`;

    return new Response(null, {
      status: 302,
      headers: {
        location,
        "cache-control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("GET /api/images error:", error);

    return new Response("Gagal mengambil gambar", {
      status: 500,
    });
  }
}