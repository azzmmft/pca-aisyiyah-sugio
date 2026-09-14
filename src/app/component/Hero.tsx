export default function Hero() {
  return (
    <section
        id="beranda"
        className="hero-pattern text-[color:var(--cream)]"
      >
        <div className="mx-auto max-w-6xl px-5 py-24 text-center md:px-8 md:py-32">
          <p className="rise-in mb-4 text-sm tracking-wide text-[color:var(--cream)]/70">
            Sugio, Lamongan · Jawa Timur
          </p>

          <h1 className="rise-in d1 mx-auto max-w-3xl font-display text-4xl font-medium leading-[1.08] sm:text-5xl md:text-6xl">
            Selamat datang di PCA Aisyiyah Sugio
          </h1>

          <p className="rise-in d2 mx-auto mt-6 max-w-xl text-base text-[color:var(--cream)]/80 md:text-lg">
            Pusat informasi kegiatan dakwah, sosial, dan produk binaan usaha
            perempuan di lingkungan Cabang Aisyiyah Sugio.
          </p>

          <a
            href="#produk"
            className="rise-in d3 mt-9 inline-block rounded-full bg-[color:var(--gold)] px-8 py-3.5 text-sm font-semibold text-[color:var(--primary-dark)] transition-colors hover:bg-[color:var(--gold-dark)]"
          >
            Lihat produk binaan
          </a>
        </div>
      </section>
  );
}