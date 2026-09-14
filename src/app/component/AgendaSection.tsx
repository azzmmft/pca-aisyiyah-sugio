const agendas = [
  {
    day: "13",
    date: "Sep 2026",
    title: "Rapat Pimpinan Cabang",
    detail: "09.00 · Kantor Sekretariat PCA Sugio",
  },
  {
    day: "15",
    date: "Sep 2026",
    title: "Lomba Tumpeng Antar Ranting",
    detail: "13.00 · Balai Desa Sugio",
  },
  {
    day: "17",
    date: "Sep 2026",
    title: "Pelatihan UMKM & Pemasaran Digital",
    detail: "08.30 · Aula PCA Sugio",
  },
];

export default function AgendaSection() {
  return (
    <section
        id="agenda"
        className="mx-auto max-w-6xl px-5 py-16 md:px-8 md:py-20"
      >
        <h2 className="mb-10 font-display text-2xl text-[color:var(--primary-dark)] md:text-3xl">
          Agenda terdekat
        </h2>

        <div className="divide-y divide-black/10 border-b border-t border-black/10">
          {agendas.map((agenda) => (
            <div
              key={agenda.title}
              className="flex items-center gap-5 py-5 md:gap-8"
            >
              <div className="w-16 shrink-0 text-center">
                <div className="font-display text-2xl leading-none text-[color:var(--primary)]">
                  {agenda.day}
                </div>

                <div className="mt-1 text-[11px] text-[color:var(--ink)]/50">
                  {agenda.date}
                </div>
              </div>

              <div className="flex-1 border-l border-[color:var(--gold)]/50 pl-5">
                <h3 className="text-[15px] font-medium">{agenda.title}</h3>

                <p className="mt-0.5 text-sm text-[color:var(--ink)]/55">
                  {agenda.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
  );
}