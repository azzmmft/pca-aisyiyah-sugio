function InstagramIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 4v9.5a3.5 3.5 0 11-3.5-3.5c.3 0 .6.03.85.08M14 4c.3 2 1.8 3.5 4 3.7" />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12a8 8 0 10-14.9 4L4 20l4.2-1.1A8 8 0 0020 12z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7l9 6 9-6" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="kontak" className="relative bg-[color:var(--ink)] text-[color:var(--cream)]">
      <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[color:var(--primary)]/15 to-transparent" />

      <div className="relative mx-auto max-w-6xl px-5 py-14 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.2fr_0.8fr] md:gap-8">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--gold)]">
              Hubungi kami
            </p>
            <h2 className="font-display text-3xl text-[color:var(--cream)]">Bersama membangun masyarakat yang lebih maju.</h2>

            <p className="mt-4 max-w-md text-sm leading-relaxed text-[color:var(--cream)]/65">
              Kecamatan Sugio, Kabupaten Lamongan, Jawa Timur. Terbuka untuk kerja sama, konsultasi produk, dan informasi kegiatan.
            </p>
          </div>

          
            <div className="flex flex-col gap-4 text-sm">

              <a href="https://www.tiktok.com/@pcasugio" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-[color:var(--cream)]/80 transition hover:text-[color:var(--gold)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <TiktokIcon />
                </span>
                TikTok — @pcasugio
              </a>

              <a href="#" className="group flex items-center gap-3 text-[color:var(--cream)]/80 transition hover:text-[color:var(--gold)]">
                <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                  <WhatsappIcon />
                </span>
                WhatsApp — 0812-3456-7890
              </a>

            </div>
          
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-[color:var(--cream)]/40">
          © 2026 PCA Aisyiyah Sugio. Semua hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}