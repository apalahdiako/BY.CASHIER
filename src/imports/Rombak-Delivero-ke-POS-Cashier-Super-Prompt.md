# SUPER PROMPT — ROMBAK DESAIN "DELIVERO" JADI POS CASHIER FNB
### Fungsional Penuh, Realtime, Logika Tinggi, Zero Dummy Data

---

## 🎯 PROMPT UTAMA (COPY-PASTE KE REPLIT AI)

```
Gw punya desain UI existing bertema "Delivero Food" (awalnya dibuat untuk app delivery 
makanan) dengan struktur: sidebar (Dashboard, Food Order, Favorite, Message, Order History, 
Bills, Settings), panel saldo dengan tombol Top Up & Transfer, kategori produk, grid Popular 
Dishes, dan panel Order Menu (cart) dengan checkout.

TUGAS LO: rombak total LOGIKA & FUNGSI di balik desain ini (bukan bikin desain baru) 
jadi sistem POS CASHIER untuk bisnis F&B bernama BY.CASHIER UMKM. Desain/layout visual 
dipakai ulang, tapi setiap elemen harus di-remap fungsinya jadi kasir sungguhan — 
BUKAN app pesan-antar customer lagi.

ATURAN KERAS:
1. TIDAK BOLEH ADA DATA DUMMY/STATIS. Semua angka, data produk, transaksi, saldo, 
   riwayat — HARUS dari database real dan berubah sesuai aksi user yang sebenarnya.
2. SEMUA HARUS REALTIME. Perubahan stok, status order, notifikasi — pakai WebSocket/
   Supabase Realtime, bukan refresh manual.
3. LOGIKA PERHITUNGAN HARUS 100% AKURAT. Total belanja, diskon, pajak, kembalian, 
   split bill — semua pakai rumus matematis yang benar dan tervalidasi, no rounding error.
4. SETIAP AKSI HARUS PUNYA KONSEKUENSI DATA YANG BENAR. Contoh: kalau kasir void 
   transaksi, stok bahan baku yang sudah terpotong harus dikembalikan otomatis.
5. TIDAK ADA FITUR SETENGAH JADI. Kalau ada tombol/menu di desain, harus fungsional 
   penuh — kalau memang belum relevan buat kasir, ganti fungsinya (lihat mapping di bawah), 
   jangan dibiarkan nganggur/dummy.
```

---

## 🔄 MAPPING: KOMPONEN LAMA (DELIVERY) → FUNGSI BARU (POS CASHIER)

| Komponen Desain Lama | Fungsi Lama (Delivery) | Fungsi Baru (POS Cashier) |
|---|---|---|
| **Sidebar "Dashboard"** | Ringkasan pesanan customer | Ringkasan penjualan hari ini: total omzet, jumlah transaksi, produk terlaris (real dari DB, update realtime tiap ada transaksi baru) |
| **Sidebar "Food Order"** | Customer pilih makanan buat dipesan | Halaman utama KASIR: pilih menu → masuk ke cart → checkout. Ini jadi core transaksi |
| **Sidebar "Favorite"** | Menu favorit customer | Menu "Sering Dipesan" — quick-add produk terlaris biar kasir input lebih cepat saat jam sibuk |
| **Sidebar "Message"** | Chat customer-driver | Log komunikasi internal: notifikasi dari dapur (order siap), notifikasi dari admin (perubahan harga/stok), atau dihilangkan kalau tidak relevan |
| **Sidebar "Order History"** | Riwayat pesanan customer | Riwayat transaksi kasir (bisa difilter per shift/tanggal), termasuk detail void/refund |
| **Sidebar "Bills"** | Tagihan customer | Rekap tagihan per meja (dine-in) yang belum settle, atau riwayat struk yang sudah dicetak |
| **Sidebar "Settings"** | Setting akun customer | Setting kasir: printer, metode pembayaran aktif, ganti PIN, buka/tutup shift |
| **Panel Saldo + Top Up/Transfer** | Saldo wallet customer buat bayar | **Panel Kas Shift Kasir**: modal awal shift, kas masuk (cash sales), kas keluar (kembalian/pengeluaran kecil), saldo kas real-time. "Top Up" jadi "Input Modal Awal", "Transfer" jadi "Setor Kas ke Admin" |
| **Kategori Produk** | Kategori makanan buat customer browse | Kategori menu di POS (Makanan, Minuman, Snack, dll) — tetap sama fungsinya, tapi datanya dari tabel `categories` yang admin kelola |
| **Grid Popular Dishes** | Rekomendasi makanan populer | Grid menu utama POS — diurutkan berdasarkan data penjualan real (bukan hardcode), dengan indikator stok habis otomatis nge-gray-out |
| **Panel Order Menu (Cart)** | Keranjang pesanan customer | **Cart transaksi kasir** — tempat kasir kumpulin item sebelum checkout, harus bisa edit qty, hapus item, kasih catatan, apply diskon/voucher, pilih metode bayar, lalu proses ke pembayaran & cetak struk |

---

## 🧩 LOGIKA SISTEM YANG WAJIB DIBANGUN (NO SHORTCUT)

### 1. Alur Transaksi (Harus Atomic — All or Nothing)
```
Kasir pilih menu → tambah ke cart → (opsional: apply diskon/voucher) → checkout 
→ pilih metode bayar → SISTEM HARUS SEKALIGUS:
   a. Simpan record transaksi ke database
   b. Kurangi stok bahan baku sesuai resep (BOM) tiap item terjual
   c. Update kas shift (kalau cash) atau catat metode non-cash
   d. Kirim order ke Kitchen Display/printer dapur
   e. Generate nomor struk unik + cetak
   f. Update dashboard admin secara realtime (tanpa refresh)
Kalau salah satu langkah gagal (misal stok tidak cukup), SELURUH transaksi harus 
di-rollback — jangan sampai stok kepotong tapi transaksi gagal tersimpan, atau sebaliknya.
```

### 2. Perhitungan Keuangan (Wajib Presisi)
- Subtotal = Σ(harga item × qty)
- Diskon dihitung SEBELUM pajak (atau sesuai aturan bisnis yang lo pilih — tapi harus konsisten di semua transaksi)
- Pajak/service charge dihitung dari subtotal setelah diskon
- Total akhir = subtotal - diskon + pajak + service charge
- Kembalian = uang dibayar - total akhir (validasi: uang dibayar tidak boleh kurang dari total, kecuali metode split/hutang)
- Semua perhitungan pakai tipe data desimal presisi (bukan float biasa) buat hindari rounding error

### 3. Void/Refund (Harus Ada Jejak Audit)
- Void hanya bisa dilakukan sebelum transaksi "closed"/sudah lama, sesuai kebijakan
- Wajib isi alasan void
- Kalau di bawah role tertentu, wajib approval supervisor/admin (real approval flow, bukan sekadar checkbox)
- Stok yang sudah terpotong HARUS dikembalikan otomatis ke inventory
- Tercatat di log audit: siapa void, kapan, alasan apa

### 4. Manajemen Shift Kasir
- Buka shift: input modal awal kas (real angka, tersimpan ke DB)
- Selama shift: semua transaksi cash ter-track otomatis ke kas shift tersebut
- Tutup shift: sistem hitung kas seharusnya (modal awal + cash sales - kas keluar), kasir input kas fisik yang dihitung manual, sistem tampilkan selisih (surplus/minus) — ini harus akurat, bukan estimasi

### 5. Realtime Sync Antar Device
- Kasir input transaksi di tablet → Dashboard Admin di device lain harus update SAAT ITU JUGA (pakai Supabase Realtime/WebSocket, bukan polling interval lambat)
- Stok berkurang di 1 device → device kasir lain yang buka menu yang sama harus lihat stok terbaru
- Order masuk ke Kitchen Display harus muncul dalam hitungan detik, bukan delay

### 6. Validasi Anti-Human-Error
- Tidak bisa checkout kalau cart kosong
- Tidak bisa jual item yang stoknya 0 (sistem block otomatis, bukan cuma warning)
- Tidak bisa apply voucher yang sudah expired/kuota habis (validasi server-side, bukan cuma di frontend)
- Tidak bisa tutup shift kalau masih ada transaksi "pending"/belum settle

---

## 🗄️ STRUKTUR DATABASE MINIMAL (WAJIB ADA)

```
users            (id, nama, role, pin_hash, outlet_id, status)
outlets          (id, nama, alamat, jam_operasional)
categories       (id, nama, outlet_id)
products         (id, nama, kategori_id, harga, stok_tracking_bool, foto, status_aktif)
product_variants (id, product_id, nama_varian, harga_tambahan)
ingredients      (id, nama, satuan, stok_saat_ini, stok_minimum)
recipes          (id, product_id, ingredient_id, jumlah_terpakai)
shifts           (id, kasir_id, outlet_id, modal_awal, kas_akhir_sistem, kas_akhir_fisik, selisih, waktu_buka, waktu_tutup)
transactions     (id, shift_id, kasir_id, nomor_struk, subtotal, diskon, pajak, total, metode_bayar, status, waktu)
transaction_items (id, transaction_id, product_id, varian_id, qty, harga_satuan, catatan)
vouchers         (id, kode, tipe_diskon, nilai, min_belanja, kuota, tanggal_expired)
void_logs        (id, transaction_id, void_by, alasan, waktu, approved_by)
audit_logs       (id, user_id, aksi, detail, waktu)
```

---

## ✅ CHECKLIST VALIDASI SEBELUM DIANGGAP "SELESAI"

- [ ] Coba transaksi lengkap dari pilih menu sampai cetak struk — cek angka totalnya manual, harus pas
- [ ] Coba void transaksi — cek stok bahan baku kembali ke jumlah semula
- [ ] Buka 2 device berbeda (kasir + admin) — transaksi di kasir langsung muncul di dashboard admin tanpa refresh
- [ ] Coba jual produk sampai stok 0 — sistem otomatis block, bukan cuma kasih warning
- [ ] Coba pakai voucher expired — sistem tolak dari server, bukan cuma disable tombol di frontend
- [ ] Tutup shift — angka selisih kas harus sesuai perhitungan manual (modal awal + cash in - cash out vs kas fisik)
- [ ] Cek semua data di dashboard admin (revenue, best seller, dll) berubah real sesuai transaksi yang baru dibuat, tidak ada angka hardcode
- [ ] Restart server/refresh browser — semua data tetap ada (persisten di database, bukan hilang karena disimpan di state sementara)

---

*Prompt ini dirancang khusus buat rombak desain "Delivero" existing lo jadi sistem 
BY.CASHIER UMKM yang beneran jalan operasional — bukan sekadar tampilan cantik tanpa isi.*
