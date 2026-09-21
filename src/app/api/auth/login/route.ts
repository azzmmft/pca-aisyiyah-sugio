import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

const ITERATIONS = 100000;

function hexToUint8Array(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(
      hex.substring(i * 2, i * 2 + 2),
      16
    );
  }

  return bytes;
}

function uint8ArrayToHex(bytes: Uint8Array) {
  return Array.from(bytes)
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword(
  password: string,
  saltHex: string
) {
  const encoder = new TextEncoder();

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: new TextEncoder().encode(saltHex),
      iterations: ITERATIONS,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  return uint8ArrayToHex(
    new Uint8Array(derivedBits)
  );
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) {
    return false;
  }

  let result = 0;

  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }

  return result === 0;
}

export async function POST(request: Request) {
  try {
    const { env } = await getCloudflareContext({
      async: true,
    });

    const body = (await request.json()) as {
      username?: string;
      password?: string;
    };

    const username = body.username?.trim();
    const password = body.password;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Username dan password wajib diisi",
        },
        { status: 400 }
      );
    }

    const admin = await env.pca_aisyiyah_sugio_db
      .prepare(
        `
        SELECT id, username, password_hash, password_salt
        FROM admins
        WHERE username = ?
        LIMIT 1
        `
      )
      .bind(username)
      .first<{
        id: number;
        username: string;
        password_hash: string;
        password_salt: string;
      }>();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Username atau password salah",
        },
        { status: 401 }
      );
    }

    const passwordHash = await hashPassword(
      password,
      admin.password_salt
    );

    if (!safeEqual(passwordHash, admin.password_hash)) {
      return NextResponse.json(
        {
          success: false,
          error: "Username atau password salah",
        },
        { status: 401 }
      );
    }

    // Session berlaku 7 hari
    const sessionId = crypto.randomUUID();

    const expiresAt =
      Math.floor(Date.now() / 1000) +
      7 * 24 * 60 * 60;

    await env.pca_aisyiyah_sugio_db
      .prepare(
        `
        INSERT INTO sessions (
          id,
          admin_id,
          expires_at
        )
        VALUES (?, ?, ?)
        `
      )
      .bind(
        sessionId,
        admin.id,
        expiresAt
      )
      .run();

    const response = NextResponse.json({
      success: true,
      message: "Login berhasil",
    });

    response.cookies.set(
      "pca_admin_session",
      sessionId,
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "POST /api/auth/login error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Terjadi kesalahan pada server",
      },
      { status: 500 }
    );
  }
}