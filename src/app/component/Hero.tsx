"use client";

import { useEffect, useRef } from "react";

/* Tombol yang sedikit "tertarik" ke arah kursor */
function Magnetic({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLAnchorElement>(null);

  const move = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.18}px, ${
      (e.clientY - r.top - r.height / 2) * 0.28
    }px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = "";
  };

  return (
    <a
      ref={ref}
      href={href}
      onMouseMove={move}
      onMouseLeave={leave}
      className={`${className} [transition:transform_0.25s_cubic-bezier(.2,.8,.2,1),background-color_0.3s,border-color_0.3s,color_0.3s]`}
    >
      {children}
    </a>
  );
}

const TITLE = "Selamat datang di PCA Aisyiyah Sugio".split(" ");
const LOGO = "/images/logo-putih.png";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Kursor -> CSS variable (tanpa re-render React) */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width;
        const y = (e.clientY - r.top) / r.height;
        el.style.setProperty("--mx", `${x * 100}%`);
        el.style.setProperty("--my", `${y * 100}%`);
        el.style.setProperty("--px", String((x - 0.5) * 2));
        el.style.setProperty("--py", String((y - 0.5) * 2));
      });
    };
    const onLeave = () => {
      el.style.setProperty("--px", "0");
      el.style.setProperty("--py", "0");
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="beranda"
      className="hero-pattern hero-root relative overflow-hidden text-[color:var(--cream)]"
    >
      <style>{`
        .hero-root { --mx: 50%; --my: 35%; --px: 0; --py: 0; }

        .hero-spot {
          background: radial-gradient(520px circle at var(--mx) var(--my), rgba(198,138,46,.14), transparent 65%);
        }
        .hero-grid {
          background-image:
            linear-gradient(rgba(255,255,255,.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.07) 1px, transparent 1px);
          background-size: 56px 56px;
          -webkit-mask-image: radial-gradient(300px circle at var(--mx) var(--my), #000, transparent 100%);
                  mask-image: radial-gradient(300px circle at var(--mx) var(--my), #000, transparent 100%);
        }

        /* Judul: kata naik satu per satu */
        .hero-word { display: inline-block; overflow: hidden; vertical-align: top; padding-bottom: .08em; }
        .hero-word > span {
          display: inline-block; transform: translateY(105%);
          animation: hero-rise .9s cubic-bezier(.2,.8,.2,1) forwards;
        }
        @keyframes hero-rise { to { transform: translateY(0); } }

        /* Logo besar di kanan (di-zoom, terpotong oleh tepi section) */
        .hero-stage {
          position: absolute; top: 50%; aspect-ratio: 1 / 1; pointer-events: none;
          width: min(120vw, 560px); right: -38vw; margin-top: calc(min(120vw, 560px) / -2);
        }
        @media (min-width: 768px) {
          .hero-stage { width: min(68vw, 980px); right: -15vw; margin-top: calc(min(68vw, 980px) / -2); }
        }
        .hero-tilt {
          position: absolute; inset: 0;
          transform: perspective(1000px) rotateX(calc(var(--py) * -7deg)) rotateY(calc(var(--px) * 7deg));
          transition: transform .45s cubic-bezier(.2,.8,.2,1);
        }
        .hero-logo, .hero-glow {
          position: absolute; inset: 0; background: url(${LOGO}) center / contain no-repeat;
        }
        .hero-logo {
          opacity: .5; filter: blur(1.6px);
          -webkit-mask-image: linear-gradient(90deg, transparent 2%, #000 38%);
                  mask-image: linear-gradient(90deg, transparent 2%, #000 38%);
          animation: hero-fade 1.6s ease-out both;
        }
        .hero-glow {
          opacity: .32; filter: blur(34px); transform: scale(1.05) translate(calc(var(--px) * 14px), calc(var(--py) * 14px));
          transition: transform .6s cubic-bezier(.2,.8,.2,1);
        }
        @keyframes hero-fade { from { opacity: 0; transform: scale(.96); } }

        /* Cincin orbit di sekeliling logo */
        .hero-ring {
          position: absolute; inset: 0; margin: auto; border-radius: 9999px;
          border: 1px solid rgba(255,255,255,.13); animation: hero-spin linear infinite;
        }
        .hero-ring::after {
          content: ""; position: absolute; top: -4px; left: 50%; width: 8px; height: 8px; margin-left: -4px;
          border-radius: 9999px; background: var(--gold); box-shadow: 0 0 18px 4px rgba(198,138,46,.55);
        }
        .hero-ring[data-dim]::after { background: rgba(255,255,255,.8); box-shadow: 0 0 12px 2px rgba(255,255,255,.35); }
        @keyframes hero-spin { to { transform: rotate(360deg); } }

        a:focus-visible { outline: 2px solid var(--gold); outline-offset: 3px; }

        @media (prefers-reduced-motion: reduce) {
          .hero-word > span, .hero-logo { animation: none; transform: none; }
          .hero-ring { animation: none; }
          .hero-tilt, .hero-glow { transition: none; }
        }
      `}</style>

      {/* Latar */}
      <div className="absolute -left-16 top-12 h-52 w-52 rounded-full bg-[color:var(--gold)]/20 blur-3xl float-slow" />
      <div className="hero-spot pointer-events-none absolute inset-0" />
      <div className="hero-grid pointer-events-none absolute inset-0" />

      {/* Logo + orbit */}
      <div aria-hidden className="hero-stage">
        <div className="hero-tilt">
          <div className="hero-glow" />
          <div className="hero-logo" />
          <div className="hero-ring" style={{ width: "122%", height: "122%", animationDuration: "60s" }} />
          <div className="hero-ring" data-dim style={{ width: "98%", height: "98%", animationDuration: "38s", animationDirection: "reverse" }} />
          <div className="hero-ring" style={{ width: "74%", height: "74%", animationDuration: "26s" }} />
        </div>
      </div>

      {/* Konten */}
      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-24 pt-32 md:px-8 md:pb-40 md:pt-48">
        <p className="reveal mb-5 inline-flex rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-[11px] font-medium tracking-[0.22em] text-[color:var(--cream)]/75 uppercase backdrop-blur">
          Sugio, Lamongan · Jawa Timur
        </p>

        <h1
          aria-label="Selamat datang di PCA Aisyiyah Sugio"
          className="max-w-3xl font-display text-4xl font-medium leading-[1.02] text-[color:var(--cream)] sm:text-5xl md:text-6xl"
        >
          {TITLE.map((w, i) => (
            <span key={i} aria-hidden className="hero-word mr-[0.25em]">
              <span style={{ animationDelay: `${0.15 + i * 0.09}s` }}>{w}</span>
            </span>
          ))}
        </h1>

        <p className="reveal reveal-delay-2 mt-6 max-w-xl text-base leading-8 text-[color:var(--cream)]/80 md:text-lg">
          Pusat informasi kegiatan dakwah, sosial, dan produk binaan usaha perempuan di lingkungan Cabang Aisyiyah Sugio.
        </p>

        <div className="reveal reveal-delay-3 mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Magnetic
            href="#produk"
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--gold)] px-7 py-3.5 text-sm font-semibold text-[color:var(--primary-dark)] shadow-[0_18px_32px_rgba(198,138,46,0.35)] hover:bg-[color:var(--gold-dark)] hover:text-white"
          >
            Lihat produk binaan
          </Magnetic>

          <Magnetic
            href="#profil"
            className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-[color:var(--cream)] backdrop-blur hover:border-white/30 hover:bg-white/10"
          >
            Profil kami
          </Magnetic>
        </div>
      </div>
    </section>
  );
}