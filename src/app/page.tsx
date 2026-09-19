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
      <Navbar />
      <Hero />
      <Profil />
      <Produk />
      <Agenda />
      <Kegiatan />
      <Footer />
    </main>
  );
}