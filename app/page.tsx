// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { supabase, Moment } from "@/lib/supabase";
// import DayFilter from "@/components/DayFilter";
// import MomentCard from "@/components/MomentCard";
// import UploadModal from "@/components/UploadModal";

// const ROTATIONS: Array<"-3" | "-2" | "2" | "3" | "0"> = [
//   "-2",
//   "2",
//   "-3",
//   "3",
//   "0",
// ];

// export default function HomePage() {
//   const [moments, setMoments] = useState<Moment[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState("Semua");
//   const [uploadOpen, setUploadOpen] = useState(false);

//   useEffect(() => {
//     let isMounted = true;

//     async function fetchMoments() {
//       const { data, error } = await supabase
//         .from("moments")
//         .select("*")
//         .order("created_at", { ascending: false });

//       if (!isMounted) return;
//       if (!error && data) setMoments(data as Moment[]);
//       setLoading(false);
//     }

//     fetchMoments();

//     // Live update: foto baru langsung muncul buat semua orang yang lagi buka halaman
//     const channel = supabase
//       .channel("moments-realtime")
//       .on(
//         "postgres_changes",
//         { event: "INSERT", schema: "public", table: "moments" },
//         (payload) => {
//           setMoments((prev) => {
//             if (prev.some((m) => m.id === (payload.new as Moment).id))
//               return prev;
//             return [payload.new as Moment, ...prev];
//           });
//         },
//       )
//       .subscribe();

//     return () => {
//       isMounted = false;
//       supabase.removeChannel(channel);
//     };
//   }, []);

//   const filtered = useMemo(() => {
//     if (filter === "Semua") return moments;
//     return moments.filter((m) => m.day === filter);
//   }, [moments, filter]);

//   return (
//     <main className="min-h-screen">
//       {/* Header */}
//       <header className="border-b-4 border-ink bg-yolk px-4 md:px-10 py-4 flex items-center justify-between sticky top-0 z-30">
//         <a
//           href="https://quatrolympic.com"
//           className="font-display font-extrabold text-xl md:text-2xl"
//         >
//           Quatrolympic <span className="bg-ink text-cream px-1.5">19</span>
//         </a>
//         <a
//           href="https://quatrolympic.com"
//           className="font-display font-bold text-sm border-2 border-ink px-3 py-1.5 bg-cream hover:bg-white transition-colors"
//         >
//           ← Situs Utama
//         </a>
//       </header>

//       {/* Hero */}
//       <section className="px-4 md:px-10 pt-12 pb-8 max-w-5xl mx-auto text-center">
//         <span className="inline-block bg-lime border-4 border-ink shadow-brutal-sm px-4 py-1 font-mono font-bold text-xs md:text-sm uppercase mb-6 -rotate-2">
//           Upload Foto Kamu
//         </span>
//         <h1 className="font-display font-extrabold text-4xl md:text-6xl leading-[1.05]">
//           MOMEN-MOMEN
//           <br />
//           <span className="bg-pink px-2">QUATROLYMPIC 19</span>
//         </h1>
//         <p className="mt-5 max-w-xl mx-auto font-body text-base md:text-lg">
//           Punya foto seru selama Quatrolympic? Upload di sini, gak perlu login.
//           Isi username IG, pilih hari, kasih caption, terus foto kamu bakal
//           nongol buat semua orang.
//         </p>
//         <button
//           onClick={() => setUploadOpen(true)}
//           className="mt-7 inline-block bg-lime border-4 border-ink shadow-brutal font-display font-extrabold text-lg px-8 py-3 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
//         >
//           Upload Momen Kamu
//         </button>
//       </section>

//       {/* Filter */}
//       <section className="px-4 md:px-10 max-w-6xl mx-auto">
//         <DayFilter active={filter} onChange={setFilter} />
//       </section>

//       {/* Gallery */}
//       <section className="px-4 md:px-10 py-10 max-w-6xl mx-auto">
//         {loading ? (
//           <p className="font-mono text-center text-ink/60 py-16">
//             Memuat momen...
//           </p>
//         ) : filtered.length === 0 ? (
//           <div className="text-center py-16 border-4 border-dashed border-ink/40 mx-auto max-w-md">
//             <p className="font-display font-bold text-xl mb-2">
//               Belum ada momen di sini
//             </p>
//             <p className="font-body text-sm text-ink/70">
//               Jadilah yang pertama upload foto untuk{" "}
//               {filter === "Semua" ? "Quatrolympic 19" : filter}!
//             </p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
//             {filtered.map((m, i) => (
//               <MomentCard
//                 key={m.id}
//                 moment={m}
//                 rotate={ROTATIONS[i % ROTATIONS.length]}
//               />
//             ))}
//           </div>
//         )}
//       </section>

//       {/* Sponsor strip, matches main site footer treatment */}
//       <footer className="border-t-4 border-ink bg-ink text-cream py-4 overflow-hidden">
//         <p className="font-mono text-sm text-center">
//           Bagian dari Quatrolympic 19 · SMA Islam Al Azhar 4
//         </p>
//       </footer>

//       <UploadModal
//         open={uploadOpen}
//         onClose={() => setUploadOpen(false)}
//         onUploaded={(m) => setMoments((prev) => [m, ...prev])}
//       />

//       {/* Floating upload button on mobile for easy reach while scrolling */}
//       <button
//         onClick={() => setUploadOpen(true)}
//         className="md:hidden fixed bottom-5 right-5 z-20 bg-lime border-4 border-ink shadow-brutal-sm font-display font-extrabold px-5 py-3 rounded-full"
//       >
//         + Upload
//       </button>
//     </main>
//   );
// }

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase, Moment } from "@/lib/supabase";
import DayFilter from "@/components/DayFilter";
import MomentCard from "@/components/MomentCard";
import UploadModal from "@/components/UploadModal";
import Lightbox from "@/components/Lightbox";
import Link from "next/link";

const ROTATIONS: Array<"-3" | "-2" | "2" | "3" | "0"> = [
  "-2",
  "2",
  "-3",
  "3",
  "0",
];

export default function HomePage() {
  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Semua");
  const [uploadOpen, setUploadOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchMoments() {
      const { data, error } = await supabase
        .from("moments")
        .select("*")
        .order("created_at", { ascending: false });

      if (!isMounted) return;
      if (!error && data) setMoments(data as Moment[]);
      setLoading(false);
    }

    fetchMoments();

    // Live update: foto baru langsung muncul buat semua orang yang lagi buka halaman
    const channel = supabase
      .channel("moments-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "moments" },
        (payload) => {
          setMoments((prev) => {
            if (prev.some((m) => m.id === (payload.new as Moment).id))
              return prev;
            return [payload.new as Moment, ...prev];
          });
        },
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    if (filter === "Semua") return moments;
    return moments.filter((m) => m.day === filter);
  }, [moments, filter]);

  const closeLightbox = useCallback(() => setActiveIndex(null), []);

  const showPrev = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return prev === 0 ? filtered.length - 1 : prev - 1;
    });
  }, [filtered.length]);

  const showNext = useCallback(() => {
    setActiveIndex((prev) => {
      if (prev === null) return prev;
      return prev === filtered.length - 1 ? 0 : prev + 1;
    });
  }, [filtered.length]);

  // Esc buat nutup, panah kiri/kanan buat pindah foto
  useEffect(() => {
    if (activeIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "ArrowRight") showNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeIndex, closeLightbox, showPrev, showNext]);

  return (
    <main className="min-h-screen">
      {/* Header */}
      {/* <header className="border-b-4 border-ink bg-yolk px-4 md:px-10 py-4 flex items-center justify-between sticky top-0 z-30">
        <Link
          href="https://quatrolympic.com"
          className="font-display font-extrabold text-xl md:text-2xl"
        >
          Quatrolympic <span className="bg-ink text-cream px-1.5">19</span>
        </Link>
        <Link
          href="https://quatrolympic.com"
          className="font-display font-bold text-sm border-2 border-ink px-3 py-1.5 bg-cream hover:bg-white transition-colors"
        >
          ← Situs Utama
        </Link>
      </header> */}

      {/* Hero */}
      <section className="px-4 md:px-10 pt-12 pb-8 max-w-5xl mx-auto text-center">
        <button
          onClick={() => setUploadOpen(true)}
          className="mt-7 inline-block bg-lime border-4 border-ink shadow-brutal font-display font-extrabold text-lg px-8 py-3 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all"
        >
          Upload Momen Kamu
        </button>
      </section>

      {/* Filter */}
      <section className="px-4 md:px-10 max-w-6xl mx-auto">
        <DayFilter active={filter} onChange={setFilter} />
      </section>

      {/* Gallery */}
      <section className="px-4 md:px-10 py-10 max-w-6xl mx-auto">
        {loading ? (
          <p className="font-mono text-center text-ink/60 py-16">
            Memuat momen...
          </p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 border-4 border-dashed border-ink/40 mx-auto max-w-md">
            <p className="font-display font-bold text-xl mb-2">
              Belum ada momen di sini
            </p>
            <p className="font-body text-sm text-ink/70">
              Jadilah yang pertama upload foto untuk{" "}
              {filter === "Semua" ? "Quatrolympic 19" : filter}!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
            {filtered.map((m, i) => (
              <MomentCard
                key={m.id}
                moment={m}
                rotate={ROTATIONS[i % ROTATIONS.length]}
                onClick={() => setActiveIndex(i)}
              />
            ))}
          </div>
        )}
      </section>

      {/* Sponsor strip, matches main site footer treatment */}
      <footer className="border-t-4 border-ink bg-ink text-cream py-4 overflow-hidden">
        <p className="font-mono text-sm text-center">
          Bagian dari Quatrolympic 19 · SMA Islam Al Azhar 4
        </p>
      </footer>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploaded={(m) => setMoments((prev) => [m, ...prev])}
      />

      {activeIndex !== null && (
        <Lightbox
          moments={filtered}
          activeIndex={activeIndex}
          onClose={closeLightbox}
          onPrev={showPrev}
          onNext={showNext}
        />
      )}

      {/* Floating upload button on mobile for easy reach while scrolling */}
      <button
        onClick={() => setUploadOpen(true)}
        className="md:hidden fixed bottom-5 right-5 z-20 bg-lime border-4 border-ink shadow-brutal-sm font-display font-extrabold px-5 py-3 rounded-full"
      >
        + Upload
      </button>
    </main>
  );
}
