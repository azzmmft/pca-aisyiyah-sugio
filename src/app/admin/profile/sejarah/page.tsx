"use client";

import { useEffect, useState } from "react";

type ProfileSection = {
  id: number;
  slug: string;
  title: string;
  content: string;
  updated_at?: string;
};

export default function AdminSejarahPage() {
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
          "/api/profile-sections?slug=sejarah"
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data sejarah");
        }

        const data = (await response.json()) as Record<string, any>;

        if (!data.success) {
          throw new Error(
            data.error || "Gagal mengambil data sejarah"
          );
        }

        if (data.section) {
          setSection(data.section);
          setTitle(data.section.title || "");
          setContent(data.section.content || "");
        }
      } catch (error) {
        console.error("Fetch sejarah error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data sejarah"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSection();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/profile-sections?slug=sejarah",
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

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Gagal menyimpan perubahan sejarah"
        );
      }

      setSuccess("Sejarah berhasil diperbarui.");

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
      console.error("Update sejarah error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan perubahan sejarah"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-10 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-4 w-80 animate-pulse rounded bg-gray-200" />
        </div>

        <div className="h-96 animate-pulse rounded-2xl bg-white shadow-sm" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-[#C68A2E]">
          ORGANISASI
        </p>

        <h1 className="mt-1 font-serif text-4xl font-bold text-[#082F26]">
          Sejarah
        </h1>

        <p className="mt-2 text-sm text-[#1C2620]/60">
          Kelola informasi mengenai sejarah PCA Aisyiyah Sugio.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#082F26]">
            Sejarah PCA Aisyiyah Sugio
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Informasi mengenai latar belakang dan perjalanan
            PCA Aisyiyah Sugio.
          </p>
        </div>

        <div>
          <label
            htmlFor="sejarah-title"
            className="mb-2 block text-sm font-medium text-[#1C2620]"
          >
            Judul
          </label>

          <input
            id="sejarah-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Contoh: Sejarah PCA Aisyiyah Sugio"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1C2620] outline-none transition placeholder:text-gray-400 focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
          />
        </div>

        <div className="mt-6">
          <label
            htmlFor="sejarah-content"
            className="mb-2 block text-sm font-medium text-[#1C2620]"
          >
            Isi Sejarah
          </label>

          <textarea
            id="sejarah-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Tulis sejarah PCA Aisyiyah Sugio..."
            rows={16}
            className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-7 text-[#1C2620] outline-none transition placeholder:text-gray-400 focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
          />

          <p className="mt-2 text-xs text-gray-400">
            Gunakan paragraf baru untuk memisahkan bagian
            informasi.
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-400">
            {section?.updated_at
              ? `Terakhir diperbarui: ${section.updated_at}`
              : "Belum pernah diperbarui"}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#0B4F3F] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#082F26] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>
      </form>
    </div>
  );
}