-- Menambahkan status 'gangguan_sistem' dan 'gangguan_perangkat' ke dalam tipe ENUM jenis_insiden
ALTER TYPE public.jenis_insiden ADD VALUE IF NOT EXISTS 'gangguan_sistem';
ALTER TYPE public.jenis_insiden ADD VALUE IF NOT EXISTS 'gangguan_perangkat';
