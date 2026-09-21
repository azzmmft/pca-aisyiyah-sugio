"use client";

import { useEffect, useRef, useState } from "react";

type Agenda = {
  id: number;
  title: string;
  description?: string | null;
  date: string;
  location?: string | null;
  created_at?: string;
};

function formatAgendaDate(dateString: string) {
  const date = new Date(`${dateString}T00:00:00`);

  return {
    day: date.toLocaleDateString("id-ID", {
      day: "2-digit",
    }),
    monthYear: date.toLocaleDateString("id-ID", {
      month: "short",
      year: "numeric",
    }),
  };
}

export default function AgendaSection() {
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchAgendas() {
      try {
        setLoading(true);

        const response = await fetch("/api/agendas");

        if (!response.ok) {
          throw new Error("Gagal mengambil data agenda");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || "Gagal mengambil data agenda");
        }

        setAgendas(data.data || []);
      } catch (error) {
        console.error("Fetch agendas error:", error);
        setError("Agenda belum dapat dimuat.");
      } finally {
        setLoading(false);
      }
    }

    fetchAgendas();
  }, []);

  const upcomingAgendas = agendas.filter((agenda) => {
    const agendaDate = new Date(`${agenda.date}T23:59:59`);
    return agendaDate >= new Date();
  });

  function scrollAgendas(direction: "left" | "right") {
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
      id="agenda"
      className="bg-[color:var(--cream)] py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-[color:var(--gold-dark)]">
              Agenda
            </p>

            <h2 className="font-display text-2xl text-[color:var(--primary-dark)] md:text-3xl">
              Agenda terdekat
            </h2>
          </div>

          <a
            href="/agenda"
            className="text-sm font-medium text-[color:var(--primary)] transition hover:text-[color:var(--gold-dark)]"
          >
            Lihat semua agenda →
          </a>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex gap-7 overflow-hidden">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="min-w-[85%] sm:min-w-[47%] lg:min-w-[31%]"
              >
                <div className="h-[250px] animate-pulse rounded-2xl bg-black/5" />
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-black/10 px-5 py-10 text-center">
            <p className="text-sm text-[color:var(--ink)]/60">
              {error}
            </p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && upcomingAgendas.length === 0 && (
          <div className="rounded-2xl border border-black/10 px-5 py-10 text-center">
            <p className="font-display text-lg text-[color:var(--primary-dark)]">
              Belum ada agenda terdekat
            </p>

            <p className="mt-2 text-sm text-[color:var(--ink)]/55">
              Agenda kegiatan akan ditampilkan di sini.
            </p>
          </div>
        )}

        {/* Agenda carousel */}
        {!loading && !error && upcomingAgendas.length > 0 && (
          <>
            <div className="relative">
              <div
                ref={sliderRef}
                className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {upcomingAgendas.map((agenda) => {
                  const formattedDate = formatAgendaDate(agenda.date);

                  return (
                    <article
                      key={agenda.id}
                      className="group min-w-[85%] snap-start sm:min-w-[47%] lg:min-w-[31%]"
                    >
                      <div className="flex h-full min-h-[250px] flex-col rounded-2xl border border-black/10 bg-white/50 p-6 transition duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-sm">
                        {/* Date */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="font-display text-4xl leading-none text-[color:var(--primary)]">
                              {formattedDate.day}
                            </div>

                            <div className="mt-1 text-xs capitalize tracking-wide text-[color:var(--ink)]/50">
                              {formattedDate.monthYear}
                            </div>
                          </div>

                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--sage)] text-sm text-[color:var(--primary)]">
                            →
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="my-5 h-px bg-black/10" />

                        {/* Content */}
                        <div className="flex flex-1 flex-col">
                          <h3 className="font-display text-lg leading-snug text-[color:var(--primary-dark)]">
                            {agenda.title}
                          </h3>

                          {agenda.description && (
                            <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[color:var(--ink)]/55">
                              {agenda.description}
                            </p>
                          )}

                          {/* Location */}
                          {agenda.location && (
                            <div className="mt-auto pt-5">
                              <p className="text-xs text-[color:var(--ink)]/50">
                                <span className="mr-1">📍</span>
                                {agenda.location}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Navigation */}
              {upcomingAgendas.length > 3 && (
                <div className="mt-4 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => scrollAgendas("left")}
                    aria-label="Agenda sebelumnya"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--primary)]/15 bg-white/60 text-[color:var(--primary-dark)] transition hover:bg-white"
                  >
                    ←
                  </button>

                  <button
                    type="button"
                    onClick={() => scrollAgendas("right")}
                    aria-label="Agenda berikutnya"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:var(--primary)]/15 bg-white/60 text-[color:var(--primary-dark)] transition hover:bg-white"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}