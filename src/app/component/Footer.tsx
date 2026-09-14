function InstagramIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle
        cx="17.2"
        cy="6.8"
        r="0.6"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14 4v9.5a3.5 3.5 0 11-3.5-3.5c.3 0 .6.03.85.08M14 4c.3 2 1.8 3.5 4 3.7"
      />
    </svg>
  );
}

function WhatsappIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M20 12a8 8 0 10-14.9 4L4 20l4.2-1.1A8 8 0 0020 12z"
      />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 7l9 6 9-6"
      />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer id="kontak" className="bg-[color:var(--ink)] text-[color:var(--cream)]">
        <div className="mx-auto max-w-6xl px-5 py-14 md:px-8">
          <div className="grid gap-10 md:grid-cols-2 md:gap-8">
            <div>
              <h2 className="font-display text-2xl">Hubungi kami</h2>

              <p className="mt-3 max-w-sm text-sm leading-relaxed text-[color:var(--cream)]/60">
                Jl. Raya Sugio No. 12, Kecamatan Sugio, Kabupaten Lamongan,
                Jawa Timur. Terbuka untuk kerja sama, konsultasi produk, dan
                informasi kegiatan.
              </p>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <a
                href="#"
                className="flex items-center gap-3 transition-colors hover:text-[color:var(--gold)]"
              >
                <InstagramIcon />
                Instagram — @aisyiyah.sugio
              </a>

              <a
                href="#"
                className="flex items-center gap-3 transition-colors hover:text-[color:var(--gold)]"
              >
                <TiktokIcon />
                TikTok — @aisyiyahsugio
              </a>

              <a
                href="#"
                className="flex items-center gap-3 transition-colors hover:text-[color:var(--gold)]"
              >
                <WhatsappIcon />
                WhatsApp — 0812-3456-7890
              </a>

              <a
                href="#"
                className="flex items-center gap-3 transition-colors hover:text-[color:var(--gold)]"
              >
                <EmailIcon />
                Email — pca.sugio@aisyiyah.or.id
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