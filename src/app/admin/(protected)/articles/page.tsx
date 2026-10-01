"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  published_at: string | null;
  status: "draft" | "published";
  created_at: string;
  updated_at: string;
};

type ArticleForm = {
  title: string;
  excerpt: string;
  content: string;
  image_url: string;
  published_at: string;
  status: "draft" | "published";
};

const emptyForm: ArticleForm = {
  title: "",
  excerpt: "",
  content: "",
  image_url: "",
  published_at: "",
  status: "draft",
};

function getImageUrl(key: string | null) {
  if (!key) return "";
  return `/api/images/${key}`;
}

function formatDate(date: string | null) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function formatDateTimeLocal(date: string | null) {
  if (!date) return "";

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function ArticlesAdminPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [form, setForm] = useState<ArticleForm>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function loadArticles() {
    try {
      setLoading(true);

      const response = await fetch("/api/articles");
      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal mengambil data berita");
      }

      setArticles(data.articles || []);
    } catch (error) {
      console.error(error);
      alert(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data berita"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setSelectedFile(null);
    setPreviewUrl("");
  }

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      alert("Format foto harus JPG, PNG, atau WEBP");
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Ukuran foto maksimal 5 MB");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
  }

  async function uploadImage() {
    if (!selectedFile) return form.image_url;

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("folder", "articles");

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload foto gagal");
      }

      return data.key as string;
    } finally {
      setUploading(false);
    }
  }

  function handleEdit(article: Article) {
    setEditingId(article.id);

    setForm({
      title: article.title,
      excerpt: article.excerpt || "",
      content: article.content,
      image_url: article.image_url || "",
      published_at: formatDateTimeLocal(article.published_at),
      status: article.status,
    });

    setSelectedFile(null);
    setPreviewUrl(article.image_url ? getImageUrl(article.image_url) : "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      alert("Judul berita wajib diisi");
      return;
    }

    if (!form.content.trim()) {
      alert("Isi berita wajib diisi");
      return;
    }

    try {
      setSaving(true);

      let imageUrl = form.image_url;

      if (selectedFile) {
        imageUrl = await uploadImage();
      }

      const payload = {
        ...(editingId ? { id: editingId } : {}),
        title: form.title.trim(),
        excerpt: form.excerpt.trim(),
        content: form.content.trim(),
        image_url: imageUrl || null,
        published_at: form.published_at
          ? new Date(form.published_at).toISOString()
          : null,
        status: form.status,
      };

      const response = await fetch("/api/articles", {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan berita");
      }

      alert(
        editingId
          ? "Berita berhasil diperbarui"
          : "Berita berhasil ditambahkan"
      );

      resetForm();
      await loadArticles();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan berita"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Yakin ingin menghapus berita ini?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/articles?id=${id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus berita");
      }

      alert("Berita berhasil dihapus");

      if (editingId === id) {
        resetForm();
      }

      await loadArticles();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Gagal menghapus berita"
      );
    }
  }

  return (
    <main className="-ml-64 min-h-screen w-[calc(100%+16rem)] bg-[#F5F0E4] px-4 pb-8 pt-20 md:ml-0 md:w-auto md:px-8 md:py-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* HEADER */}
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C68A2E]">
            Admin
          </p>

          <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <h1 className="font-[family-name:var(--font-fraunces)] text-4xl font-semibold text-[#0B4F3F]">
                Berita
              </h1>

              <p className="mt-2 text-sm text-[#1C2620]/65">
                Kelola berita dan informasi PCA Aisyiyah Sugio.
              </p>
            </div>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl border border-[#0B4F3F]/20 bg-white px-5 py-3 text-sm font-semibold text-[#0B4F3F] transition hover:bg-[#E7EFE9]"
              >
                + Tambah Berita Baru
              </button>
            )}
          </div>
        </div>

        {/* FORM */}
        <section className="rounded-3xl bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#0B4F3F]">
              {editingId ? "Edit Berita" : "Tambah Berita"}
            </h2>

            <p className="mt-1 text-sm text-[#1C2620]/60">
              Isi informasi berita yang akan ditampilkan pada website.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TITLE */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-[#1C2620]"
              >
                Judul Berita
              </label>

              <input
                id="title"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Contoh: Pelatihan UMKM PCA Aisyiyah Sugio"
                className="w-full rounded-xl border border-[#0B4F3F]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
              />
            </div>

            {/* EXCERPT */}
            <div>
              <label
                htmlFor="excerpt"
                className="mb-2 block text-sm font-semibold text-[#1C2620]"
              >
                Ringkasan Berita
              </label>

              <textarea
                id="excerpt"
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows={3}
                placeholder="Ringkasan singkat yang akan muncul di halaman daftar berita."
                className="w-full resize-none rounded-xl border border-[#0B4F3F]/15 px-4 py-3 text-sm outline-none transition focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
              />
            </div>

            {/* CONTENT */}
            <div>
              <label
                htmlFor="content"
                className="mb-2 block text-sm font-semibold text-[#1C2620]"
              >
                Isi Berita
              </label>

              <textarea
                id="content"
                name="content"
                value={form.content}
                onChange={handleChange}
                rows={12}
                placeholder="Tulis isi berita di sini..."
                className="w-full resize-y rounded-xl border border-[#0B4F3F]/15 px-4 py-3 text-sm leading-7 outline-none transition focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
              />

              <p className="mt-2 text-xs text-[#1C2620]/50">
                Untuk sementara isi berita menggunakan teks biasa.
              </p>
            </div>

            {/* IMAGE */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-[#1C2620]">
                Foto Cover Berita
              </label>

              {previewUrl ? (
                <div className="overflow-hidden rounded-2xl border border-[#0B4F3F]/10 bg-[#E7EFE9]">
                  <div className="relative aspect-video w-full">
                    <img
                      src={previewUrl}
                      alt="Preview cover berita"
                      className="h-full w-full object-cover"
                    />

                    <div className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-[#0B4F3F] shadow-sm">
                      ✓ Foto dipilih
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 p-4">
                    <p className="truncate text-sm text-[#1C2620]/65">
                      {selectedFile?.name || "Foto cover tersimpan"}
                    </p>

                    <label
                      htmlFor="article-image"
                      className="shrink-0 cursor-pointer rounded-xl bg-[#0B4F3F] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#082F26]"
                    >
                      {uploading ? "Mengupload..." : "Ganti Foto"}
                    </label>
                  </div>
                </div>
              ) : (
                <label
                  htmlFor="article-image"
                  className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#0B4F3F]/20 bg-[#E7EFE9]/50 px-6 py-10 text-center transition hover:border-[#0B4F3F]/40 hover:bg-[#E7EFE9]"
                >
                  <div className="mb-3 text-4xl">📰</div>

                  <p className="font-semibold text-[#0B4F3F]">
                    Pilih Foto Cover Berita
                  </p>

                  <p className="mt-1 text-xs text-[#1C2620]/50">
                    JPG, PNG, atau WEBP · maksimal 5 MB
                  </p>
                </label>
              )}

              <input
                id="article-image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* STATUS + DATE */}
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label
                  htmlFor="status"
                  className="mb-2 block text-sm font-semibold text-[#1C2620]"
                >
                  Status
                </label>

                <select
                  id="status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#0B4F3F]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Publikasikan</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="published_at"
                  className="mb-2 block text-sm font-semibold text-[#1C2620]"
                >
                  Tanggal Publikasi
                </label>

                <input
                  id="published_at"
                  name="published_at"
                  type="datetime-local"
                  value={form.published_at}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[#0B4F3F]/15 bg-white px-4 py-3 text-sm outline-none focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
                />
              </div>
            </div>

            {/* ACTION */}
            <div className="flex flex-col gap-3 border-t border-[#0B4F3F]/10 pt-6 sm:flex-row">
              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-xl bg-[#0B4F3F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#082F26] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Menyimpan..."
                  : editingId
                    ? "Simpan Perubahan"
                    : "Simpan Berita"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-[#0B4F3F]/15 px-6 py-3 text-sm font-semibold text-[#0B4F3F] transition hover:bg-[#E7EFE9]"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </section>

        {/* LIST */}
        <section className="rounded-3xl bg-white p-5 shadow-sm md:p-7">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-[#0B4F3F]">
              Daftar Berita
            </h2>

            <p className="mt-1 text-sm text-[#1C2620]/60">
              Semua berita yang tersimpan di sistem.
            </p>
          </div>

          {loading ? (
            <div className="rounded-2xl bg-[#E7EFE9] p-8 text-center text-sm text-[#1C2620]/60">
              Memuat berita...
            </div>
          ) : articles.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#0B4F3F]/15 bg-[#E7EFE9]/40 p-10 text-center">
              <div className="text-4xl">📰</div>

              <p className="mt-3 font-semibold text-[#0B4F3F]">
                Belum ada berita
              </p>

              <p className="mt-1 text-sm text-[#1C2620]/55">
                Tambahkan berita pertama menggunakan form di atas.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article) => (
                <article
                  key={article.id}
                  className="flex flex-col gap-5 rounded-2xl border border-[#0B4F3F]/10 p-4 md:flex-row"
                >
                  {/* IMAGE */}
                  <div className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-[#E7EFE9] md:h-32 md:w-52">
                    {article.image_url ? (
                      <img
                        src={getImageUrl(article.image_url)}
                        alt={article.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-4xl">
                        📰
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          article.status === "published"
                            ? "bg-[#E7EFE9] text-[#0B4F3F]"
                            : "bg-[#F5F0E4] text-[#9C6E20]"
                        }`}
                      >
                        {article.status === "published"
                          ? "Published"
                          : "Draft"}
                      </span>

                      <span className="text-xs text-[#1C2620]/45">
                        {formatDate(article.published_at)}
                      </span>
                    </div>

                    <h3 className="mt-2 line-clamp-2 text-lg font-semibold text-[#0B4F3F]">
                      {article.title}
                    </h3>

                    {article.excerpt && (
                      <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#1C2620]/60">
                        {article.excerpt}
                      </p>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(article)}
                        className="rounded-lg bg-[#E7EFE9] px-4 py-2 text-xs font-semibold text-[#0B4F3F] transition hover:bg-[#0B4F3F] hover:text-white"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(article.id)}
                        className="rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-600 hover:text-white"
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