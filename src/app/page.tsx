"use client";


import Navbar from "./component/Navbar";
import Hero from "./component/Hero";
import Profil from "./component/ProfileSection";
import Produk from "./component/ProductSection";
import Agenda from "./component/AgendaSection";
import Kegiatan from "./component/ActivitySection";
import Footer from "./component/Footer";

export default function Home() {
  return (
    <main className="antialiased">
      {/* HEADER */}
      <Navbar />

      {/* HERO */}
      <Hero />

      {/* PROFIL */}
      <Profil />

      {/* PRODUK */}
      <Produk />

      {/* AGENDA */}
      <Agenda />

      {/* KEGIATAN / GALERI */}
      <Kegiatan />

      {/* FOOTER / KONTAK */}
      <Footer />
    </main>
  );
}

