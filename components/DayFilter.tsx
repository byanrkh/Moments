"use client";

import { QUATRO_DAYS } from "@/lib/supabase";

export default function DayFilter({
  active,
  onChange,
}: {
  active: string;
  onChange: (value: string) => void;
}) {
  const options = ["All", ...QUATRO_DAYS];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:flex-wrap">
      {options.map((opt) => {
        const isActive = active === opt;
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`shrink-0 font-display font-bold text-sm md:text-base px-4 py-2 border-4 border-ink transition-all
              ${
                isActive
                  ? "bg-lime shadow-brutal-sm translate-x-0 translate-y-0"
                  : "bg-white shadow-none hover:bg-cream"
              }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}
