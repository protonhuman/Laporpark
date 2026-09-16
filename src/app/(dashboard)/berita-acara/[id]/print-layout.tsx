import { type BeritaAcaraWithUsers, ROLE_LABELS } from "@/lib/types";
import { getBandaraByKode } from "@/lib/constants";

interface PrintLayoutProps {
  ba: BeritaAcaraWithUsers;
  checker: { nama: string; date: string; signature_url?: string | null } | null;
  approver: { nama: string; date: string; signature_url?: string | null } | null;
  previewMode?: boolean;
}

export default function PrintLayout({ ba, checker, approver, previewMode = false }: PrintLayoutProps) {
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

  // Resolve airport info for dynamic city name
  const bandara = getBandaraByKode(ba.kode_bandara);
  const cityName = bandara?.lokasi ?? "Banjarbaru";
  const hasPhotos = Boolean(ba.lampiran_foto && ba.lampiran_foto.length > 0);

  // 1. KOP SURAT (Header)
  const renderKop = () => (
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
  );

  // 2. JUDUL BA
  const renderJudul = () => (
    <div className="text-center mb-3 mt-1">
      <h1 className="text-[13pt] font-bold underline mb-0.5 uppercase tracking-wide">BERITA ACARA KRONOLOGIS</h1>
      <p className="text-[11pt] text-gray-800">No: {ba.nomor_ba}</p>
    </div>
  );

  // 3. META INFO
  const renderMeta = () => (
    <div className="mb-3.5 grid grid-cols-[160px_16px_1fr] gap-y-1 text-[11pt]">
      <div className="font-medium">Tanggal Kejadian</div>
      <div>:</div>
      <div>{formattedDate}</div>

      <div className="font-medium">Tanggal Pelaporan</div>
      <div>:</div>
      <div>{createdDate}</div>

      <div className="font-medium">Lokasi Bandara</div>
      <div>:</div>
      <div>{bandara ? `${bandara.nama} (${bandara.kode})` : ba.kode_bandara}</div>
    </div>
  );

  // 4. CONTENT SECTIONS
  const renderSections = () => (
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
  );

  // 5. PENGESAHAN (Tanda Tangan)
  const renderPengesahan = () => (
    <div className="mt-6 pt-1 print:break-inside-avoid">
      <p className="mb-2 text-[11pt] text-justify leading-relaxed">
        Demikian berita acara kronologis ini kami sampaikan, atas perhatian dan kerjasamanya kami ucapkan terimakasih.
      </p>

      {/* KONDISI 1: JIKA PEMBUAT ADALAH SUPERVISOR (Tanpa Box / Borderless) */}
      {ba.pembuat?.role === "supervisor" ? (
        <div className="flex flex-col items-end">
          <div className="w-64 text-center">
            <p className="text-[11pt] mb-1">{cityName}, {createdDate}</p>
            <p className="text-[11pt] font-semibold mb-0.5">Dibuat Oleh,</p>
            <div className="h-24 flex items-center justify-center my-1">
              {ba.pembuat?.signature_url ? (
                <img
                  src={ba.pembuat.signature_url}
                  className="h-20 max-h-20 w-auto max-w-[85%] object-contain"
                  alt="Tanda Tangan Pembuat"
                />
              ) : (
                <div className="h-20 flex items-center justify-center text-gray-400 italic text-[11pt]">
                  (Tanda Tangan)
                </div>
              )}
            </div>
            <p className="font-bold underline text-[11pt] leading-tight">
              {ba.pembuat?.nama ?? "—"}
            </p>
            <p className="text-[10pt] text-gray-600 leading-tight mt-0.5">
              Supervisor Parkir
            </p>
          </div>
        </div>
      ) : ba.pembuat?.role === "carpark_manager" ? (
        /* KONDISI 2: JIKA PEMBUAT ADALAH CARPARK MANAGER (2 KOLOM: Dibuat Oleh & Mengetahui) */
        <div>
          <p className="mb-2 text-[11pt] text-right">{cityName}, {createdDate}</p>
          <table className="w-full border-collapse border border-black text-center text-[11pt] table-fixed">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="border border-black py-1.5 px-2 font-semibold w-1/2 text-[11pt]">Dibuat Oleh</th>
                <th className="border border-black py-1.5 px-2 font-semibold w-1/2 text-[11pt]">Mengetahui</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Dibuat Oleh (Manager) */}
                <td className="border border-black h-28 align-bottom p-2">
                  <div className="flex flex-col items-center justify-end h-full">
                    {ba.pembuat?.signature_url ? (
                      <img src={ba.pembuat.signature_url} className="h-20 max-h-20 w-auto max-w-[85%] object-contain mb-1" alt="Tanda Tangan Pembuat" />
                    ) : (
                      <div className="h-20 flex items-center justify-center text-gray-400 italic text-[10pt]">
                        (Tanda Tangan)
                      </div>
                    )}
                    <span className="font-bold underline text-[11pt] leading-tight">{ba.pembuat?.nama ?? "—"}</span>
                    <span className="text-[10pt] text-gray-600 leading-tight">Carpark Manager</span>
                  </div>
                </td>
                {/* Mengetahui (Supervisor) */}
                <td className="border border-black h-28 align-bottom p-2">
                  <div className="flex flex-col items-center justify-end h-full">
                    {approver ? (
                      <>
                        {approver.signature_url ? (
                          <img src={approver.signature_url} className="h-20 max-h-20 w-auto max-w-[85%] object-contain mb-1" alt="Tanda Tangan Penyetuju" />
                        ) : (
                          <div className="h-20 flex items-center justify-center text-gray-400 italic text-[10pt]">
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
          <p className="mb-2 text-[11pt] text-right">{cityName}, {createdDate}</p>
          <table className="w-full border-collapse border border-black text-center text-[11pt] table-fixed">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="border border-black py-1.5 px-2 font-semibold w-1/3 text-[11pt]">Dibuat Oleh</th>
                <th className="border border-black py-1.5 px-2 font-semibold w-1/3 text-[11pt]">Diperiksa Oleh</th>
                <th className="border border-black py-1.5 px-2 font-semibold w-1/3 text-[11pt]">Mengetahui</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {/* Dibuat Oleh (Team Leader / Teknisi / Admin) */}
                <td className="border border-black h-28 align-bottom p-2">
                  <div className="flex flex-col items-center justify-end h-full">
                    {ba.pembuat?.signature_url ? (
                      <img src={ba.pembuat.signature_url} className="h-20 max-h-20 w-auto max-w-[85%] object-contain mb-1" alt="Tanda Tangan Pembuat" />
                    ) : (
                      <div className="h-20 flex items-center justify-center text-gray-400 italic text-[10pt]">
                        (Tanda Tangan)
                      </div>
                    )}
                    <span className="font-bold underline text-[11pt] leading-tight">{ba.pembuat?.nama ?? "—"}</span>
                    <span className="text-[10pt] text-gray-600 leading-tight">{ROLE_LABELS[ba.pembuat?.role as keyof typeof ROLE_LABELS] ?? "Staff"}</span>
                  </div>
                </td>
                {/* Diperiksa Oleh (Manager) */}
                <td className="border border-black h-28 align-bottom p-2">
                  <div className="flex flex-col items-center justify-end h-full">
                    {checker ? (
                      <>
                        {checker.signature_url ? (
                          <img src={checker.signature_url} className="h-20 max-h-20 w-auto max-w-[85%] object-contain mb-1" alt="Tanda Tangan Pemeriksa" />
                        ) : (
                          <div className="h-20 flex items-center justify-center text-gray-400 italic text-[10pt]">
                            (Tanda Tangan)
                          </div>
                        )}
                        <span className="font-bold underline text-[11pt] leading-tight">{checker.nama}</span>
                        <span className="text-[10pt] text-gray-600 leading-tight">Carpark Manager</span>
                      </>
                    ) : (
                      <span className="text-gray-400 italic text-[10pt] mb-2">Belum Diperiksa</span>
                    )}
                  </div>
                </td>
                {/* Mengetahui (Supervisor) */}
                <td className="border border-black h-28 align-bottom p-2">
                  <div className="flex flex-col items-center justify-end h-full">
                    {approver ? (
                      <>
                        {approver.signature_url ? (
                          <img src={approver.signature_url} className="h-20 max-h-20 w-auto max-w-[85%] object-contain mb-1" alt="Tanda Tangan Penyetuju" />
                        ) : (
                          <div className="h-20 flex items-center justify-center text-gray-400 italic text-[10pt]">
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
  );

  // 6. DOKUMENTASI HEADER & GRID
  const renderDokumentasi = () => {
    if (!hasPhotos || !ba.lampiran_foto) return null;

    return (
      <div className="w-full">
        <div className="flex justify-between items-center pb-3 border-b border-gray-300 mb-6">
          <div>
            <h2 className="text-[12pt] font-bold uppercase tracking-wide text-gray-800">Lampiran: Dokumentasi Kejadian</h2>
            <p className="text-[9pt] text-gray-500">Berita Acara No: {ba.nomor_ba}</p>
          </div>
          <div className="text-[9pt] text-gray-400">
            {cityName}, {createdDate}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 place-items-center">
          {ba.lampiran_foto.map((url, idx, arr) => {
            const total = arr.length;
            let spanClass = "col-span-4";
            let heightClass = "h-[270px]";

            if (total === 1) {
              spanClass = "col-span-12";
              heightClass = "h-[620px]";
            } else if (total === 2) {
              spanClass = "col-span-6";
              heightClass = "h-[440px]";
            } else if (total === 3) {
              spanClass = "col-span-4";
              heightClass = "h-[350px]";
            } else if (total === 4) {
              spanClass = "col-span-6";
              heightClass = "h-[370px]";
            } else if (total === 5) {
              spanClass = idx < 2 ? "col-span-6" : "col-span-4";
              heightClass = "h-[340px]";
            } else {
              spanClass = "col-span-4";
              heightClass = "h-[270px]";
            }

            return (
              <div key={idx} className={`${spanClass} w-full flex flex-col items-center justify-center`}>
                <img
                  src={url}
                  alt={`Dokumentasi ${idx + 1}`}
                  className={`w-full ${heightClass} object-contain border border-gray-300 rounded-xs p-1.5 bg-gray-50/50`}
                />
                <span className="text-[8.5pt] text-gray-500 mt-1">Dokumentasi {idx + 1}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* PRELOAD IMAGES */}
      {!previewMode && (
        <div className="absolute w-0 h-0 overflow-hidden opacity-0 pointer-events-none print:hidden">
          {ba.pembuat?.signature_url && <img src={ba.pembuat.signature_url} alt="preload" />}
          {checker?.signature_url && <img src={checker.signature_url} alt="preload" />}
          {approver?.signature_url && <img src={approver.signature_url} alt="preload" />}
        </div>
      )}

      {previewMode ? (
        /* MODE PREVIEW: Real A4 Paper Sheets (210mm x 297mm) */
        <div className="flex flex-col items-center gap-8 py-2 w-full">
          {/* LEMBAR 1: Dokumen Berita Acara & Pengesahan */}
          <div
            className="w-[210mm] min-h-[297mm] px-[15mm] py-[12mm] bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.18)] border border-slate-300 rounded-[2px] mx-auto box-border flex flex-col justify-between relative text-[11pt] leading-normal shrink-0"
            style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
          >
            <div>
              {renderKop()}
              {renderJudul()}
              {renderMeta()}
              {renderSections()}
              {renderPengesahan()}
            </div>

            {/* Footer Lembar 1 */}
            <div className="pt-3 mt-6 border-t border-gray-200 flex justify-between items-center text-[8.5pt] text-gray-400 select-none">
              <span>{ba.nomor_ba}</span>
              <span>Halaman 1 {hasPhotos ? "dari 2" : ""}</span>
            </div>
          </div>

          {/* LEMBAR 2: Lampiran Foto (Jika ada) */}
          {hasPhotos && (
            <div
              className="w-[210mm] min-h-[297mm] px-[15mm] py-[12mm] bg-white text-black shadow-[0_8px_30px_rgba(0,0,0,0.18)] border border-slate-300 rounded-[2px] mx-auto box-border flex flex-col justify-between relative text-[11pt] leading-normal shrink-0"
              style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
            >
              <div className="flex-1 flex flex-col">
                {renderDokumentasi()}
              </div>

              {/* Footer Lembar 2 */}
              <div className="pt-3 mt-6 border-t border-gray-200 flex justify-between items-center text-[8.5pt] text-gray-400 select-none">
                <span>{ba.nomor_ba}</span>
                <span>Halaman 2 dari 2</span>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* MODE PRINT: Native print layout for @media print */
        <div
          className="hidden print:block print:bg-white print:text-black max-w-4xl mx-auto text-[11pt] leading-normal"
          style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
        >
          <div>
            {renderKop()}
            {renderJudul()}
            {renderMeta()}
            {renderSections()}
            {renderPengesahan()}
          </div>

          {hasPhotos && (
            <div className="print:break-before-page pt-12">
              {renderDokumentasi()}
            </div>
          )}
        </div>
      )}
    </>
  );
}
