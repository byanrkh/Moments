import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in dev if .env.local isn't set up yet
  console.warn(
    "Supabase env vars belum di-set. Cek .env.local (lihat .env.local.example)."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const MOMENTS_BUCKET = "moments";

export type QuatroDay =
  | "Day 1"
  | "Day 2"
  | "Day 3"
  | "Day 4"
  | "Day 5"
  | "Closing";

export const QUATRO_DAYS: QuatroDay[] = [
  "Day 1",
  "Day 2",
  "Day 3",
  "Day 4",
  "Day 5",
  "Closing",
];

export interface Moment {
  id: string;
  username: string;
  image_url: string;
  day: QuatroDay;
  caption: string;
  created_at: string;
}
