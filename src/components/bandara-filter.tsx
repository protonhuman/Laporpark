"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { DAFTAR_BANDARA } from "@/lib/constants";
import { MapPin, ChevronDown } from "lucide-react";

export default function BandaraFilter({ userRole }: { userRole: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentBandara = searchParams.get("bandara") || "ALL";

  if (userRole !== "superadmin") return null;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams);
    if (val === "ALL") {
      params.delete("bandara");
    } else {
      params.set("bandara", val);
    }
    // reset page when changing bandara
    params.delete("page");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
        <MapPin className="w-4 h-4 text-sky-600" />
      </div>
      <select
        value={currentBandara}
        onChange={handleChange}
        className="appearance-none w-full pl-11 pr-12 py-3 rounded-xl border border-sky-500/30 bg-white/80 backdrop-blur-md text-slate-800 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer shadow-[0_8px_16px_-4px_rgba(14,165,233,0.15)] transition-all hover:bg-white hover:border-sky-500/50"
      >
        <option value="ALL">Semua Bandara (Pusat / HO)</option>
        {DAFTAR_BANDARA.map((b) => (
          <option key={b.kode} value={b.kode}>
            {b.kode} - {b.nama}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none transition-transform group-hover:translate-y-0.5">
        <ChevronDown className="w-4 h-4 text-sky-500" />
      </div>
    </div>
  );
}
