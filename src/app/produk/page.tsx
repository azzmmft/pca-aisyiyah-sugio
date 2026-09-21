"use client";

import { useEffect, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: string;
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Gagal mengambil data produk");
        }

        setProducts(data.products || []);
      } catch (error) {
        console.error("Fetch products error:", error);
        setError("Produk belum dapat dimuat.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen bg-[color:var(--cream)]">
      {/* Header */}
      <section className="border-b border-black/5 bg-[color:var(--sage)]/50">
        <div className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-10">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
            Produk binaan
          </p>

          <h1 className="max-w-2xl font-display text-3xl leading-tight text-[color:var(--primary-dark)] md:text-5xl">
            Hasil usaha warga Aisyiyah Sugio
          </h1>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-[color:var(--ink)]/60 md:text-base">
            Kenali berbagai produk usaha yang dikembangkan oleh warga dan
            kelompok binaan Aisyiyah Cabang Sugio.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-16">
        {/* Loading */}
        {loading && (
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item}>
                <div className="aspect-[4/3] animate-pulse rounded-xl bg-black/5" />

                <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-black/5" />

                <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-black/5" />

                <div className="mt-3 h-4 w-full animate-pulse rounded bg-black/5" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-black/10 bg-white/40 px-5 py-12 text-center">
            <p className="text-sm text-[color:var(--ink)]/60">
              {error}
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-2xl border border-black/10 bg-white/40 px-5 py-8 text-center">
            <p className="font-display text-xl text-[color:var(--primary-dark)]">
              Belum ada produk
            </p>

            <p className="mt-2 text-sm text-[color:var(--ink)]/60">
              Produk binaan akan ditampilkan di halaman ini.
            </p>
          </div>
        )}

        {/* Product Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.id} className="group">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/60">
                  {product.image_url ? (
                    <img
                      src={`/api/images/${product.image_url}`}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <svg
                        className="h-12 w-12 text-[color:var(--primary)]/30"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4 7l8-4 8 4M4 7v10l8 4m-8-14l8 4m0 10l8-4V7m-8 14V11"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Information */}
                <div className="pt-4">
                  <h2 className="font-display text-xl text-[color:var(--primary-dark)]">
                    {product.name}
                  </h2>

                  <p className="mt-1 text-sm font-medium text-[color:var(--primary)]">
                    {product.price}
                  </p>

                  {product.description && (
                    <p className="mt-2 text-sm leading-relaxed text-[color:var(--ink)]/55">
                      {product.description}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}