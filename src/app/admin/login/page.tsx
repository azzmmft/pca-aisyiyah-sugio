"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      const data: {
        success: boolean;
        error?: string;
      } = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Login gagal");
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F0E4] px-6">
      <div className="w-full max-w-md">

        {/* Logo / Brand */}
        <div className="mb-8 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#C68A2E]">
            PCA AISYIYAH SUGIO
          </p>

          <h1 className="mt-3 font-serif text-4xl font-bold text-[#082F26]">
            Admin Panel
          </h1>

          <p className="mt-3 text-sm text-[#1C2620]/60">
            Silakan masuk untuk mengelola website.
          </p>
        </div>

        {/* Login Card */}
        <div className="rounded-3xl bg-white p-8 shadow-sm">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Username */}
            <div>
              <label
                htmlFor="username"
                className="mb-2 block text-sm font-medium text-[#1C2620]"
              >
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) =>
                  setUsername(event.target.value)
                }
                placeholder="Masukkan username"
                autoComplete="username"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-[#1C2620]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Masukkan password"
                autoComplete="current-password"
                required
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#0B4F3F] focus:ring-2 focus:ring-[#0B4F3F]/10"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#0B4F3F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#082F26] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>

          </form>
        </div>

        <p className="mt-6 text-center text-xs text-gray-400">
          PCA Aisyiyah Sugio
        </p>

      </div>
    </main>
  );
}