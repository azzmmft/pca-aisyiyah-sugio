const activities = [
  "Pengajian rutin bulanan Ranting Sugio",
  "Pembagian sembako untuk lansia binaan",
  "Workshop kemasan produk UMKM",
];

export default function ActivitySection() {
  return (
    <section
        id="kegiatan"
        className="bg-[color:var(--primary-dark)] py-16 md:py-20"
      >
        <div id="galeri" className="mx-auto max-w-6xl px-5 md:px-8">
          <h2 className="mb-10 font-display text-2xl text-[color:var(--cream)] md:text-3xl">
            Kegiatan terbaru
          </h2>

          <div className="grid gap-6 sm:grid-cols-3">
            {activities.map((activity) => (
              <figure key={activity}>
                <div className="flex aspect-[4/3] items-center justify-center rounded-xl border border-white/10 bg-gradient-to-br from-[color:var(--primary)] to-[#0f382c]">
                  <svg
                    className="h-10 w-10 text-white/25"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7a2 2 0 012-2h2l2-2h6l2 2h2a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
                    />
                    <circle
                      cx="12"
                      cy="13"
                      r="3.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <figcaption className="mt-3 text-sm text-[color:var(--cream)]/70">
                  {activity}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
  );
}