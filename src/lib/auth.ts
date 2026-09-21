import { cookies } from "next/headers";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getCurrentAdmin() {
  try {
    const cookieStore = await cookies();

    const sessionId = cookieStore.get(
      "pca_admin_session"
    )?.value;

    if (!sessionId) {
      return null;
    }

    const { env } = await getCloudflareContext({
      async: true,
    });

    const admin =
      await env.pca_aisyiyah_sugio_db
        .prepare(
          `
          SELECT
            admins.id,
            admins.username,
            sessions.id AS session_id,
            sessions.expires_at
          FROM sessions
          INNER JOIN admins
            ON admins.id = sessions.admin_id
          WHERE sessions.id = ?
          LIMIT 1
          `
        )
        .bind(sessionId)
        .first<{
          id: number;
          username: string;
          session_id: string;
          expires_at: number;
        }>();

    if (!admin) {
      return null;
    }

    const now = Math.floor(
      Date.now() / 1000
    );

    if (admin.expires_at <= now) {
      return null;
    }

    return {
      id: admin.id,
      username: admin.username,
      sessionId: admin.session_id,
    };
  } catch (error) {
    console.error(
      "getCurrentAdmin error:",
      error
    );

    return null;
  }
}