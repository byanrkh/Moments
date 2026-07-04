"use client";

import { useEffect, useState } from "react";
import { supabase, Moment } from "@/lib/supabase";
import { Lock, Trash2, LogOut, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

const SESSION_KEY = "quatro_admin_pin";

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [authedPin, setAuthedPin] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");

  const [moments, setMoments] = useState<Moment[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const saved = sessionStorage.getItem(SESSION_KEY);
    if (saved) setAuthedPin(saved);
  }, []);

  useEffect(() => {
    if (!authedPin) return;
    fetchMoments();
  }, [authedPin]);

  async function fetchMoments() {
    setLoading(true);
    const { data, error } = await supabase
      .from("moments")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMoments(data as Moment[]);
    setLoading(false);
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setChecking(true);
    try {
      const res = await fetch("/api/admin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (data.valid) {
        sessionStorage.setItem(SESSION_KEY, pin);
        setAuthedPin(pin);
      } else {
        setError("PIN salah, coba lagi");
      }
    } catch {
      setError("Terjadi kesalahan, coba lagi");
    } finally {
      setChecking(false);
      setPin("");
    }
  }

  function handleLogout() {
    router.push("/");
    sessionStorage.removeItem(SESSION_KEY);
    setAuthedPin(null);
    setMoments([]);
  }

  async function handleDelete(id: string) {
    if (!authedPin) return;
    setDeletingId(id);
    try {
      const res = await fetch("/api/admin/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, pin: authedPin }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMoments((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Gagal menghapus foto");
    } finally {
      setDeletingId(null);
      setConfirmId(null);
    }
  }

  // ---------- Layar login PIN ----------
  if (!authedPin) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-cream px-4">
        <form
          onSubmit={handleLogin}
          className="bg-white border-4 border-ink shadow-brutal p-8 w-full max-w-sm text-center"
        >
          <span className="inline-flex border-2 border-ink bg-lime p-3 mb-4">
            <Lock size={24} strokeWidth={2.5} />
          </span>
          <h1 className="font-display font-extrabold text-2xl uppercase mb-2">
            Admin Access
          </h1>

          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="••••"
            autoFocus
            className="w-full text-center text-2xl tracking-[0.5em] font-mono font-bold border-4 border-ink px-4 py-3 mb-4 outline-none focus:bg-cream"
          />

          {error && (
            <p className="text-sm font-bold text-red-600 bg-red-50 border-2 border-red-600 px-3 py-2 mb-4">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={checking || !pin}
            className="w-full inline-flex items-center justify-center gap-2 bg-ink text-cream font-display font-extrabold uppercase px-5 py-3 border-2 border-ink shadow-brutal-sm hover:-translate-x-0.5 hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {checking ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Memeriksa...
              </>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </main>
    );
  }

  // ---------- Dashboard admin ----------
  return (
    <main className="min-h-screen bg-cream">
      <header className="border-b-4 border-ink bg-yolk px-4 md:px-10 py-4 flex items-center justify-between sticky top-0 z-30">
        <h1 className="font-display font-extrabold text-xl md:text-2xl">
          Admin <span className="bg-ink text-cream px-1.5">Quatrolympic</span>
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 font-display font-bold text-sm border-2 border-ink px-3 py-1.5 bg-cream hover:bg-white transition-colors"
        >
          <LogOut size={14} strokeWidth={2.5} /> Keluar
        </button>
      </header>

      <section className="px-4 md:px-10 py-8 max-w-6xl mx-auto">
        {/* <p className="font-body text-sm text-ink/70 mb-6">
          {moments.length} foto total. Klik hapus untuk menghilangkan foto dari
          galeri publik.
        </p> */}

        {loading ? (
          <p className="font-mono text-center text-ink/60 py-16">
            Loading data...
          </p>
        ) : moments.length === 0 ? (
          <p className="font-mono text-center text-ink/60 py-16">
            No photos yet...
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {moments.map((m) => (
              <div
                key={m.id}
                className="bg-white border-4 border-ink p-2 relative"
              >
                <div className="aspect-square w-full overflow-hidden border-2 border-ink bg-cream">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={m.image_url}
                    alt={m.username}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="mt-2">
                  <p className="font-display font-bold text-xs truncate">
                    @{m.username.replace(/^@/, "")}
                  </p>
                  <p className="font-mono text-[10px] text-ink/60 uppercase">
                    {m.day}
                  </p>
                </div>

                {confirmId === m.id ? (
                  <div className="mt-2 flex gap-1">
                    <button
                      onClick={() => handleDelete(m.id)}
                      disabled={deletingId === m.id}
                      className="flex-1 bg-red-600 text-white font-display font-bold text-xs px-2 py-1.5 border-2 border-ink disabled:opacity-50"
                    >
                      {deletingId === m.id ? "..." : "Yakin?"}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      className="flex-1 bg-cream font-display font-bold text-xs px-2 py-1.5 border-2 border-ink"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmId(m.id)}
                    className="mt-2 w-full flex items-center justify-center gap-1.5 bg-white text-red-600 font-display font-bold text-xs px-2 py-1.5 border-2 border-ink hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={12} strokeWidth={2.5} /> Hapus
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
