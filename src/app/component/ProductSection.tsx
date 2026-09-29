"use client";

import { useEffect, useState, useRef } from "react";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Reference & State untuk Carousel Scroll
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
      } catch (err) {
        console.error("Fetch products error:", err);
        setError("Produk belum dapat dimuat saat ini.");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Filter produk berdasarkan pencarian
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description &&
        p.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Helper untuk mengecek posisi scroll agar tombol panah aktif/non-aktif
  const checkScrollPosition = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollPosition();
    window.addEventListener("resize", checkScrollPosition);
    return () => window.removeEventListener("resize", checkScrollPosition);
  }, [filteredProducts]);

  // Fungsi Scroll Kiri / Kanan
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      // Scroll sejauh ukuran container yang sedang terlihat
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
      <main className="min-h-screen bg-[color:var(--sage)] pb-16 ">
      {/* Header Section dengan Subtle Glow Ambient */}
      <section 
      id="produk"
      className="relative overflow-hidden bg-gradient-to-b from-[color:var(--sage)]/40 via-[color:var(--sage)]/20 to-transparent py-16 md:py-16">
        <div className="relative mx-auto max-w-7xl px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--primary)]/15 bg-white/50 px-3.5 py-1 text-xs font-semibold tracking-wider text-[color:var(--primary-dark)] backdrop-blur-md">
                <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-[color:var(--gold)] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[color:var(--gold-dark)]" />
                EKONOMI KREATIF PEREMPUAN
              </span>

              <h1 className="mt-4 font-display text-4xl font-medium tracking-tight text-[color:var(--primary-dark)] md:text-5xl">
                Produk Binaan Aisyiyah Sugio
              </h1>

              <p className="mt-4 text-base leading-relaxed text-[color:var(--ink)]/70">
                Dukungan nyata bagi kemandirian ekonomi warga. Setiap pembelian
                berkontribusi langsung pada pemberdayaan UMKM perempuan di Sugio.
              </p>
            </div>

            {/* Field Pencarian Produk */}
            <div className="w-full md:w-72">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari produk binaan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-2xl border border-[color:var(--primary)]/15 bg-white/70 py-3 pl-10 pr-4 text-sm text-[color:var(--primary-dark)] placeholder-[color:var(--ink)]/40 backdrop-blur-md transition outline-none focus:border-[color:var(--gold)] focus:bg-white focus:ring-2 focus:ring-[color:var(--gold)]/20"
                />
                <svg
                  className="absolute left-3.5 top-3.5 h-4 w-4 text-[color:var(--ink)]/40"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="mx-auto max-w-7xl px-5 pt-12 md:px-8">
        
        {/* Carousel Header Controls (Panah Navigasi) */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div className="mb-6 flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wider text-[color:var(--primary-dark)]/70 uppercase">
              Menampilkan {filteredProducts.length} Produk
            </span>

            {/* Tombol Panah Kiri & Kanan */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                disabled={!canScrollLeft}
                aria-label="Scroll Kiri"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--primary)]/20 bg-white/70 text-[color:var(--primary-dark)] shadow-sm backdrop-blur-md transition hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={() => scroll("right")}
                disabled={!canScrollRight}
                aria-label="Scroll Kanan"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--primary)]/20 bg-white/70 text-[color:var(--primary-dark)] shadow-sm backdrop-blur-md transition hover:bg-white hover:shadow-md disabled:cursor-not-allowed disabled:opacity-30"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* State 1: Skeleton Loading */}
        {loading && (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
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

        {/* State 2: Error Message */}
        {!loading && error && (
          <div className="mx-auto max-w-md rounded-3xl border border-red-200 bg-red-50/50 p-8 text-center backdrop-blur-md">
            <svg
              className="mx-auto h-10 w-10 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="mt-3 text-sm font-medium text-red-800">{error}</p>
          </div>
        )}

        {/* State 3: Empty State */}
        {!loading && !error && filteredProducts.length === 0 && (
          <div className="mx-auto max-w-md rounded-3xl border border-[color:var(--primary)]/10 bg-white/50 p-10 text-center backdrop-blur-md">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--sage)] text-[color:var(--primary-dark)]">
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <h3 className="mt-4 font-display text-xl text-[color:var(--primary-dark)]">
              {searchQuery ? "Produk tidak ditemukan" : "Belum ada produk"}
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-[color:var(--ink)]/60">
              {searchQuery
                ? `Coba kata kunci lain selain "${searchQuery}".`
                : "Produk hasil usaha binaan akan segera dipublikasikan di sini."}
            </p>
          </div>
        )}

        {/* State 4: Carousel Container (Scrollable Horizontal) */}
        {!loading && !error && filteredProducts.length > 0 && (
          <div
            ref={scrollRef}
            onScroll={checkScrollPosition}
            className="no-scrollbar flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-white/80 bg-white/60 p-4 shadow-[0_10px_30px_rgba(11,79,63,0.04)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-[color:var(--gold)]/40 hover:bg-white hover:shadow-[0_20px_40px_rgba(11,79,63,0.08)]
                  /* Responsif Lebar Kartu */
                  w-[85%] sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] flex-shrink-0 snap-start"
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

                  {/* Informasi Produk dengan Max Lines Constraint */}
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

                {/* Card Action Button (Order via WhatsApp / Detail) */}
                <div className="mt-5 pt-3 border-t border-black/5">
                  <a
                    href={`https://wa.me/085815144218?text=${encodeURIComponent(
                      `Halo PCA Aisyiyah Sugio, saya tertarik dengan produk ${product.name}`
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
                    Pesan Produk
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Link ke Halaman Semua Produk */}
        <div className="mt-12 text-center">
          <a
            href="/produk"
            className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--primary)]/15 bg-white/60 px-6 py-3 text-sm font-semibold text-[color:var(--primary-dark)] shadow-sm backdrop-blur-md transition hover:border-[color:var(--gold)] hover:bg-white hover:text-[color:var(--gold-dark)] hover:shadow-md"
          >
            Lihat semua produk
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}