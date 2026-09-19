export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <p className="text-sm font-medium text-[#C68A2E]">
          ADMIN PANEL
        </p>

        <h1 className="mt-1 font-serif text-4xl font-bold text-[#082F26]">
          Dashboard
        </h1>

        <p className="mt-2 text-sm text-[#1C2620]/60">
          Kelola konten website PCA Aisyiyah Sugio dari sini.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Produk
          </p>

          <p className="mt-2 text-3xl font-bold text-[#082F26]">
            3
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Produk binaan
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Agenda
          </p>

          <p className="mt-2 text-3xl font-bold text-[#082F26]">
            3
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Agenda mendatang
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Berita
          </p>

          <p className="mt-2 text-3xl font-bold text-[#082F26]">
            0
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Artikel dipublikasikan
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Galeri
          </p>

          <p className="mt-2 text-3xl font-bold text-[#082F26]">
            0
          </p>

          <p className="mt-1 text-xs text-gray-400">
            Foto tersimpan
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-serif text-2xl font-bold text-[#082F26]">
          Selamat datang 👋
        </h2>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Panel ini digunakan untuk mengelola informasi yang
          ditampilkan pada website PCA Aisyiyah Sugio.
          Tambahkan produk, agenda, berita, kegiatan, dan
          dokumentasi galeri tanpa perlu mengubah kode website.
        </p>
      </div>
    </div>
  );
}