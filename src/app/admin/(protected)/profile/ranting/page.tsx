"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

type Branch = {
  id: number;
  name: string;
  description?: string | null;
  address?: string | null;
  image_url?: string | null;
  sort_order: number;
  created_at?: string;
};

const emptyForm = {
  name: "",
  description: "",
  address: "",
  image_url: "",
  sort_order: 1,
};

export default function RantingAdminPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchBranches() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/branches");

      if (!response.ok) {
        throw new Error("Gagal mengambil data ranting");
      }

      const data = (await response.json()) as Record<string, any>;

      if (!data.success) {
        throw new Error(
          data.error || "Gagal mengambil data ranting"
        );
      }

      setBranches(data.branches || []);
    } catch (error) {
      console.error("Fetch branches error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data ranting"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBranches();
  }, []);

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "sort_order"
          ? Number(value)
          : value,
    }));
  }

  async function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setSuccess("");

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(file.type)
    ) {
      setError(
        "Format gambar harus JPG, PNG, atau WEBP."
      );
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

      const formData = new FormData();

      formData.append("file", file);
      formData.append("folder", "branches");

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

      setForm((current) => ({
        ...current,
        image_url: data.key,
      }));

      setSuccess("Gambar berhasil diupload.");
    } catch (error) {
      console.error("Upload branch image error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengupload gambar"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const isEditing = editingId !== null;

      const response = await fetch(
        isEditing
          ? `/api/branches?id=${editingId}`
          : "/api/branches",
        {
          method: isEditing ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Gagal menyimpan data ranting"
        );
      }

      setSuccess(
        isEditing
          ? "Data ranting berhasil diperbarui."
          : "Ranting berhasil ditambahkan."
      );

      resetForm();
      await fetchBranches();
    } catch (error) {
      console.error("Save branch error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan data ranting"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(branch: Branch) {
    setEditingId(branch.id);

    setForm({
      name: branch.name,
      description: branch.description || "",
      address: branch.address || "",
      image_url: branch.image_url || "",
      sort_order: branch.sort_order,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus ranting ini?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/branches?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Gagal menghapus ranting"
        );
      }

      setSuccess("Ranting berhasil dihapus.");

      if (editingId === id) {
        resetForm();
      }

      await fetchBranches();
    } catch (error) {
      console.error("Delete branch error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus ranting"
      );
    }
  }

  function resetForm() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      sort_order: branches.length + 1,
    });
  }

  function getImageUrl(
    imageUrl?: string | null
  ) {
    if (!imageUrl) return "";

    return `/api/images/${imageUrl}`;
  }

  return (
    <div className="-ml-64 w-[calc(100%+16rem)] max-w-none p-4 pt-20 md:ml-0 md:w-auto md:max-w-6xl md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
          Profil Organisasi
        </p>

        <h1 className="mt-2 font-display text-3xl text-[color:var(--primary-dark)]">
          Ranting
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink)]/55">
          Kelola informasi ranting Aisyiyah yang berada
          dalam wilayah PCA Sugio.
        </p>
      </div>

      {/* NOTIFICATION */}
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

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="mb-10 rounded-2xl border border-[color:var(--primary)]/10 bg-white p-6 shadow-sm md:p-8"
      >
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-xl text-[color:var(--primary-dark)]">
              {editingId
                ? "Edit Ranting"
                : "Tambah Ranting"}
            </h2>

            <p className="mt-1 text-sm text-[color:var(--ink)]/50">
              Isi informasi ranting di bawah ini.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm font-medium text-[color:var(--primary)] hover:text-[color:var(--gold-dark)]"
            >
              Batal Edit
            </button>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* NAME */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-medium text-[color:var(--ink)]"
            >
              Nama Ranting
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Ranting Aisyiyah Sugio"
              required
              className="w-full rounded-xl border border-[color:var(--primary)]/15 bg-[color:var(--cream)]/40 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/10"
            />
          </div>

          {/* ADDRESS */}
          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-medium text-[color:var(--ink)]"
            >
              Alamat
              <span className="ml-1 text-xs font-normal text-[color:var(--ink)]/40">
                (opsional)
              </span>
            </label>

            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="Contoh: Desa Sugio, Kecamatan Sugio"
              className="w-full rounded-xl border border-[color:var(--primary)]/15 bg-[color:var(--cream)]/40 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/10"
            />
          </div>

          {/* SORT */}
          <div>
            <label
              htmlFor="sort_order"
              className="mb-2 block text-sm font-medium text-[color:var(--ink)]"
            >
              Urutan Tampil
            </label>

            <input
              id="sort_order"
              name="sort_order"
              type="number"
              min="1"
              value={form.sort_order}
              onChange={handleChange}
              className="w-full rounded-xl border border-[color:var(--primary)]/15 bg-[color:var(--cream)]/40 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/10"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-medium text-[color:var(--ink)]"
            >
              Deskripsi
              <span className="ml-1 text-xs font-normal text-[color:var(--ink)]/40">
                (opsional)
              </span>
            </label>

            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tuliskan informasi singkat mengenai ranting..."
              className="w-full resize-y rounded-xl border border-[color:var(--primary)]/15 bg-[color:var(--cream)]/40 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/10"
            />
          </div>

          {/* IMAGE */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[color:var(--ink)]">
              Foto / Gambar
              <span className="ml-1 text-xs font-normal text-[color:var(--ink)]/40">
                (opsional)
              </span>
            </label>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {form.image_url ? (
                <div className="h-32 w-48 shrink-0 overflow-hidden rounded-xl bg-[color:var(--sage)]">
                  <img
                    src={getImageUrl(form.image_url)}
                    alt="Preview ranting"
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="flex h-32 w-48 shrink-0 items-center justify-center rounded-xl bg-[color:var(--sage)] text-4xl text-[color:var(--primary)]/20">
                  🏠
                </div>
              )}

              <div>
                <label
                  htmlFor="branch-image"
                  className={`inline-flex cursor-pointer rounded-xl border border-[color:var(--primary)]/15 px-5 py-3 text-sm font-medium text-[color:var(--primary)] transition hover:bg-[color:var(--sage)] ${
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
                  id="branch-image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="hidden"
                />

                <p className="mt-2 text-xs leading-5 text-[color:var(--ink)]/40">
                  JPG, PNG, atau WEBP. Maksimal 5 MB.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTON */}
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="w-full rounded-xl border border-[color:var(--primary)]/15 px-5 py-3 text-sm font-medium text-[color:var(--primary)] transition hover:bg-[color:var(--sage)] sm:w-auto"
            >
              Batal
            </button>
          )}

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full rounded-xl bg-[color:var(--primary)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[color:var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          >
            {saving
              ? "Menyimpan..."
              : editingId
                ? "Simpan Perubahan"
                : "Tambah Ranting"}
          </button>
        </div>
      </form>

      {/* LIST */}
      <div>
        <div className="mb-5">
          <h2 className="font-display text-2xl text-[color:var(--primary-dark)]">
            Daftar Ranting
          </h2>

          <p className="mt-1 text-sm text-[color:var(--ink)]/50">
            {branches.length} ranting terdaftar.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-80 animate-pulse rounded-2xl bg-[color:var(--primary)]/10"
              />
            ))}
          </div>
        ) : branches.length === 0 ? (
          <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white px-6 py-12 text-center">
            <p className="text-sm text-[color:var(--ink)]/55">
              Belum ada data ranting.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {branches.map((branch) => (
              <article
                key={branch.id}
                className="overflow-hidden rounded-2xl border border-[color:var(--primary)]/10 bg-white shadow-sm"
              >
                <div className="h-48 bg-[color:var(--sage)]">
                  {branch.image_url ? (
                    <img
                      src={getImageUrl(branch.image_url)}
                      alt={branch.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-5xl text-[color:var(--primary)]/20">
                      🏠
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-[color:var(--gold-dark)]">
                    #{branch.sort_order}
                  </p>

                  <h3 className="mt-2 font-display text-xl text-[color:var(--primary-dark)]">
                    {branch.name}
                  </h3>

                  {branch.address && (
                    <p className="mt-2 text-xs text-[color:var(--ink)]/50">
                      {branch.address}
                    </p>
                  )}

                  {branch.description && (
                    <p className="mt-3 line-clamp-3 text-sm leading-6 text-[color:var(--ink)]/55">
                      {branch.description}
                    </p>
                  )}

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(branch)}
                      className="flex-1 rounded-lg border border-[color:var(--primary)]/15 px-3 py-2 text-xs font-medium text-[color:var(--primary)] transition hover:bg-[color:var(--sage)]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(branch.id)
                      }
                      className="flex-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 transition hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-end">
        <a
          href="/profil/ranting"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-medium text-[color:var(--primary)] transition hover:text-[color:var(--gold-dark)]"
        >
          Lihat Halaman Publik →
        </a>
      </div>
    </div>
  );
}