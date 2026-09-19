const products = [
  {
    name: "Keripik Pisang Renyah",
    price: "Rp 15.000 / kemasan",
    icon: (
      <svg
        className="h-12 w-12 text-[color:var(--primary)]/40"
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
    ),
  },
  {
    name: "Sambal balado",
    price: "Rp 20.000 / botol",
    icon: (
      <svg
        className="h-12 w-12 text-[color:var(--primary)]/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3c-4 3-6 6.5-6 10a6 6 0 0012 0c0-3.5-2-7-6-10z"
        />
      </svg>
    ),
  },
  {
    name: "Kerajinan Anyaman Bambu",
    price: "Mulai Rp 35.000",
    icon: (
      <svg
        className="h-12 w-12 text-[color:var(--primary)]/40"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.2"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 21V9l8-6 8 6v12M9 21v-6h6v6"
        />
      </svg>
    ),
  },
];

export default function ProductSection() {
  return (
    <section
        id="produk"
        className="bg-[color:var(--sage)]/60 py-16 md:py-20"
      >
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-3">
            <h2 className="font-display text-2xl text-[color:var(--primary-dark)] md:text-3xl">
              Produk binaan
            </h2>

            <p className="max-w-xs text-sm text-[color:var(--ink)]/60">
              Hasil usaha kelompok binaan ibu-ibu Aisyiyah Sugio
            </p>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <article key={product.name} className="group">
                <div className="placeholder-tile flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl">
                  {product.icon}
                </div>

                <div className="flex items-baseline justify-between pt-4">
                  <h3 className="font-display text-lg text-[color:var(--primary-dark)]">
                    {product.name}
                  </h3>
                </div>

                <p className="mt-1 text-sm text-[color:var(--ink)]/60">
                  {product.price}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>
  );
}