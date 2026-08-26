"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface PhotoUploadProps {
  photos: string[];
  onChange: (photos: string[]) => void;
  maxPhotos?: number;
}

export default function PhotoUpload({
  photos,
  onChange,
  maxPhotos = 5,
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const supabase = createClient();
    const newPhotos = [...photos];

    for (const file of Array.from(files)) {
      if (newPhotos.length >= maxPhotos) break;

      const ext = file.name.split(".").pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const filePath = `ba-photos/${fileName}`;

      const { error } = await supabase.storage
        .from("ba_lampiran")
        .upload(filePath, file);

      if (!error) {
        const {
          data: { publicUrl },
        } = supabase.storage.from("ba_lampiran").getPublicUrl(filePath);
        newPhotos.push(publicUrl);
      }
    }

    onChange(newPhotos);
    setUploading(false);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function removePhoto(index: number) {
    const updated = photos.filter((_, i) => i !== index);
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      {/* Photo grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {photos.map((url, i) => (
            <div
              key={i}
              className="relative group rounded-xl overflow-hidden border border-white/[0.08] aspect-video bg-white/[0.02]"
            >
              <img
                src={url}
                alt={`Lampiran ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-2 right-2 p-1 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {photos.length < maxPhotos && (
        <label className="flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/[0.08] hover:border-white/[0.15] bg-white/[0.02] hover:bg-white/[0.04] py-6 cursor-pointer transition-all duration-200">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-slate-500 animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-slate-500" />
          )}
          <span className="text-xs text-slate-500">
            {uploading
              ? "Mengunggah..."
              : `Klik untuk upload foto (maks ${maxPhotos})`}
          </span>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      )}
    </div>
  );
}
