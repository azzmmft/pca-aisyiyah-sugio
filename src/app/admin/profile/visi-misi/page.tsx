"use client";

import { FormEvent, useEffect, useState } from "react";

type ProfileSection = {
  id: number;
  slug: string;
  title: string;
  content: string;
  updated_at?: string;
};

export default function VisiMisiAdminPage() {
  const [section, setSection] = useState<ProfileSection | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchSection() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/profile-sections?slug=visi-misi"
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data visi dan misi");
        }

        const data = await response.json();

        if (!data.success || !data.section) {
          throw new Error(
            data.error || "Data visi dan misi tidak ditemukan"
          );
        }

        setSection(data.section);
        setTitle(data.section.title || "");
        setContent(data.section.content || "");
      } catch (error) {
        console.error("Fetch visi-misi error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data visi dan misi"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSection();
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "/api/profile-sections?slug=visi-misi",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            content,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Gagal menyimpan visi dan misi"
        );
      }

      setSuccess("Visi dan misi berhasil diperbarui.");

      setSection((current) =>
        current
          ? {
              ...current,
              title,
              content,
            }
          : current
      );
    } catch (error) {
      console.error("Save visi-misi error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan visi dan misi"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-64 rounded bg-[color:var(--primary)]/10" />
          <div className="h-4 w-96 rounded bg-[color:var(--primary)]/10" />
          <div className="h-12 rounded-xl bg-[color:var(--primary)]/10" />
          <div className="h-64 rounded-xl bg-[color:var(--primary)]/10" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
          Profil Organisasi
        </p>

        <h1 className="mt-2 font-display text-3xl text-[color:var(--primary-dark)]">
          Visi & Misi
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink)]/55">
          Kelola informasi visi dan misi PCA Aisyiyah Sugio yang
          ditampilkan pada halaman publik.
        </p>
      </div>

      {error && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6">
            <h2 className="font-display text-xl text-[color:var(--primary-dark)]">
              Informasi Visi & Misi
            </h2>

            <p className="mt-1 text-sm text-[color:var(--ink)]/50">
              Perbarui judul dan isi informasi yang akan ditampilkan
              pada website.
            </p>
          </div>

          <div className="space-y-5">
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-medium text-[color:var(--ink)]"
              >
                Judul
              </label>

              <input
                id="title"
                type="text"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Contoh: Visi dan Misi PCA Aisyiyah Sugio"
                className="w-full rounded-xl border border-[color:var(--primary)]/15 bg-[color:var(--cream)]/40 px-4 py-3 text-sm text-[color:var(--ink)] outline-none transition placeholder:text-[color:var(--ink)]/30 focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/10"
                required
              />
            </div>

            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-medium text-[color:var(--ink)]"
              >
                Isi Visi & Misi
              </label>

              <textarea
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                placeholder={`Tulis visi pada paragraf pertama.

Tulis misi pertama pada paragraf berikutnya.

Tulis misi kedua pada paragraf berikutnya.

Tulis misi ketiga pada paragraf berikutnya.`}
                rows={14}
                className="w-full resize-y rounded-xl border border-[color:var(--primary)]/15 bg-[color:var(--cream)]/40 px-4 py-3 text-sm leading-7 text-[color:var(--ink)] outline-none transition placeholder:text-[color:var(--ink)]/30 focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/10"
                required
              />

              <div className="mt-2 rounded-lg bg-[color:var(--sage)]/50 px-4 py-3">
                <p className="text-xs leading-5 text-[color:var(--ink)]/55">
                  <strong className="text-[color:var(--primary)]">
                    Tips:
                  </strong>{" "}
                  gunakan satu baris kosong untuk memisahkan Visi dan
                  setiap Misi. Paragraf pertama akan ditampilkan sebagai
                  Visi, sedangkan paragraf berikutnya akan ditampilkan
                  sebagai daftar Misi.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <a
            href="/profil/visi-misi"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-[color:var(--primary)]/15 px-5 py-3 text-sm font-medium text-[color:var(--primary)] transition hover:bg-[color:var(--sage)]"
          >
            Lihat Halaman
          </a>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[color:var(--primary)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[color:var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>

      {section?.updated_at && (
        <p className="mt-5 text-right text-xs text-[color:var(--ink)]/40">
          Terakhir diperbarui:{" "}
          {new Date(section.updated_at).toLocaleString("id-ID")}
        </p>
      )}
    </div>
  );
}