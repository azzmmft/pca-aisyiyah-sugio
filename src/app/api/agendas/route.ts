import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

type AgendaInput = {
  title: string;
  description?: string;
  date: string;
  location?: string;
};

async function getDatabase(): Promise<D1Database> {
  const { env } = await getCloudflareContext({
    async: true,
  });

  return env.pca_aisyiyah_sugio_db;
}

// GET - mengambil semua agenda
export async function GET() {
  try {
    const db = await getDatabase();

    const result = await db
      .prepare(
        `
        SELECT
          id,
          title,
          description,
          date,
          location,
          created_at
        FROM agendas
        ORDER BY date ASC
        `
      )
      .all();

    return NextResponse.json({
      success: true,
      data: result.results,
    });
  } catch (error) {
    console.error("GET /api/agendas error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil data agenda",
      },
      { status: 500 }
    );
  }
}

// POST - menambahkan agenda
export async function POST(request: Request) {
  try {
    const db = await getDatabase();

    const body = (await request.json()) as AgendaInput;

    if (!body.title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Judul agenda wajib diisi",
        },
        { status: 400 }
      );
    }

    if (!body.date) {
      return NextResponse.json(
        {
          success: false,
          error: "Tanggal agenda wajib diisi",
        },
        { status: 400 }
      );
    }

    const result = await db
      .prepare(
        `
        INSERT INTO agendas (
          title,
          description,
          date,
          location
        )
        VALUES (?, ?, ?, ?)
        `
      )
      .bind(
        body.title.trim(),
        body.description?.trim() || null,
        body.date,
        body.location?.trim() || null
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "Agenda berhasil ditambahkan",
      id: result.meta.last_row_id,
    });
  } catch (error) {
    console.error("POST /api/agendas error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Gagal menambahkan agenda",
      },
      { status: 500 }
    );
  }
}

// PUT - mengubah agenda
export async function PUT(request: Request) {
  try {
    const db = await getDatabase();

    const body = (await request.json()) as AgendaInput & {
      id: number;
    };

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID agenda tidak ditemukan",
        },
        { status: 400 }
      );
    }

    if (!body.title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          error: "Judul agenda wajib diisi",
        },
        { status: 400 }
      );
    }

    if (!body.date) {
      return NextResponse.json(
        {
          success: false,
          error: "Tanggal agenda wajib diisi",
        },
        { status: 400 }
      );
    }

    await db
      .prepare(
        `
        UPDATE agendas
        SET
          title = ?,
          description = ?,
          date = ?,
          location = ?
        WHERE id = ?
        `
      )
      .bind(
        body.title.trim(),
        body.description?.trim() || null,
        body.date,
        body.location?.trim() || null,
        body.id
      )
      .run();

    return NextResponse.json({
      success: true,
      message: "Agenda berhasil diperbarui",
    });
  } catch (error) {
    console.error("PUT /api/agendas error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Gagal memperbarui agenda",
      },
      { status: 500 }
    );
  }
}

// DELETE - menghapus agenda
export async function DELETE(request: Request) {
  try {
    const db = await getDatabase();

    const body = (await request.json()) as {
      id: number;
    };

    if (!body.id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID agenda tidak ditemukan",
        },
        { status: 400 }
      );
    }

    await db
      .prepare(
        `
        DELETE FROM agendas
        WHERE id = ?
        `
      )
      .bind(body.id)
      .run();

    return NextResponse.json({
      success: true,
      message: "Agenda berhasil dihapus",
    });
  } catch (error) {
    console.error("DELETE /api/agendas error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Gagal menghapus agenda",
      },
      { status: 500 }
    );
  }
}

