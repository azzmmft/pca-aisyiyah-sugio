"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useState,
} from "react";

type Member = {
  id: number;
  name: string;
  position: string;
  division?: string | null;
  photo_url?: string | null;
  sort_order: number;
  created_at?: string;
};

const emptyForm = {
  name: "",
  position: "",
  division: "",
  photo_url: "",
  sort_order: 1,
};

export default function KepengurusanAdminPage() {
  const [members, setMembers] = useState<Member[]>([]);

  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function fetchMembers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/organization-members"
      );

      if (!response.ok) {
        throw new Error(
          "Gagal mengambil data kepengurusan"
        );
      }

      const data = (await response.json()) as Record<string, any>;

      if (!data.success) {
        throw new Error(
          data.error ||
            "Gagal mengambil data kepengurusan"
        );
      }

      setMembers(data.members || []);
    } catch (error) {
      console.error("Fetch members error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data kepengurusan"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMembers();
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

  async function handlePhotoChange(
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
        "Format foto harus JPG, PNG, atau WEBP."
      );
      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Ukuran foto maksimal 5 MB.");
      event.target.value = "";
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("file", file);
      formData.append(
        "folder",
        "organization-members"
      );

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error || "Gagal mengupload foto"
        );
      }

      setForm((current) => ({
        ...current,
        photo_url: data.key,
      }));

      setSuccess(
        "Foto berhasil diupload."
      );
    } catch (error) {
      console.error("Upload member photo error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengupload foto"
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
          ? `/api/organization-members?id=${editingId}`
          : "/api/organization-members",
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
          data.error ||
            "Gagal menyimpan data pengurus"
        );
      }

      setSuccess(
        isEditing
          ? "Data pengurus berhasil diperbarui."
          : "Pengurus berhasil ditambahkan."
      );

      resetForm();

      await fetchMembers();
    } catch (error) {
      console.error("Save member error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan data pengurus"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(member: Member) {
    setEditingId(member.id);

    setForm({
      name: member.name,
      position: member.position,
      division: member.division || "",
      photo_url: member.photo_url || "",
      sort_order: member.sort_order,
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
      "Apakah Anda yakin ingin menghapus pengurus ini?"
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/organization-members?id=${id}`,
        {
          method: "DELETE",
        }
      );

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(
          data.error ||
            "Gagal menghapus pengurus"
        );
      }

      setSuccess("Pengurus berhasil dihapus.");

      if (editingId === id) {
        resetForm();
      }

      await fetchMembers();
    } catch (error) {
      console.error("Delete member error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus pengurus"
      );
    }
  }

  function resetForm() {
    setEditingId(null);

    setForm({
      ...emptyForm,
      sort_order: members.length + 1,
    });
  }

  function getPhotoUrl(
    photoUrl?: string | null
  ) {
    if (!photoUrl) return "";

    return `/api/images/${photoUrl}`;
  }

  return (
    <div className="-ml-64 w-[calc(100%+16rem)] p-4 pt-20 md:ml-0 md:w-auto md:p-8">
      {/* HEADER */}
      <div className="mb-8">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
          Profil Organisasi
        </p>

        <h1 className="mt-2 font-display text-3xl text-[color:var(--primary-dark)]">
          Kepengurusan
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-[color:var(--ink)]/55">
          Kelola data pengurus PCA Aisyiyah Sugio yang
          ditampilkan pada halaman publik.
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
                ? "Edit Pengurus"
                : "Tambah Pengurus"}
            </h2>

            <p className="mt-1 text-sm text-[color:var(--ink)]/50">
              Isi informasi pengurus di bawah ini.
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
              Nama
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Contoh: Siti Aminah"
              required
              className="w-full rounded-xl border border-[color:var(--primary)]/15 bg-[color:var(--cream)]/40 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/10"
            />
          </div>

          {/* POSITION */}
          <div>
            <label
              htmlFor="position"
              className="mb-2 block text-sm font-medium text-[color:var(--ink)]"
            >
              Jabatan
            </label>

            <input
              id="position"
              name="position"
              type="text"
              value={form.position}
              onChange={handleChange}
              placeholder="Contoh: Ketua"
              required
              className="w-full rounded-xl border border-[color:var(--primary)]/15 bg-[color:var(--cream)]/40 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/10"
            />
          </div>

          {/* DIVISION */}
          <div>
            <label
              htmlFor="division"
              className="mb-2 block text-sm font-medium text-[color:var(--ink)]"
            >
              Majelis / Divisi
              <span className="ml-1 text-xs font-normal text-[color:var(--ink)]/40">
                (opsional)
              </span>
            </label>

            <input
              id="division"
              name="division"
              type="text"
              value={form.division}
              onChange={handleChange}
              placeholder="Contoh: Majelis Pendidikan"
              className="w-full rounded-xl border border-[color:var(--primary)]/15 bg-[color:var(--cream)]/40 px-4 py-3 text-sm outline-none transition focus:border-[color:var(--gold)] focus:ring-2 focus:ring-[color:var(--gold)]/10"
            />
          </div>

          {/* SORT ORDER */}
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

          {/* PHOTO */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-sm font-medium text-[color:var(--ink)]">
              Foto
              <span className="ml-1 text-xs font-normal text-[color:var(--ink)]/40">
                (opsional)
              </span>
            </label>

            <div className="rounded-2xl border-2 border-dashed border-[color:var(--primary)]/15 bg-[color:var(--cream)]/30 p-5 transition hover:border-[color:var(--primary)]/30 hover:bg-[color:var(--sage)]/20">

              {/* PREVIEW */}
              {form.photo_url ? (
                <div className="mb-5 overflow-hidden rounded-xl border border-[color:var(--primary)]/10 bg-white">
                  <div className="relative">
                    <img
                      src={getPhotoUrl(form.photo_url)}
                      alt="Preview foto pengurus"
                      className="h-56 w-full object-cover"
                    />

                    <div className="absolute right-3 top-3 rounded-full bg-[color:var(--primary)] px-3 py-1.5 text-xs font-semibold text-white shadow-sm">
                      ✓ Foto sudah dipilih
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-5 flex min-h-48 items-center justify-center rounded-xl bg-[color:var(--sage)] text-center">
                  <div>
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
                      👤
                    </div>

                    <p className="mt-3 text-sm font-semibold text-[color:var(--primary)]">
                      Belum ada foto pengurus
                    </p>

                    <p className="mt-1 text-xs text-[color:var(--ink)]/50">
                      Tambahkan foto agar profil pengurus lebih mudah dikenali.
                    </p>
                  </div>
                </div>
              )}

              {/* CUSTOM FILE BUTTON */}
              <label
                htmlFor="member-photo"
                className={`group flex items-center justify-center gap-3 rounded-xl border border-[color:var(--primary)]/20 bg-white px-5 py-3.5 text-sm font-semibold text-[color:var(--primary)] shadow-sm transition ${
                  uploading
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-[color:var(--primary)] hover:bg-[color:var(--sage)] hover:shadow-md active:scale-[0.99]"
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
                  : form.photo_url
                    ? "Ganti Foto Pengurus"
                    : "Pilih Foto Pengurus"}
              </label>

              <input
                id="member-photo"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handlePhotoChange}
                disabled={uploading}
                className="hidden"
              />

              <p className="mt-3 text-center text-xs text-[color:var(--ink)]/40">
                JPG, PNG, atau WEBP · Maksimal 5 MB
              </p>

              {uploading && (
                <div className="mt-3 rounded-lg bg-[color:var(--sage)] px-4 py-3 text-center">
                  <p className="text-xs font-medium text-[color:var(--primary)]">
                    Sedang mengupload foto...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* FORM BUTTON */}
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
                : "Tambah Pengurus"}
          </button>
        </div>
      </form>

      {/* LIST */}
      <div>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl text-[color:var(--primary-dark)]">
              Daftar Pengurus
            </h2>

            <p className="mt-1 text-sm text-[color:var(--ink)]/50">
              {members.length} pengurus terdaftar.
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl bg-[color:var(--primary)]/10"
              />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div className="rounded-2xl border border-[color:var(--primary)]/10 bg-white px-6 py-12 text-center">
            <p className="text-sm text-[color:var(--ink)]/55">
              Belum ada data pengurus.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <article
                key={member.id}
                className="overflow-hidden rounded-2xl border border-[color:var(--primary)]/10 bg-white shadow-sm"
              >
                <div className="flex h-56 items-center justify-center bg-[color:var(--sage)]">
                  {member.photo_url ? (
                    <img
                      src={getPhotoUrl(member.photo_url)}
                      alt={member.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="text-5xl text-[color:var(--primary)]/20">
                      👤
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.15em] text-[color:var(--gold-dark)]">
                    #{member.sort_order}
                  </p>

                  <h3 className="mt-2 font-display text-xl text-[color:var(--primary-dark)]">
                    {member.name}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-[color:var(--primary)]">
                    {member.position}
                  </p>

                  {member.division && (
                    <p className="mt-1 text-xs text-[color:var(--ink)]/50">
                      {member.division}
                    </p>
                  )}

                  <div className="mt-5 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(member)}
                      className="flex-1 rounded-lg border border-[color:var(--primary)]/15 px-3 py-2 text-xs font-medium text-[color:var(--primary)] transition hover:bg-[color:var(--sage)]"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(member.id)
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
          href="/profil/kepengurusan"
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