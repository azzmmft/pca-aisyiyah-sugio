"use client";

import { useState } from "react";

export default function TestUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleUpload() {
    if (!file) {
      setResult("Pilih foto terlebih dahulu.");
      return;
    }

    try {
      setLoading(true);
      setResult("");

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await response.json()) as Record<string, any>;

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Upload gagal");
      }

      setResult(
        `Upload berhasil! Key: ${data.key}`
      );
    } catch (error) {
      setResult(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F0E4] px-6 py-12">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm">

        <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-[#C68A2E]">
          Cloudinary Test
        </p>

        <h1 className="mb-6 text-2xl font-bold text-[#082F26]">
          Test Upload Foto
        </h1>

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setResult("");
          }}
          className="mb-5 block w-full text-sm"
        />

        {file && (
          <div className="mb-5 rounded-xl bg-[#E7EFE9] p-4 text-sm">
            <p>
              <strong>Nama:</strong> {file.name}
            </p>

            <p>
              <strong>Ukuran:</strong>{" "}
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>

            <p>
              <strong>Tipe:</strong> {file.type}
            </p>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full rounded-xl bg-[#0B4F3F] px-5 py-3 font-semibold text-white transition hover:bg-[#082F26] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Mengupload..." : "Upload ke Cloudinary"}
        </button>

        {result && (
          <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm break-all">
            {result}
          </div>
        )}
      </div>
    </main>
  );
}