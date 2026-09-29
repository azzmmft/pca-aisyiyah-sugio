"use client";

import { useEffect, useState } from "react";

type Agenda = {
  id: number;
  title: string;
  description: string | null;
  date: string;
  location: string | null;
  created_at: string;
};

const emptyForm = {
  title: "",
  description: "",
  date: "",
  location: "",
};

export default function AdminAgendasPage() {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function loadAgendas() {
    try {
      setLoading(true);

      const response = await fetch("/api/agendas");
      const result = (await response.json()) as Record<string, any>;

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Gagal mengambil data agenda"
        );
      }

      setAgendas(result.data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal mengambil data agenda"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAgendas();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  function startEdit(agenda: Agenda) {
    setEditingId(agenda.id);

    setForm({
      title: agenda.title,
      description: agenda.description || "",
      date: agenda.date,
      location: agenda.location || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!form.title.trim()) {
      setError("Judul agenda wajib diisi");
      return;
    }

    if (!form.date) {
      setError("Tanggal agenda wajib diisi");
      return;
    }

    try {
      setSaving(true);

      if (editingId) {
        const response = await fetch("/api/agendas", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            id: editingId,
          }),
        });

        const result = (await response.json()) as Record<string, any>;

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Gagal memperbarui agenda"
          );
        }

        setMessage("Agenda berhasil diperbarui");
      } else {
        const response = await fetch("/api/agendas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        const result = (await response.json()) as Record<string, any>;

        if (!response.ok || !result.success) {
          throw new Error(
            result.error || "Gagal menambahkan agenda"
          );
        }

        setMessage("Agenda berhasil ditambahkan");
      }

      resetForm();
      await loadAgendas();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan"
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin menghapus agenda ini?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setMessage("");

      const response = await fetch("/api/agendas", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const result = (await response.json()) as Record<string, any>;

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || "Gagal menghapus agenda"
        );
      }

      setMessage("Agenda berhasil dihapus");

      await loadAgendas();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus agenda"
      );
    }
  }

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#082F26]">
          Agenda
        </h1>

        <p className="mt-2 text-sm text-gray-600">
          Kelola jadwal dan agenda PCA Aisyiyah Sugio.
        </p>
      </div>

      {/* MESSAGE */}
      {message && (
        <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* FORM */}
      <div className="mb-10 rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-[#082F26]">
              {editingId
                ? "Edit Agenda"
                : "Tambah Agenda"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Isi informasi agenda yang akan ditampilkan
              di website.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              Batal Edit
            </button>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* JUDUL */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Judul Agenda
            </label>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Contoh: Rapat Pimpinan Cabang"
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#0B4F3F]"
            />
          </div>

          {/* TANGGAL & LOKASI */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tanggal
              </label>

              <input
                type="date"
                name="date"
                value={form.date}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#0B4F3F]"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Lokasi
              </label>

              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Contoh: Gedung PCA Sugio"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#0B4F3F]"
              />
            </div>
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Deskripsi
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Tuliskan informasi mengenai agenda..."
              className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-[#0B4F3F]"
            />
          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#0B4F3F] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#082F26] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Menyimpan..."
              : editingId
                ? "Simpan Perubahan"
                : "Tambah Agenda"}
          </button>
        </form>
      </div>

      {/* LIST */}
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-[#082F26]">
            Daftar Agenda
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            {agendas.length} agenda tersimpan.
          </p>
        </div>

        {loading ? (
          <p className="py-10 text-center text-sm text-gray-500">
            Memuat agenda...
          </p>
        ) : agendas.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 px-6 py-12 text-center">
            <p className="font-medium text-gray-600">
              Belum ada agenda
            </p>

            <p className="mt-1 text-sm text-gray-400">
              Tambahkan agenda pertama melalui form di
              atas.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {agendas.map((agenda) => (
              <div
                key={agenda.id}
                className="flex flex-col gap-5 rounded-xl border border-gray-200 p-5 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-semibold text-[#082F26]">
                    {agenda.title}
                  </h3>

                  <p className="mt-1 text-sm text-[#C68A2E]">
                    {agenda.date}
                  </p>

                  {agenda.location && (
                    <p className="mt-1 text-sm text-gray-500">
                      📍 {agenda.location}
                    </p>
                  )}

                  {agenda.description && (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                      {agenda.description}
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => startEdit(agenda)}
                    className="rounded-lg border border-[#0B4F3F] px-4 py-2 text-sm font-medium text-[#0B4F3F] hover:bg-[#E7EFE9]"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(agenda.id)
                    }
                    className="rounded-lg border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

