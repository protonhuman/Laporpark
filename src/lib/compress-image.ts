/**
 * Kompres gambar di browser menggunakan Canvas API sebelum upload ke Supabase.
 *
 * @param file     - File gambar asli dari input[type=file]
 * @param maxPx    - Resolusi maks sisi terpanjang (default: 1280px)
 * @param quality  - Kualitas JPEG 0–1 (default: 0.82)
 * @returns        - Blob terkompresi dalam format JPEG
 *
 * Hasil tipikal:
 *   Foto HP 4–10 MB  → ~200–400 KB (hemat ~90%)
 *   Tanda tangan PNG → ~30–80 KB   (hemat ~60%)
 */
export function compressImage(
  file: File,
  maxPx = 1280,
  quality = 0.82
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      // Hitung dimensi baru sambil jaga aspect ratio
      let { width, height } = img;
      if (width > maxPx || height > maxPx) {
        if (width >= height) {
          height = Math.round((height * maxPx) / width);
          width = maxPx;
        } else {
          width = Math.round((width * maxPx) / height);
          height = maxPx;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return reject(new Error("Canvas tidak tersedia di browser ini"));
      }

      // Untuk PNG dengan background transparan: isi putih dulu agar JPEG bersih
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Kompresi gambar gagal"));
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Gagal membaca file gambar"));
    };

    img.src = objectUrl;
  });
}
