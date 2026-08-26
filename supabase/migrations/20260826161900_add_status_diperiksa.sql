-- Menambahkan status 'diperiksa' ke dalam tipe ENUM status_ba
-- Tipe ini digunakan untuk menandakan bahwa BA telah diperiksa oleh Carpark Manager
ALTER TYPE public.status_ba ADD VALUE IF NOT EXISTS 'diperiksa' AFTER 'menunggu_review';
