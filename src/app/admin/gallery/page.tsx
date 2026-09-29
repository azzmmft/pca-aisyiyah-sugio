"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type GalleryItem = {
  id: number;
  title: string | null;
  image_url: string;
  created_at: string;
};

export default function GalleryAdminPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadGallery() {
    try {
      setLoading(true);

      const response = await fetch("/api/gallery");
      const data = (await response.json()) as Record<string, any>;

      if (data.success) {
        setItems(data.gallery);
      }
    } catch (error) {
      console.error(error);
      alert("Gagal mengambil data galeri");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadGallery();
  }, []);

  function resetForm() {
    setTitle("");
    setImageUrl("");
    setEditingId(null);
  }

  function startEdit(item: GalleryItem) {
    setEditingId(item.id);
    setTitle(item.title || "");
    setImageUrl(item.image_url);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", "gallery");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Upload foto gagal"
        );
      }

      setImageUrl(data.key);

      alert("Foto berhasil diupload");
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengupload foto"
      );
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!imageUrl) {
      alert("Foto wajib diupload");
      return;
    }

    try {
      setSaving(true);

      const method = editingId ? "PUT" : "POST";

      const url = editingId
        ? `/api/gallery?id=${editingId}`
        : "/api/gallery";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          image_url: imageUrl,
        }),
      });

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Gagal menyimpan foto"
        );
      }

      alert(
        editingId
          ? "Foto berhasil diperbarui"
          : "Foto berhasil ditambahkan"
      );

      resetForm();
      await loadGallery();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan foto"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Yakin ingin menghapus foto ini dari galeri?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/gallery?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Gagal menghapus foto"
        );
      }

      alert("Foto berhasil dihapus");

      await loadGallery();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus foto"
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F0E4] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C68A2E]">
            Admin
          </p>

          <h1 className="mt-2 font-[family-name:var(--font-fraunces)] text-3xl font-semibold text-[#082F26]">
            Galeri
          </h1>

          <p className="mt-2 text-sm text-[#1C2620]/70">
            Kelola dokumentasi foto kegiatan PCA Aisyiyah
            Sugio.
          </p>
        </div>

        {/* FORM */}
        <section className="mb-10 rounded-3xl border border-[#0B4F3F]/10 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-[#082F26]">
                {editingId
                  ? "Edit Foto"
                  : "Tambah Foto"}
              </h2>

              <p className="mt-1 text-sm text-[#1C2620]/60">
                Upload foto untuk ditampilkan pada galeri
                website.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-[#0B4F3F]/20 px-4 py-2 text-sm font-medium text-[#0B4F3F]"
              >
                Batal Edit
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#082F26]">
                Judul / Keterangan
              </label>

              <input
                type="text"
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Contoh: Pengajian Rutin Bulanan"
                className="w-full rounded-xl border border-[#0B4F3F]/15 px-4 py-3 text-sm outline-none transition focus:border-[#0B4F3F]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[#082F26]">
                Foto
              </label>

              {/* CUSTOM FILE BUTTON */}

              <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-5 transition hover:border-[#0B4F3F]/30 hover:bg-[#E7EFE9]/20">

                {imageUrl ? (
                  <div className="mb-5 overflow-hidden rounded-xl border border-gray-100 bg-white">
                    <div className="relative">
                      <img
                        src={`/api/images/${imageUrl}`}
                        alt="Preview kegiatan"
                        className="h-56 w-full object-cover"
                      />

                      <div className="absolute right-3 top-3 rounded-full bg-[#0B4F3F] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                        ✓ Foto sudah dipilih
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mb-5 flex min-h-48 items-center justify-center rounded-xl bg-[#E7EFE9] text-center">
                    <div>
                      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                        📷
                      </div>

                      <p className="mt-3 text-sm font-semibold text-[#0B4F3F]">
                        Belum ada foto kegiatan
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Pilih foto kegiatan untuk ditampilkan di website.
                      </p>
                    </div>
                  </div>
                )}

                <label
                  htmlFor="activity-image"
                  className={`group flex items-center justify-center gap-3 rounded-xl border border-[#0B4F3F]/20 bg-white px-5 py-3.5 text-sm font-semibold text-[#0B4F3F] shadow-sm transition ${
                    uploading
                      ? "cursor-not-allowed opacity-60"
                      : "cursor-pointer hover:border-[#0B4F3F] hover:bg-[#E7EFE9] hover:shadow-md active:scale-[0.99]"
                  }`}
                >
                  {/* Upload icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-5 w-5 transition group-hover:-translate-y-0.5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16V4"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m8 8 4-4 4 4"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
                    />
                  </svg>

                  {uploading
                    ? "Mengupload Foto..."
                    : imageUrl
                      ? "Ganti Foto Kegiatan"
                      : "Pilih Foto Kegiatan"}
                </label>

                <input
                  id="activity-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                />

                <p className="mt-3 text-center text-xs text-gray-400">
                  JPG, PNG, atau WEBP · Maksimal 5 MB
                </p>

                {uploading && (
                  <div className="mt-3 rounded-lg bg-[#E7EFE9] px-4 py-3 text-center">
                    <p className="text-xs font-medium text-[#0B4F3F]">
                      Sedang mengupload foto...
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || uploading}
              className="rounded-xl bg-[#0B4F3F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#082F26] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Menyimpan..."
                : editingId
                  ? "Simpan Perubahan"
                  : "Tambah ke Galeri"}
            </button>
          </form>
        </section>

        {/* LIST */}
        <section>
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-[#082F26]">
              Daftar Foto
            </h2>

            <p className="mt-1 text-sm text-[#1C2620]/60">
              {items.length} foto
            </p>
          </div>

          {loading ? (
            <div className="rounded-3xl bg-white p-10 text-center text-sm text-[#1C2620]/60">
              Memuat galeri...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#0B4F3F]/20 bg-white p-10 text-center">
              <p className="font-semibold text-[#082F26]">
                Belum ada foto
              </p>

              <p className="mt-1 text-sm text-[#1C2620]/60">
                Upload foto pertama menggunakan formulir
                di atas.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm"
                >
                  <img
                    src={`/api/images/${item.image_url}`}
                    alt={item.title || "Foto galeri"}
                    className="aspect-[4/3] w-full object-cover"
                  />

                  <div className="p-5">
                    {item.title && (
                      <h3 className="font-semibold text-[#082F26]">
                        {item.title}
                      </h3>
                    )}

                    <div className="mt-4 flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          startEdit(item)
                        }
                        className="rounded-xl bg-[#E7EFE9] px-4 py-2 text-sm font-semibold text-[#0B4F3F]"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-semibold text-red-600"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}