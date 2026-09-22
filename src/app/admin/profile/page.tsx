"use client";

import { useEffect, useState } from "react";

type Profile = {
  id: number;
  title: string;
  content: string;
  updated_at?: string;
};

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/profile");

        if (!response.ok) {
          throw new Error("Gagal mengambil data profile");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(
            data.error || "Gagal mengambil data profile"
          );
        }

        if (data.profile) {
          setProfile(data.profile);
          setTitle(data.profile.title || "");
          setContent(data.profile.content || "");
        }
      } catch (error) {
        console.error("Fetch profile error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data profile"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Gagal menyimpan perubahan profile"
        );
      }

      setSuccess("Profile berhasil diperbarui.");

      setProfile((current) =>
        current
          ? {
              ...current,
              title,
              content,
            }
          : current
      );
    } catch (error) {
      console.error("Update profile error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan perubahan profile"
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
      {/* Header */}
      <div className="mb-8">
        <p className="text-sm font-medium text-[#C68A2E]">
          ORGANISASI
        </p>

        <h1 className="mt-1 font-serif text-4xl font-bold text-[#082F26]">
          Profil
        </h1>

        <p className="mt-2 text-sm text-[#1C2620]/60">
          Kelola informasi utama tentang PCA Aisyiyah Sugio.
        </p>
      </div>

      {/* Notification */}
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

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl bg-white p-6 shadow-sm"
      >
        <div className="mb-6">
          <h2 className="font-serif text-2xl font-bold text-[#082F26]">
            Tentang PCA
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Informasi singkat mengenai Pimpinan Cabang
            Aisyiyah Sugio.
          </p>
        </div>

        {/* Title */}
        <div>
          <label
            htmlFor="profile-title"
            className="mb-2 block text-sm font-medium text-[#1C2620]"
          >
            Judul
          </label>

          <input
            id="profile-title"
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Contoh: Tentang PCA Aisyiyah Sugio"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#1C2620] outline-none transition placeholder:text-gray-400 focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
          />
        </div>

        {/* Content */}
        <div className="mt-6">
          <label
            htmlFor="profile-content"
            className="mb-2 block text-sm font-medium text-[#1C2620]"
          >
            Isi Profil
          </label>

          <textarea
            id="profile-content"
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Tulis informasi mengenai PCA Aisyiyah Sugio..."
            rows={12}
            className="w-full resize-y rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm leading-6 text-[#1C2620] outline-none transition placeholder:text-gray-400 focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
          />

          <p className="mt-2 text-xs text-gray-400">
            Gunakan paragraf baru untuk memisahkan bagian
            informasi.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-gray-400">
            {profile?.updated_at
              ? `Terakhir diperbarui: ${profile.updated_at}`
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