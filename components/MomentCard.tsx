// import { Moment } from "@/lib/supabase";

// const DAY_COLORS: Record<string, string> = {
//   "Day 1": "bg-lime",
//   "Day 2": "bg-sky",
//   "Day 3": "bg-yolk",
//   "Day 4": "bg-pink",
//   "Day 5": "bg-lime",
//   Closing: "bg-ink text-cream",
// };

// function timeAgo(dateStr: string) {
//   const diffMs = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diffMs / 60000);
//   if (mins < 1) return "baru saja";
//   if (mins < 60) return `${mins} menit lalu`;
//   const hours = Math.floor(mins / 60);
//   if (hours < 24) return `${hours} jam lalu`;
//   const days = Math.floor(hours / 24);
//   return `${days} hari lalu`;
// }

// const ROTATE_CLASSES: Record<string, string> = {
//   "-3": "-rotate-3",
//   "-2": "-rotate-2",
//   "2": "rotate-2",
//   "3": "rotate-3",
//   "0": "rotate-0",
// };

// export default function MomentCard({
//   moment,
//   rotate,
// }: {
//   moment: Moment;
//   rotate: "-3" | "-2" | "2" | "3" | "0";
// }) {
//   const dayClass = DAY_COLORS[moment.day] ?? "bg-lime";
//   const rotateClass = ROTATE_CLASSES[rotate] ?? "rotate-0";

//   return (
//     <div
//       className={`group relative ${rotateClass} hover:rotate-0 transition-transform duration-200`}
//     >
//       {/* pink offset shadow card, echoes the hero photo treatment on the main site */}
//       <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-sm bg-pink border-4 border-ink" />

//       <div className="relative bg-white border-4 border-ink rounded-sm p-3 pb-4">
//         <div className="aspect-square w-full overflow-hidden border-4 border-ink bg-cream">
//           {/* eslint-disable-next-line @next/next/no-img-element */}
//           <img
//             src={moment.image_url}
//             alt={`Momen dari @${moment.username} — ${moment.day}`}
//             className="h-full w-full object-cover"
//             loading="lazy"
//           />
//         </div>

//         <div className="mt-3 flex items-center justify-between gap-2">
//           <a
//             href={`https://instagram.com/${moment.username.replace(/^@/, "")}`}
//             target="_blank"
//             rel="noopener noreferrer"
//             className="font-display font-bold text-sm truncate hover:underline"
//           >
//             @{moment.username.replace(/^@/, "")}
//           </a>
//           <span
//             className={`shrink-0 font-mono text-[10px] font-bold uppercase px-2 py-1 border-2 border-ink ${dayClass}`}
//           >
//             {moment.day}
//           </span>
//         </div>

//         {moment.caption && (
//           <p className="mt-2 text-sm leading-snug break-words">
//             {moment.caption}
//           </p>
//         )}

//         <p className="mt-2 font-mono text-[10px] text-ink/60">
//           {timeAgo(moment.created_at)}
//         </p>
//       </div>
//     </div>
//   );
// }

import { Moment } from "@/lib/supabase";
import Link from "next/link";

const DAY_COLORS: Record<string, string> = {
  "Day 1": "bg-lime",
  "Day 2": "bg-sky",
  "Day 3": "bg-yolk",
  "Day 4": "bg-pink",
  "Day 5": "bg-lime",
  Closing: "bg-ink text-cream",
};

function timeAgo(dateStr: string) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "Just Now";
  if (mins < 60) return `${mins} Minutes ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} Hour ago`;
  const days = Math.floor(hours / 24);
  return `${days} Days ago`;
}

const ROTATE_CLASSES: Record<string, string> = {
  "-3": "-rotate-3",
  "-2": "-rotate-2",
  "2": "rotate-2",
  "3": "rotate-3",
  "0": "rotate-0",
};

export default function MomentCard({
  moment,
  rotate,
  onClick,
}: {
  moment: Moment;
  rotate: "-3" | "-2" | "2" | "3" | "0";
  onClick?: () => void;
}) {
  const dayClass = DAY_COLORS[moment.day] ?? "bg-lime";
  const rotateClass = ROTATE_CLASSES[rotate] ?? "rotate-0";

  return (
    <div
      className={`group relative ${rotateClass} hover:rotate-0 transition-transform duration-200`}
    >
      {/* pink offset shadow card, echoes the hero photo treatment on the main site */}
      <div className="absolute inset-0 translate-x-2 translate-y-2 rounded-sm bg-pink border-4 border-ink" />

      <div className="relative bg-white border-4 border-ink rounded-sm p-3 pb-4">
        <div className="aspect-square w-full overflow-hidden border-4 border-ink bg-cream">
          <button
            type="button"
            onClick={onClick}
            className="block h-full w-full cursor-zoom-in"
            aria-label="Lihat foto penuh"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={moment.image_url}
              alt={`Momen dari @${moment.username} — ${moment.day}`}
              className="h-full w-full object-cover transition-transform duration-300 hover:scale-110"
              loading="lazy"
            />
          </button>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <Link
            href={`https://instagram.com/${moment.username.replace(/^@/, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display font-bold text-sm truncate hover:underline"
          >
            @{moment.username.replace(/^@/, "")}
          </Link>
          <span
            className={`shrink-0 font-mono text-[10px] font-bold uppercase px-2 py-1 border-2 border-ink ${dayClass}`}
          >
            {moment.day}
          </span>
        </div>

        {moment.caption && (
          <p className="mt-2 text-sm leading-snug break-words">
            {moment.caption}
          </p>
        )}

        <p className="mt-2 font-mono text-[10px] text-ink/60">
          {timeAgo(moment.created_at)}
        </p>
      </div>
    </div>
  );
}
