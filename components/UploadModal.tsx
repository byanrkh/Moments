"use client";

import { useRef, useState } from "react";
import {
  supabase,
  MOMENTS_BUCKET,
  QUATRO_DAYS,
  Moment,
  QuatroDay,
} from "@/lib/supabase";

const MAX_FILE_MB = 10;

export default function UploadModal({
  open,
  onClose,
  onUploaded,
}: {
  open: boolean;
  onClose: () => void;
  onUploaded: (moment: Moment) => void;
}) {
  const [username, setUsername] = useState("");
  const [day, setDay] = useState<QuatroDay>("Day 1");
  const [caption, setCaption] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<
    "idle" | "uploading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!open) return null;

  function resetForm() {
    setUsername("");
    setDay("Day 1");
    setCaption("");
    setFile(null);
    setPreview(null);
    setStatus("idle");
    setErrorMsg("");
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    if (!f.type.startsWith("image/")) {
      setErrorMsg("File harus berupa gambar (JPG, PNG, WEBP, atau HEIC).");
      return;
    }
    if (f.size > MAX_FILE_MB * 1024 * 1024) {
      setErrorMsg(
        `Ukuran foto maksimal ${MAX_FILE_MB}MB. Coba kompres dulu ya.`,
      );
      return;
    }

    setErrorMsg("");
    setFile(f);
    setPreview(URL.createObjectURL(f));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    const cleanUsername = username.trim().replace(/^@/, "");
    if (!cleanUsername) {
      setErrorMsg("Username Instagram wajib diisi.");
      return;
    }
    if (!file) {
      setErrorMsg("Pilih foto dulu ya.");
      return;
    }

    setStatus("uploading");

    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${day.toLowerCase().replace(/\s+/g, "-")}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(MOMENTS_BUCKET)
        .upload(path, file, { cacheControl: "3600", upsert: false });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from(MOMENTS_BUCKET)
        .getPublicUrl(path);

      const { data: inserted, error: insertError } = await supabase
        .from("moments")
        .insert({
          username: cleanUsername,
          image_url: publicUrlData.publicUrl,
          day,
          caption: caption.trim(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      setStatus("success");
      onUploaded(inserted as Moment);

      setTimeout(() => {
        resetForm();
        onClose();
      }, 1200);
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message || "Gagal upload. Coba lagi ya.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* backdrop */}
      <button
        aria-label="Tutup form upload"
        onClick={() => {
          if (status !== "uploading") {
            resetForm();
            onClose();
          }
        }}
        className="absolute inset-0 bg-ink/60"
      />

      <div className="relative w-full md:max-w-lg max-h-[92vh] overflow-y-auto bg-cream border-4 border-ink shadow-brutal-lg rounded-t-2xl md:rounded-sm p-6">
        <div className="flex items-start justify-between mb-4">
          <h2 className="font-display font-extrabold text-2xl">
            Upload Your Moment
          </h2>
          <button
            onClick={() => {
              if (status !== "uploading") {
                resetForm();
                onClose();
              }
            }}
            aria-label="Tutup"
            className="font-display font-bold text-xl border-2 border-ink w-9 h-9 flex items-center justify-center bg-white hover:bg-pink transition-colors"
          >
            ×
          </button>
        </div>

        {status === "success" ? (
          <div className="bg-lime border-4 border-ink p-6 text-center font-display font-bold">
            Uploaded! 🎉
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block font-display font-bold text-sm mb-1">
                Instagram Username
              </label>
              <div className="flex items-center border-4 border-ink bg-white focus-within:bg-sky/20">
                <span className="pl-3 font-mono font-bold text-ink/60">@</span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Instagram Username"
                  className="w-full bg-transparent px-2 py-2 outline-none font-body"
                  maxLength={60}
                  required
                />
              </div>
            </div>

            {/* Day */}
            <div>
              <label className="block font-display font-bold text-sm mb-1">
                Day...
              </label>
              <div className="flex flex-wrap gap-2">
                {QUATRO_DAYS.map((d) => (
                  <button
                    type="button"
                    key={d}
                    onClick={() => setDay(d)}
                    className={`px-3 py-1.5 border-2 border-ink font-mono text-xs font-bold uppercase transition-colors ${
                      day === d ? "bg-lime" : "bg-white hover:bg-cream"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Photo */}
            <div>
              <label className="block font-display font-bold text-sm mb-1">
                Attachment
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="moment-photo-input"
              />
              {!preview ? (
                <label
                  htmlFor="moment-photo-input"
                  className="flex flex-col items-center justify-center gap-1 border-4 border-dashed border-ink bg-white py-8 cursor-pointer hover:bg-cream transition-colors"
                >
                  <span className="font-display font-bold">
                    Tap to select a Photo atau Click to choose a Photo
                  </span>
                  <span className="font-mono text-[11px] text-ink/60">
                    JPG, PNG, or WEBP · max 10MB
                  </span>
                </label>
              ) : (
                <div className="relative border-4 border-ink">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={preview}
                    alt="Preview foto yang akan diupload"
                    className="w-full max-h-64 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-white border-2 border-ink px-2 py-1 font-mono text-xs font-bold hover:bg-pink"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>

            {/* Caption */}
            <div>
              <label className="block font-display font-bold text-sm mb-1">
                Caption
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, 300))}
                rows={3}
                placeholder="Share your exciting moment..."
                className="w-full border-4 border-ink bg-white px-3 py-2 outline-none font-body resize-none focus-within:bg-sky/20"
              />
              <p className="mt-1 text-right font-mono text-[10px] text-ink/50">
                {caption.length}/300
              </p>
            </div>

            {errorMsg && (
              <div className="border-2 border-ink bg-pink/40 px-3 py-2 text-sm font-body">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "uploading"}
              className="w-full bg-lime border-4 border-ink shadow-brutal-sm font-display font-extrabold text-lg py-3 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "uploading" ? "Uploading..." : "Upload Moment"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
