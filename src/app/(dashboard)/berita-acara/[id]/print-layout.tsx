import { type BeritaAcaraWithUsers, ROLE_LABELS } from "@/lib/types";
import Image from "next/image";

interface PrintLayoutProps {
  ba: BeritaAcaraWithUsers;
  checker: { nama: string; date: string } | null;
  approver: { nama: string; date: string } | null;
}

export default function PrintLayout({ ba, checker, approver }: PrintLayoutProps) {
  // Helper to format date explicitly like "15 April 2025"
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formattedDate = formatDate(ba.tanggal_kejadian);
  const createdDate = formatDate(ba.created_at);

  return (
    <div className="hidden print:block print:bg-white print:text-black font-sans max-w-4xl mx-auto text-sm leading-relaxed">
      {/* 1. KOP SURAT (Header) */}
      <div className="flex justify-between items-start mb-4">
        {/* Placeholder for Angkasa Pura Logo */}
        <div className="w-48 h-16 flex items-center justify-start text-xs text-gray-400">
          <img src="/logo-aps.png" alt="Angkasa Pura Supports" className="max-h-full object-contain" />
          {/* Text fallback just in case logo isn't uploaded yet */}
          <span className="sr-only">Angkasa Pura | SUPPORTS</span>
        </div>
        
        {/* Placeholder for Centre Park Logo */}
        <div className="w-48 h-16 flex items-center justify-end text-xs text-gray-400">
          <img src="/logo-cp.png" alt="Centre Park" className="max-h-full object-contain" />
          <span className="sr-only">Centre Park</span>
        </div>
      </div>

      {/* 2. JUDUL BA */}
      <div className="text-center mb-6 mt-2">
        <h1 className="text-lg font-bold underline mb-1 uppercase">BERITA ACARA KRONOLOGIS</h1>
        <p className="text-sm">No: {ba.nomor_ba}</p>
      </div>

      {/* 3. META INFO */}
      <div className="mb-8 grid grid-cols-[160px_20px_1fr] gap-y-2">
        <div>Tanggal Kejadian</div>
        <div>:</div>
        <div>{formattedDate}</div>

        <div>Tanggal Pelaporan</div>
        <div>:</div>
        <div>{createdDate}</div>
      </div>

      {/* 4. CONTENT SECTIONS */}
      <div className="space-y-6">
        {/* I. Permasalahan */}
        <div>
          <div className="flex font-bold mb-2">
            <span className="w-8">I.</span>
            <span>Permasalahan</span>
          </div>
          <div className="ml-8 text-justify">
            {ba.judul_masalah}
          </div>
        </div>

        {/* II. Uraian Kejadian */}
        <div>
          <div className="flex font-bold mb-2">
            <span className="w-8">II.</span>
            <span>Uraian Kejadian</span>
          </div>
          <div className="ml-8 text-justify whitespace-pre-wrap">
            {ba.kronologi}
          </div>
        </div>

        {/* III. Dampak Yang Ditimbulkan */}
        <div>
          <div className="flex font-bold mb-2">
            <span className="w-8">III.</span>
            <span>Dampak Yang Ditimbulkan</span>
          </div>
          <div className="ml-8 text-justify whitespace-pre-wrap">
            {ba.mitigasi || "-"}
          </div>
        </div>

        {/* IV. Tindakan yang dilakukan */}
        <div>
          <div className="flex font-bold mb-2">
            <span className="w-8">IV.</span>
            <span>Tindakan yang dilakukan</span>
          </div>
          <div className="ml-8 text-justify whitespace-pre-wrap">
            {ba.tindakan_dilakukan}
            {ba.penyelesaian && (
              <>
                <br /><br />
                <strong>Penyelesaian:</strong><br />
                {ba.penyelesaian}
              </>
            )}
          </div>
        </div>
      </div>

      {/* PAGE BREAK UNTUK LAMPIRAN */}
      {ba.lampiran_foto && ba.lampiran_foto.length > 0 && (
        <div className="print:break-before-page pt-12">
          <h2 className="text-lg font-bold mb-6">Dokumentasi Kejadian</h2>
          <div className="grid grid-cols-2 gap-6">
            {ba.lampiran_foto.map((url, idx) => (
              <div key={idx} className="mb-4">
                {/* We use standard img for printing reliability instead of Next Image */}
                <img 
                  src={url} 
                  alt={`Dokumentasi ${idx + 1}`} 
                  className="w-full h-auto max-h-[400px] object-contain border border-gray-200 p-1"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PAGE BREAK UNTUK PENGESAHAN (Atau biarkan menyambung jika cukup) */}
      <div className="mt-16 pt-8 print:break-inside-avoid">
        <p className="mb-6">
          Demikian berita acara kronologis ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terimakasih.
        </p>
        <p className="mb-8">Banjarbaru, {createdDate}</p>

        {/* TABEL TANDA TANGAN */}
        <table className="w-full border-collapse border border-black text-center text-sm">
          <thead>
            <tr>
              <th className="border border-black p-2 font-normal">Dibuat Oleh</th>
              <th className="border border-black p-2 font-normal">Diperiksa Oleh</th>
              <th className="border border-black p-2 font-normal">Mengetahui</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black h-32 align-bottom p-2">
                <div className="flex flex-col items-center">
                  <span className="font-bold underline mb-1">{ba.pembuat?.nama ?? "—"}</span>
                  <span>{ROLE_LABELS[ba.pembuat?.role as keyof typeof ROLE_LABELS] ?? "Staff"}</span>
                </div>
              </td>
              <td className="border border-black h-32 align-bottom p-2">
                <div className="flex flex-col items-center">
                  {checker ? (
                    <>
                      <span className="font-bold underline mb-1">{checker.nama}</span>
                      <span>Carpark Manager CP</span>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Belum Diperiksa</span>
                  )}
                </div>
              </td>
              <td className="border border-black h-32 align-bottom p-2">
                <div className="flex flex-col items-center">
                  {approver ? (
                    <>
                      <span className="font-bold underline mb-1">{approver.nama}</span>
                      <span>Supervisor Parkir</span>
                    </>
                  ) : (
                    <span className="text-gray-400 italic">Belum Disetujui</span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
