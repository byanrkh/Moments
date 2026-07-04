"use client";

import { Moment } from "@/lib/supabase";

export default function Lightbox({
  moments,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: {
  moments: Moment[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const moment = moments[activeIndex];
  if (!moment) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/90 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <span className="absolute top-4 left-4 sm:top-6 sm:left-6 font-mono font-bold text-cream bg-ink border-2 border-cream px-3 py-1.5 text-sm">
        {activeIndex + 1} / {moments.length}
      </span>

      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 bg-cream border-2 border-ink font-display font-extrabold px-3 py-1.5 shadow-brutal-sm hover:-translate-y-0.5 transition-transform"
        aria-label="Tutup"
      >
        ✕
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPrev();
        }}
        className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 bg-cream border-2 border-ink font-display font-extrabold px-3 py-2 shadow-brutal-sm hover:-translate-x-0.5 transition-transform"
        aria-label="Momen sebelumnya"
      >
        ‹
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 bg-cream border-2 border-ink font-display font-extrabold px-3 py-2 shadow-brutal-sm hover:translate-x-0.5 transition-transform"
        aria-label="Momen berikutnya"
      >
        ›
      </button>

      <div
        className="max-w-3xl w-full max-h-[85vh] flex flex-col items-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={moment.image_url}
          alt={`Momen dari @${moment.username} — ${moment.day}`}
          className="max-h-[70vh] w-auto object-contain border-4 border-cream"
        />
        <div className="bg-cream border-4 border-ink px-4 py-3 mt-4 w-full sm:w-auto sm:min-w-[320px] max-w-full">
          <div className="flex items-center justify-between gap-2">
            <span className="font-display font-bold text-sm truncate">
              @{moment.username.replace(/^@/, "")}
            </span>
            <span className="shrink-0 font-mono text-[10px] font-bold uppercase px-2 py-1 border-2 border-ink bg-lime">
              {moment.day}
            </span>
          </div>
          {moment.caption && (
            <p className="mt-2 text-sm leading-snug break-words">
              {moment.caption}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
