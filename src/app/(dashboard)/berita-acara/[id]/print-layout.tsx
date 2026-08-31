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

      <div
        className="hidden print:block print:bg-white print:text-black max-w-4xl mx-auto text-[11pt] leading-normal"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        {/* 1. KOP SURAT (Header) */}
        <div className="flex justify-between items-center mb-3">
          {/* Logo Angkasa Pura */}
          <div className="w-32 h-10 flex items-center justify-start text-xs text-gray-400">
            <img src="/logo-aps.png" alt="Angkasa Pura Supports" className="max-h-full object-contain" />
            <span className="sr-only">Angkasa Pura | SUPPORTS</span>
          </div>
          
          {/* Logo Centre Park */}
          <div className="w-32 h-10 flex items-center justify-end text-xs text-gray-400">
            <img src="/logo-cp.png" alt="Centre Park" className="max-h-full object-contain" />
            <span className="sr-only">Centre Park</span>
          </div>
        </div>

        {/* 2. JUDUL BA */}
        <div className="text-center mb-3 mt-1">
          <h1 className="text-[13pt] font-bold underline mb-0.5 uppercase tracking-wide">BERITA ACARA KRONOLOGIS</h1>
          <p className="text-[11pt] text-gray-800">No: {ba.nomor_ba}</p>
        </div>

        {/* 3. META INFO */}
        <div className="mb-3.5 grid grid-cols-[160px_16px_1fr] gap-y-1 text-[11pt]">
          <div className="font-medium">Tanggal Kejadian</div>
          <div>:</div>
          <div>{formattedDate}</div>

          <div className="font-medium">Tanggal Pelaporan</div>
          <div>:</div>
          <div>{createdDate}</div>
        </div>

        {/* 4. CONTENT SECTIONS */}
        <div className="space-y-3">
          {/* I. Permasalahan */}
          <div>
            <div className="flex font-bold mb-1">
              <span className="w-6">I.</span>
              <span>Permasalahan</span>
            </div>
            <div className="ml-6 text-justify">
              {ba.judul_masalah}
            </div>
          </div>

          {/* II. Kronologis Kejadian */}
          <div>
            <div className="flex font-bold mb-1">
              <span className="w-6">II.</span>
              <span>Kronologis Kejadian</span>
            </div>
            <div className="ml-6 text-justify whitespace-pre-wrap">
              {ba.kronologi}
            </div>
          </div>

          {/* III. Tindakan yang dilakukan */}
          <div>
            <div className="flex font-bold mb-1">
              <span className="w-6">III.</span>
              <span>Tindakan yang dilakukan</span>
            </div>
            <div className="ml-6 text-justify whitespace-pre-wrap">
              {ba.tindakan_dilakukan}
            </div>
          </div>

          {/* IV. Penyelesaian */}
          <div>
            <div className="flex font-bold mb-1">
              <span className="w-6">IV.</span>
              <span>Penyelesaian</span>
            </div>
            <div className="ml-6 text-justify whitespace-pre-wrap">
              {ba.penyelesaian || "-"}
            </div>
          </div>

          {/* V. Mitigasi */}
          <div>
            <div className="flex font-bold mb-1">
              <span className="w-6">V.</span>
              <span>Mitigasi</span>
            </div>
            <div className="ml-6 text-justify whitespace-pre-wrap">
              {ba.mitigasi || "-"}
            </div>
          </div>
        </div>

        {/* PENGESAHAN */}
        <div className="mt-8 pt-2 print:break-inside-avoid">
          <p className="mb-3 text-[11pt] text-justify leading-relaxed">
            Demikian berita acara kronologis ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terimakasih.
          </p>

          {/* KONDISI 1: JIKA PEMBUAT ADALAH SUPERVISOR ATAU ADMIN (Tanpa Box / Borderless) */}
          {ba.pembuat?.role === "supervisor" || ba.pembuat?.role === "admin" ? (
            <div className="flex flex-col items-end">
              <div className="w-64 text-center">
                <p className="text-[11pt] mb-1">Banjarbaru, {createdDate}</p>
                <p className="text-[11pt] font-semibold mb-0.5">Dibuat Oleh,</p>
                <div className="h-16 flex items-center justify-center my-1">
                  {ba.pembuat?.signature_url ? (
                    <img
                      src={ba.pembuat.signature_url}
                      className="h-14 max-h-14 w-auto object-contain"
                      alt="Tanda Tangan Pembuat"
                    />
                  ) : (
                    <div className="h-14 flex items-center justify-center text-gray-400 italic text-[11pt]">
                      (Tanda Tangan)
                    </div>
                  )}
                </div>
                <p className="font-bold underline text-[11pt] leading-tight">
                  {ba.pembuat?.nama ?? "—"}
                </p>
                <p className="text-[10pt] text-gray-600 leading-tight mt-0.5">
                  {ba.pembuat?.role === "admin" ? "Admin" : "Supervisor Parkir"}
                </p>
              </div>
            </div>
          ) : ba.pembuat?.role === "carpark_manager" ? (
            /* KONDISI 2: JIKA PEMBUAT ADALAH CARPARK MANAGER (2 KOLOM: Dibuat Oleh & Mengetahui) */
            <div>
              <p className="mb-2 text-[11pt] text-right">Banjarbaru, {createdDate}</p>
              <table className="w-full border-collapse border border-black text-center text-[11pt] table-fixed">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="border border-black py-1 px-2 font-semibold w-1/2 text-[11pt]">Dibuat Oleh</th>
                    <th className="border border-black py-1 px-2 font-semibold w-1/2 text-[11pt]">Mengetahui</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* Dibuat Oleh (Manager) */}
                    <td className="border border-black h-20 align-bottom p-1.5">
                      <div className="flex flex-col items-center justify-end h-full">
                        {ba.pembuat?.signature_url ? (
                          <img src={ba.pembuat.signature_url} className="h-14 max-h-14 w-auto object-contain mb-0.5" alt="Tanda Tangan Pembuat" />
                        ) : (
                          <div className="h-14 flex items-center justify-center text-gray-400 italic text-[10pt]">
                            (Tanda Tangan)
                          </div>
                        )}
                        <span className="font-bold underline text-[11pt] leading-tight">{ba.pembuat?.nama ?? "—"}</span>
                        <span className="text-[10pt] text-gray-600 leading-tight">Carpark Manager CP</span>
                      </div>
                    </td>
                    {/* Mengetahui (Supervisor) */}
                    <td className="border border-black h-20 align-bottom p-1.5">
                      <div className="flex flex-col items-center justify-end h-full">
                        {approver ? (
                          <>
                            {approver.signature_url ? (
                              <img src={approver.signature_url} className="h-14 max-h-14 w-auto object-contain mb-0.5" alt="Tanda Tangan Penyetuju" />
                            ) : (
                              <div className="h-14 flex items-center justify-center text-gray-400 italic text-[10pt]">
                                (Tanda Tangan)
                              </div>
                            )}
                            <span className="font-bold underline text-[11pt] leading-tight">{approver.nama}</span>
                            <span className="text-[10pt] text-gray-600 leading-tight">Supervisor Parkir</span>
                          </>
                        ) : (
                          <span className="text-gray-400 italic text-[10pt] mb-2">Belum Disetujui</span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            /* KONDISI 3: JIKA PEMBUAT ADALAH TEAM LEADER / TEKNISI / STAFF (3 KOLOM) */
            <div>
              <p className="mb-2 text-[11pt] text-right">Banjarbaru, {createdDate}</p>
              <table className="w-full border-collapse border border-black text-center text-[11pt] table-fixed">
                <thead>
                  <tr className="bg-gray-50/50">
                    <th className="border border-black py-1 px-2 font-semibold w-1/3 text-[11pt]">Dibuat Oleh</th>
                    <th className="border border-black py-1 px-2 font-semibold w-1/3 text-[11pt]">Diperiksa Oleh</th>
                    <th className="border border-black py-1 px-2 font-semibold w-1/3 text-[11pt]">Mengetahui</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {/* Dibuat Oleh (Team Leader / Teknisi) */}
                    <td className="border border-black h-20 align-bottom p-1.5">
                      <div className="flex flex-col items-center justify-end h-full">
                        {ba.pembuat?.signature_url ? (
                          <img src={ba.pembuat.signature_url} className="h-14 max-h-14 w-auto object-contain mb-0.5" alt="Tanda Tangan Pembuat" />
                        ) : (
                          <div className="h-14 flex items-center justify-center text-gray-400 italic text-[10pt]">
                            (Tanda Tangan)
                          </div>
                        )}
                        <span className="font-bold underline text-[11pt] leading-tight">{ba.pembuat?.nama ?? "—"}</span>
                        <span className="text-[10pt] text-gray-600 leading-tight">{ROLE_LABELS[ba.pembuat?.role as keyof typeof ROLE_LABELS] ?? "Staff"}</span>
                      </div>
                    </td>
                    {/* Diperiksa Oleh (Manager) */}
                    <td className="border border-black h-20 align-bottom p-1.5">
                      <div className="flex flex-col items-center justify-end h-full">
                        {checker ? (
                          <>
                            {checker.signature_url ? (
                              <img src={checker.signature_url} className="h-14 max-h-14 w-auto object-contain mb-0.5" alt="Tanda Tangan Pemeriksa" />
                            ) : (
                              <div className="h-14 flex items-center justify-center text-gray-400 italic text-[10pt]">
                                (Tanda Tangan)
                              </div>
                            )}
                            <span className="font-bold underline text-[11pt] leading-tight">{checker.nama}</span>
                            <span className="text-[10pt] text-gray-600 leading-tight">Carpark Manager CP</span>
                          </>
                        ) : (
                          <span className="text-gray-400 italic text-[10pt] mb-2">Belum Diperiksa</span>
                        )}
                      </div>
                    </td>
                    {/* Mengetahui (Supervisor) */}
                    <td className="border border-black h-20 align-bottom p-1.5">
                      <div className="flex flex-col items-center justify-end h-full">
                        {approver ? (
                          <>
                            {approver.signature_url ? (
                              <img src={approver.signature_url} className="h-14 max-h-14 w-auto object-contain mb-0.5" alt="Tanda Tangan Penyetuju" />
                            ) : (
                              <div className="h-14 flex items-center justify-center text-gray-400 italic text-[10pt]">
                                (Tanda Tangan)
                              </div>
                            )}
                            <span className="font-bold underline text-[11pt] leading-tight">{approver.nama}</span>
                            <span className="text-[10pt] text-gray-600 leading-tight">Supervisor Parkir</span>
                          </>
                        ) : (
                          <span className="text-gray-400 italic text-[10pt] mb-2">Belum Disetujui</span>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

      {/* PAGE BREAK UNTUK LAMPIRAN (Dipindah ke halaman terakhir setelah ttd) */}
      {ba.lampiran_foto && ba.lampiran_foto.length > 0 && (
        <div className="print:break-before-page pt-12">
          <h2 className="text-lg font-bold mb-6">Dokumentasi Kejadian</h2>
          <div className="grid grid-cols-12 gap-4 place-items-center">
            {ba.lampiran_foto.map((url, idx, arr) => {
              const total = arr.length;
              let spanClass = "col-span-4";
              let heightClass = "h-[300px]";

              if (total === 1) {
                spanClass = "col-span-12";
                heightClass = "h-[700px]";
              } else if (total === 2) {
                spanClass = "col-span-6";
                heightClass = "h-[500px]";
              } else if (total === 3) {
                spanClass = "col-span-4";
                heightClass = "h-[400px]";
              } else if (total === 4) {
                spanClass = "col-span-6";
                heightClass = "h-[450px]";
              } else if (total === 5) {
                // Baris pertama 2 foto, baris kedua 3 foto
                spanClass = idx < 2 ? "col-span-6" : "col-span-4";
                heightClass = "h-[400px]";
              } else {
                spanClass = "col-span-4";
                heightClass = "h-[300px]";
              }

              return (
                <div key={idx} className={`${spanClass} w-full flex justify-center`}>
                  {/* We use standard img for printing reliability instead of Next Image */}
                  <img 
                    src={url} 
                    alt={`Dokumentasi ${idx + 1}`} 
                    className={`w-full ${heightClass} object-contain border border-gray-200 p-1`}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
    </>
  );
}
