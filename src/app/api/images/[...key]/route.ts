import { getCloudflareContext } from "@opennextjs/cloudflare";

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

    const objectKey = key.join("/");

    if (!objectKey) {
      return new Response("File tidak ditemukan", {
        status: 404,
      });
    }

    const object = await env.R2_BUCKET.get(objectKey);

    if (!object) {
      return new Response("File tidak ditemukan", {
        status: 404,
      });
    }

    const headers = new Headers();

    object.writeHttpMetadata(headers);

    headers.set("etag", object.httpEtag);

    headers.set(
      "cache-control",
      "public, max-age=31536000, immutable"
    );

    return new Response(object.body, {
      headers,
    });
  } catch (error) {
    console.error("GET /api/images error:", error);

    return new Response("Gagal mengambil gambar", {
      status: 500,
    });
  }
}