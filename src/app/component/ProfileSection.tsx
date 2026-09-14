export default function ProfileSection() {
  return (
    <section
        id="profil"
        className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20"
      >
        <div className="grid items-start gap-8 md:grid-cols-3 md:gap-10">
          <div>
            <h2 className="font-display text-2xl text-[color:var(--primary-dark)] md:text-3xl">
              Tentang kami
            </h2>
          </div>

          <div className="text-[15px] leading-relaxed text-[color:var(--ink)]/80 md:col-span-2">
            <p>
              Pimpinan Cabang Aisyiyah (PCA) Sugio adalah organisasi otonom
              perempuan Muhammadiyah yang bergerak di bidang dakwah, pendidikan,
              kesehatan, dan pemberdayaan ekonomi keluarga. Melalui program
              binaan UMKM, pengajian rutin, dan kegiatan sosial, PCA Sugio hadir
              mendampingi warga di tingkat kecamatan Sugio.
            </p>
          </div>
        </div>
      </section>
  );
}