# Cashie.

Cashie. adalah aplikasi web untuk mencatat dan mengelola keuangan pribadi. Pengguna dapat memantau pemasukan, pengeluaran, dan saldo melalui dashboard, serta mengelola transaksi dalam satu tempat.

## Fitur

- Registrasi, login, dan logout pengguna
- Dashboard ringkasan keuangan
- Tambah, lihat, edit, dan hapus transaksi
- Pencarian dan filter transaksi
- Penyimpanan data menggunakan MySQL
- Tampilan responsif untuk desktop dan mobile

## Teknologi

- **Next.js** — Framework React
- **TypeScript** — Bahasa pemrograman
- **Tailwind CSS** — Styling antarmuka
- **MySQL (Aiven)** — Database
- **mysql2** — Koneksi database
- **Lucide React** — Ikon
- **Vercel** — Platform deployment

## Menjalankan Project

Clone repository dan install dependencies:

```bash
git clone https://github.com/USERNAME/cashie.git
cd cashie
npm install
```

Konfigurasikan environment variables pada file `.env.local` sesuai koneksi database MySQL.

Kemudian jalankan:

```bash
npm run dev
```

Buka `http://localhost:3000` melalui browser.

## Database

Cashie menggunakan MySQL untuk menyimpan data pengguna dan transaksi. Setiap transaksi terhubung dengan akun pengguna sehingga data keuangan dikelola secara terpisah.

## Deployment

Project disiapkan untuk deployment menggunakan Vercel dengan database MySQL dari Aiven.