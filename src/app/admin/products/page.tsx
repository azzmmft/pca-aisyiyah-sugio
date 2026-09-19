"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

type ProductForm = {
  name: string;
  price: string;
  description: string;
};

const emptyForm: ProductForm = {
  name: "",
  price: "",
  description: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // GET PRODUCTS
  // =========================
  async function fetchProducts() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/products");

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal mengambil data produk");
      }

      setProducts(data.products);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengambil data produk"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  // =========================
  // FORM INPUT
  // =========================
  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  // =========================
  // OPEN ADD FORM
  // =========================
  function handleAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
    setShowForm(true);
  }

  // =========================
  // OPEN EDIT FORM
  // =========================
  function handleEdit(product: Product) {
    setEditingId(product.id);

    setForm({
      name: product.name,
      price: product.price,
      description: product.description || "",
    });

    setMessage("");
    setError("");
    setShowForm(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // =========================
  // CLOSE FORM
  // =========================
  function handleCancel() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  // =========================
  // SAVE PRODUCT
  // =========================
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!form.name.trim() || !form.price.trim()) {
      setError("Nama produk dan harga wajib diisi.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const method = editingId ? "PUT" : "POST";

      const url = editingId
        ? `/api/products?id=${editingId}`
        : "/api/products";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          price: form.price,
          description: form.description,
          image_url: null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal menyimpan produk");
      }

      setMessage(
        editingId
          ? "Produk berhasil diperbarui."
          : "Produk berhasil ditambahkan."
      );

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);

      await fetchProducts();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menyimpan produk"
      );
    } finally {
      setSaving(false);
    }
  }

  // =========================
  // DELETE PRODUCT
  // =========================
  async function handleDelete(product: Product) {
    const confirmed = window.confirm(
      `Yakin ingin menghapus "${product.name}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `/api/products?id=${product.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal menghapus produk");
      }

      setMessage("Produk berhasil dihapus.");

      await fetchProducts();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Gagal menghapus produk"
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F0E4] px-4 py-8 text-[#1C2620] md:px-8">
      <div className="mx-auto max-w-6xl">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold uppercase tracking-[0.2em] text-[#C68A2E]">
              Admin Panel
            </p>

            <h1 className="text-3xl font-bold text-[#082F26]">
              Kelola Produk
            </h1>

            <p className="mt-2 text-sm text-gray-600">
              Tambahkan, ubah, atau hapus produk binaan Aisyiyah Sugio.
            </p>
          </div>

          <button
            onClick={handleAdd}
            className="rounded-xl bg-[#0B4F3F] px-5 py-3 font-semibold text-white transition hover:bg-[#082F26]"
          >
            + Tambah Produk
          </button>
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
        {showForm && (
          <section className="mb-8 rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-[#082F26]">
                {editingId ? "Edit Produk" : "Tambah Produk"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Isi informasi produk di bawah ini.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* NAMA */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-semibold"
                >
                  Nama Produk
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Contoh: Keripik Pisang Renyah"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
                />
              </div>

              {/* HARGA */}
              <div>
                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold"
                >
                  Harga
                </label>

                <input
                  id="price"
                  name="price"
                  type="text"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="Contoh: Rp 15.000 / kemasan"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
                />
              </div>

              {/* DESKRIPSI */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold"
                >
                  Deskripsi
                </label>

                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Deskripsi singkat produk..."
                  className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 outline-none transition focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
                />
              </div>

              {/* BUTTON */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-[#0B4F3F] px-6 py-3 font-semibold text-white transition hover:bg-[#082F26] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving
                    ? "Menyimpan..."
                    : editingId
                      ? "Simpan Perubahan"
                      : "Tambah Produk"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Batal
                </button>
              </div>
            </form>
          </section>
        )}

        {/* PRODUCT LIST */}
        <section className="rounded-2xl bg-white shadow-sm">

          <div className="border-b border-gray-100 px-6 py-5">
            <h2 className="font-bold text-[#082F26]">
              Daftar Produk
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {products.length} produk terdaftar
            </p>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Memuat produk...
            </div>
          ) : products.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Belum ada produk.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between"
                >
                  {/* INFO PRODUK */}
                  <div className="min-w-0">
                    <h3 className="font-bold text-[#082F26]">
                      {product.name}
                    </h3>

                    <p className="mt-1 font-semibold text-[#C68A2E]">
                      {product.price}
                    </p>

                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-sm text-gray-500">
                        {product.description}
                      </p>
                    )}
                  </div>

                  {/* ACTION */}
                  <div className="flex shrink-0 gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className="rounded-lg border border-[#0B4F3F] px-4 py-2 text-sm font-semibold text-[#0B4F3F] transition hover:bg-[#E7EFE9]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(product)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  );
}