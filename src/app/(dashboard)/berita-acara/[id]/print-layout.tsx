import { type BeritaAcaraWithUsers, ROLE_LABELS } from "@/lib/types";
import Image from "next/image";

interface PrintLayoutProps {
  ba: BeritaAcaraWithUsers;
  checker: { nama: string; date: string; signature_url?: string | null } | null;
  approver: { nama: string; date: string; signature_url?: string | null } | null;
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
    <>
      {/* PRELOAD IMAGES: Browser will not load images inside 'display: none'.
          We render them here as 1x1 invisible pixels so they are downloaded and cached before the user prints! */}
      <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none print:hidden">
        {ba.pembuat?.signature_url && <img src={ba.pembuat.signature_url} alt="preload" />}
        {checker?.signature_url && <img src={checker.signature_url} alt="preload" />}
        {approver?.signature_url && <img src={approver.signature_url} alt="preload" />}
      </div>

      <div className="hidden print:block print:bg-white print:text-black font-sans max-w-4xl mx-auto text-sm leading-relaxed">
      {/* 1. KOP SURAT (Header) */}
      <div className="flex justify-between items-start mb-2">
        {/* Placeholder for Angkasa Pura Logo */}
        <div className="w-32 h-10 flex items-center justify-start text-xs text-gray-400">
          <img src="/logo-aps.png" alt="Angkasa Pura Supports" className="max-h-full object-contain" />
          {/* Text fallback just in case logo isn't uploaded yet */}
          <span className="sr-only">Angkasa Pura | SUPPORTS</span>
        </div>
        
        {/* Placeholder for Centre Park Logo */}
        <div className="w-32 h-10 flex items-center justify-end text-xs text-gray-400">
          <img src="/logo-cp.png" alt="Centre Park" className="max-h-full object-contain" />
          <span className="sr-only">Centre Park</span>
        </div>
      </div>

      {/* 2. JUDUL BA */}
      <div className="text-center mb-4 mt-0">
        <h1 className="text-lg font-bold underline mb-1 uppercase">BERITA ACARA KRONOLOGIS</h1>
        <p className="text-sm">No: {ba.nomor_ba}</p>
      </div>

      {/* 3. META INFO */}
      <div className="mb-4 grid grid-cols-[160px_20px_1fr] gap-y-2">
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

        {/* II. Kronologis Kejadian */}
        <div>
          <div className="flex font-bold mb-2">
            <span className="w-8">II.</span>
            <span>Kronologis Kejadian</span>
          </div>
          <div className="ml-8 text-justify whitespace-pre-wrap">
            {ba.kronologi}
          </div>
        </div>

        {/* III. Tindakan yang dilakukan */}
        <div>
          <div className="flex font-bold mb-2">
            <span className="w-8">III.</span>
            <span>Tindakan yang dilakukan</span>
          </div>
          <div className="ml-8 text-justify whitespace-pre-wrap">
            {ba.tindakan_dilakukan}
          </div>
        </div>

        {/* IV. Penyelesaian */}
        <div>
          <div className="flex font-bold mb-2">
            <span className="w-8">IV.</span>
            <span>Penyelesaian</span>
          </div>
          <div className="ml-8 text-justify whitespace-pre-wrap">
            {ba.penyelesaian || "-"}
          </div>
        </div>

        {/* V. Mitigasi */}
        <div>
          <div className="flex font-bold mb-2">
            <span className="w-8">V.</span>
            <span>Mitigasi</span>
          </div>
          <div className="ml-8 text-justify whitespace-pre-wrap">
            {ba.mitigasi || "-"}
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
        <table className="w-full border-collapse border border-black text-center text-sm table-fixed">
          <thead>
            <tr>
              <th className="border border-black p-2 font-normal w-1/3">Dibuat Oleh</th>
              <th className="border border-black p-2 font-normal w-1/3">Diperiksa Oleh</th>
              <th className="border border-black p-2 font-normal w-1/3">Mengetahui</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-black h-32 align-bottom p-2">
                <div className="flex flex-col items-center justify-end h-full">
                  {ba.pembuat?.signature_url && (
                    <img src={ba.pembuat.signature_url} className="h-32 w-auto object-contain -mb-2" alt="Tanda Tangan Pembuat" />
                  )}
                  <span className="font-bold underline mb-1">{ba.pembuat?.nama ?? "—"}</span>
                  <span>{ROLE_LABELS[ba.pembuat?.role as keyof typeof ROLE_LABELS] ?? "Staff"}</span>
                </div>
              </td>
              <td className="border border-black h-32 align-bottom p-2">
                <div className="flex flex-col items-center justify-end h-full">
                  {checker ? (
                    <>
                      {checker.signature_url && (
                        <img src={checker.signature_url} className="h-32 w-auto object-contain -mb-2" alt="Tanda Tangan Pemeriksa" />
                      )}
                      <span className="font-bold underline mb-1">{checker.nama}</span>
                      <span>Carpark Manager CP</span>
                    </>
                  ) : (
                    <span className="text-gray-400 italic mb-4">Belum Diperiksa</span>
                  )}
                </div>
              </td>
              <td className="border border-black h-32 align-bottom p-2">
                <div className="flex flex-col items-center justify-end h-full">
                  {approver ? (
                    <>
                      {approver.signature_url && (
                        <img src={approver.signature_url} className="h-32 w-auto object-contain -mb-2" alt="Tanda Tangan Penyetuju" />
                      )}
                      <span className="font-bold underline mb-1">{approver.nama}</span>
                      <span>Supervisor Parkir</span>
                    </>
                  ) : (
                    <span className="text-gray-400 italic mb-4">Belum Disetujui</span>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    </>
  );
}
