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
  const WHATSAPP_NUMBER = "6285815144218";

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);

        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Gagal mengambil data produk");
        }

        const data = (await response.json()) as Record<string, any>;

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
        {/* Loading Skeleton disesuaikan ke struktur Card baru */}
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="flex flex-col h-[380px] rounded-3xl border border-black/5 bg-white/40 p-4 animate-pulse"
              >
                <div className="aspect-[4/3] w-full rounded-2xl bg-black/10" />
                <div className="mt-4 h-5 w-3/4 rounded-lg bg-black/10" />
                <div className="mt-2 h-4 w-1/2 rounded-lg bg-black/10" />
                <div className="mt-auto h-10 w-full rounded-xl bg-black/10" />
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
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article
                key={product.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/80 bg-white/60 p-4 shadow-[0_10px_30px_rgba(11,79,63,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--gold)]/40 hover:bg-white hover:shadow-[0_20px_40px_rgba(11,79,63,0.08)]"
              >
                <div>
                  {/* Container Gambar Presisi Ratio 4:3 */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[color:var(--sage)]/30">
                    {product.image_url ? (
                      <img
                        src={`/api/images/${product.image_url}`}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-[color:var(--primary)]/40">
                        <svg
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.2"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-[10px] font-medium tracking-wider uppercase">
                          Tidak Ada Foto
                        </span>
                      </div>
                    )}

                    {/* Price Badge Overlay */}
                    <div className="absolute bottom-3 left-3 rounded-xl border border-white/40 bg-black/40 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                      {product.price}
                    </div>
                  </div>

                  {/* Informasi Produk */}
                  <div className="pt-4 px-1">
                    <h2 className="font-display text-lg font-medium leading-snug text-[color:var(--primary-dark)] line-clamp-1 group-hover:text-[color:var(--gold-dark)] transition-colors">
                      {product.name}
                    </h2>

                    <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--ink)]/65 line-clamp-2 min-h-[2.25rem]">
                      {product.description ||
                        "Produk unggulan binaan Pimpinan Cabang Aisyiyah Sugio."}
                    </p>
                  </div>
                </div>

                {/* Card Action Button */}
                <div className="mt-5 pt-3 border-t border-black/5">
                  <a
                    href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
                      `Halo, saya ingin memesan produk "${product.name}" dari PCA Aisyiyah Sugio.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[color:var(--sage)]/50 py-2.5 text-xs font-semibold text-[color:var(--primary-dark)] transition duration-200 hover:bg-[color:var(--gold)] hover:text-[color:var(--primary-dark)]"
                  >
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                    </svg>
                    Pesan via WhatsApp
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}