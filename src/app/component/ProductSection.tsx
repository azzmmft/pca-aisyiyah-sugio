"use client";

import { useEffect, useRef, useState } from "react";

type Product = {
  id: number;
  name: string;
  price: string;
  description?: string | null;
  image_url?: string | null;
  created_at?: string;
};

export default function ProductSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sliderRef = useRef<HTMLDivElement>(null);

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

  function scrollProducts(direction: "left" | "right") {
    if (!sliderRef.current) return;

    const slider = sliderRef.current;

    const scrollAmount = slider.clientWidth * 0.85;

    slider.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }

  return (
    <section
      id="produk"
      className="bg-[color:var(--sage)]/60 py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
              Produk binaan
            </p>

            <h2 className="font-display text-2xl text-[color:var(--primary-dark)] md:text-3xl">
              Hasil usaha warga Aisyiyah
            </h2>
          </div>

          <p className="max-w-xs text-sm leading-relaxed text-[color:var(--ink)]/60">
            Hasil usaha kelompok binaan ibu-ibu Aisyiyah Sugio.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex gap-7 overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="min-w-[85%] sm:min-w-[47%] lg:min-w-[31%]"
              >
                <div className="aspect-[4/3] animate-pulse rounded-xl bg-white/50" />

                <div className="mt-4 h-5 w-2/3 animate-pulse rounded bg-white/50" />

                <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-white/50" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-[color:var(--primary)]/10 bg-white/40 px-5 py-8 text-center">
            <p className="text-sm text-[color:var(--ink)]/60">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl border border-[color:var(--primary)]/10 bg-white/40 px-5 py-10 text-center">
            <p className="font-display text-lg text-[color:var(--primary-dark)]">
              Belum ada produk
            </p>

            <p className="mt-2 text-sm text-[color:var(--ink)]/60">
              Produk binaan akan ditampilkan di sini.
            </p>
          </div>
        )}

        {/* Product slider */}
        {!loading && !error && products.length > 0 && (
          <>
            <div className="relative">
              <div
                ref={sliderRef}
                className="flex snap-x snap-mandatory gap-7 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {products.map((product) => (
                  <article
                    key={product.id}
                    className="group min-w-[85%] snap-start sm:min-w-[47%] lg:min-w-[31%]"
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-white/50">
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

                    {/* Product information */}
                    <div className="pt-4">
                      <h3 className="font-display text-lg text-[color:var(--primary-dark)]">
                        {product.name}
                      </h3>

                      <p className="mt-1 text-sm text-[color:var(--ink)]/60">
                        {product.price}
                      </p>

                      {product.description && (
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[color:var(--ink)]/50">
                          {product.description}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>

              {/* Navigation buttons */}
              {products.length > 3 && (
                <div className="mt-5 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => scrollProducts("left")}
                    aria-label="Produk sebelumnya"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--primary)]/15 bg-white/60 text-[color:var(--primary-dark)] transition hover:bg-white"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollProducts("right")}
                    aria-label="Produk berikutnya"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--primary)]/15 bg-white/60 text-[color:var(--primary-dark)] transition hover:bg-white"
                  >
                    →
                  </button>
                </div>
              )}
            </div>

            {/* View all */}
            <div className="mt-8 text-center">
              <a
                href="/produk"
                className="inline-flex items-center gap-2 text-sm font-medium text-[color:var(--primary)] transition hover:text-[color:var(--gold-dark)]"
              >
                Lihat semua produk
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}