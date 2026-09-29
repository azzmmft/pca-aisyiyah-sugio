"use client";

import { useEffect, useState } from "react";

type Activity = {
  id: number;
  title: string;
  description: string | null;
  image_url: string | null;
  created_at: string;
};

export default function KegiatanPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const response = await fetch("/api/activities");
        const data = (await response.json()) as Record<string, any>;

        if (data.success) {
          setActivities(data.activities);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadActivities();
  }, []);

  return (
    <main className="min-h-screen bg-[#F5F0E4]">
      <section className="bg-[#082F26] px-6 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#C68A2E]">
            Dokumentasi
          </p>

          <h1 className="mt-3 max-w-3xl font-[family-name:var(--font-fraunces)] text-4xl font-semibold leading-tight sm:text-5xl">
            Kegiatan PCA Aisyiyah Sugio
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base">
            Berbagai kegiatan, program, dan aktivitas
            PCA Aisyiyah Sugio dalam menjalankan gerakan
            dakwah, sosial, pendidikan, dan pemberdayaan
            masyarakat.
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-6xl">
          {loading ? (
            <div className="py-16 text-center text-sm text-[#1C2620]/60">
              Memuat kegiatan...
            </div>
          ) : activities.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#0B4F3F]/20 bg-white px-6 py-16 text-center">
              <p className="font-semibold text-[#082F26]">
                Belum ada dokumentasi kegiatan.
              </p>

              <p className="mt-2 text-sm text-[#1C2620]/60">
                Informasi kegiatan PCA Aisyiyah Sugio akan
                ditampilkan di halaman ini.
              </p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {activities.map((activity) => (
                <article
                  key={activity.id}
                  className="overflow-hidden rounded-3xl border border-[#0B4F3F]/10 bg-white shadow-sm"
                >
                  {activity.image_url ? (
                    <img
                      src={`/api/images/${activity.image_url}`}
                      alt={activity.title}
                      className="h-64 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-64 items-center justify-center bg-[#E7EFE9] text-6xl">
                      📷
                    </div>
                  )}

                  <div className="p-6">
                    <h2 className="font-[family-name:var(--font-fraunces)] text-2xl font-semibold text-[#082F26]">
                      {activity.title}
                    </h2>

                    {activity.description && (
                      <p className="mt-3 text-sm leading-7 text-[#1C2620]/65">
                        {activity.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}