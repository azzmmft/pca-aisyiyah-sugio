import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PCA Aisyiyah Sugio",
  description:
    "Pimpinan Cabang Aisyiyah Sugio — informasi kegiatan, dakwah, sosial, dan produk binaan.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${fraunces.variable} ${jakarta.variable}`}>
        {children}
      </body>
    </html>
  );
}