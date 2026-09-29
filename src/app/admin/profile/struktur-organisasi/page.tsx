"use client";

import { ChangeEvent, useEffect, useState } from "react";

type OrganizationStructure = {
  id: number;
  image_url: string;
  updated_at?: string;
};

export default function StrukturOrganisasiAdminPage() {
  const [structure, setStructure] =
    useState<OrganizationStructure | null>(null);

  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchStructure() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/organization-structure"
        );

        if (!response.ok) {
          throw new Error(
            "Gagal mengambil data struktur organisasi"
          );
        }

        const data = (await response.json()) as Record<string, any>;

        if (!data.success) {
          throw new Error(
            data.error ||
              "Gagal mengambil data struktur organisasi"
          );
        }

        if (data.structure) {
          setStructure(data.structure);
          setImageUrl(data.structure.image_url || "");

          if (data.structure.image_url) {
            setPreviewUrl(
              `/api/images/${data.structure.image_url}`
            );
          }
        }
      } catch (error) {
        console.error(
          "Fetch organization structure error:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Gagal mengambil data struktur organisasi"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchStructure();
  }, []);

  async function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Format gambar harus JPG, PNG, atau WEBP.");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran gambar maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "folder",
        "organization-structure"
      );

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Gagal mengupload gambar"
        );
      }

      setImageUrl(data.key);

      setPreviewUrl(`/api/images/${data.key}`);

      setSuccess(
        "Gambar berhasil diupload. Klik Simpan Perubahan untuk menerapkannya."
      );
    } catch (error) {
      console.error("Upload structure error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengupload gambar"
      );

      setPreviewUrl("");
      setImageUrl("");
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    if (!imageUrl) {
      setError("Silakan upload gambar struktur organisasi terlebih dahulu.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(
        "/api/organization-structure",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            image_url: imageUrl,
          }),
        }
      );

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Gagal menyimpan struktur organisasi"
        );
      }

      setStructure((current) => ({
        id: current?.id || 1,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      }));

      setSuccess(
        "Struktur organisasi berhasil diperbarui."
      );
    } catch (error) {
      console.error("Save structure error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan struktur organisasi"
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-5xl">
        <div className="animate-pulse space-y-5">
          <div className="h-8 w-72 rounded bg-[color:var(--primary)]/10" />
          <div className="h-4 w-96 rounded bg-[color:var(--primary)]/10" />
          <div className="h-96 rounded-2xl bg-[color:var(--primary)]/10" />
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
          Struktur Organisasi
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink)]/55">
          Upload gambar struktur organisasi PCA Aisyiyah Sugio
          yang akan ditampilkan pada halaman publik.
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

      <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6">
          <h2 className="font-display text-xl text-[color:var(--primary-dark)]">
            Gambar Struktur Organisasi
          </h2>

          <p className="mt-1 text-sm text-[color:var(--ink)]/50">
            Gunakan gambar dengan resolusi yang cukup agar teks
            struktur tetap mudah dibaca.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-dashed border-[color:var(--primary)]/20 bg-[color:var(--cream)]/40">
          {previewUrl ? (
            <div className="bg-white p-4">
              <div className="flex min-h-72 items-center justify-center overflow-auto rounded-xl bg-[color:var(--cream)]/50 p-4">
                <img
                  src={previewUrl}
                  alt="Preview struktur organisasi PCA Aisyiyah Sugio"
                  className="max-h-[700px] w-auto max-w-full object-contain"
                />
              </div>
            </div>
          ) : (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[color:var(--sage)] text-2xl text-[color:var(--primary)]">
                ↑
              </div>

              <p className="text-sm font-medium text-[color:var(--ink)]">
                Belum ada gambar struktur organisasi
              </p>

              <p className="mt-1 text-xs text-[color:var(--ink)]/45">
                JPG, PNG, atau WEBP — maksimal 5 MB
              </p>
            </div>
          )}
        </div>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <label
              htmlFor="structure-image"
              className={`inline-flex cursor-pointer items-center justify-center rounded-xl border border-[color:var(--primary)]/15 px-5 py-3 text-sm font-medium text-[color:var(--primary)] transition hover:bg-[color:var(--sage)] ${
                uploading
                  ? "pointer-events-none opacity-50"
                  : ""
              }`}
            >
              {uploading
                ? "Mengupload..."
                : "Pilih Gambar"}
            </label>

            <input
              id="structure-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              disabled={uploading}
              className="hidden"
            />

            <p className="mt-2 text-xs text-[color:var(--ink)]/40">
              Upload gambar baru untuk mengganti gambar sebelumnya.
            </p>
          </div>

          <div className="flex gap-3">
            <a
              href="/profil/struktur-organisasi"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-[color:var(--primary)]/15 px-5 py-3 text-sm font-medium text-[color:var(--primary)] transition hover:bg-[color:var(--sage)]"
            >
              Lihat Halaman
            </a>

            <button
              type="button"
              onClick={handleSave}
              disabled={
                saving ||
                uploading ||
                !imageUrl
              }
              className="rounded-xl bg-[color:var(--primary)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[color:var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Menyimpan..."
                : "Simpan Perubahan"}
            </button>
          </div>
        </div>
      </div>

      {structure?.updated_at && (
        <p className="mt-5 text-right text-xs text-[color:var(--ink)]/40">
          Terakhir diperbarui:{" "}
          {new Date(structure.updated_at).toLocaleString(
            "id-ID"
          )}
        </p>
      )}
    </div>
  );
}