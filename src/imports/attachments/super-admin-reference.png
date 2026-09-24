KONTEKS PROYEK
Aplikasi: BY.CASHIER UMKM — sistem POS multi-tenant (SaaS) berbasis desain existing "Delivero Food" (jangan ubah visual/tema dashboard toko, hanya remap logika & tambah fitur baru).

Sistem punya DUA jenis dashboard terpisah total secara layout, sidebar, ikon hamburger, dan fitur — TIDAK BOLEH satu sidebar yang isinya di-toggle:
1. Dashboard Super Admin (platform owner) — route prefix /superadmin
2. Dashboard Toko (Owner/Admin Cabang/Kasir/Driver) — route existing /admin, /kasir, dst

===========================================
1. STRUKTUR ROLE & HIRARKI
===========================================
- super_admin  : kontrol penuh seluruh platform, tenant_id = null
- sub_admin    : staf internal super_admin dengan permission terbatas (opsional, lihat bagian 7)
- owner        : pemilik toko, kelola cabang & staff miliknya sendiri
- admin_cabang : kelola satu cabang milik tenant tsb
- kasir        : akses transaksi & kasir saja
- driver       : akses order delivery saja

Setiap user (kecuali super_admin & sub_admin) WAJIB terikat ke satu tenant_id. Data antar tenant terisolasi total — user tenant A tidak boleh bisa akses/lihat data tenant B dengan cara apapun (termasuk manipulasi URL/API/console).

===========================================
2. SKEMA DATA (LOGIKA WAJIB)
===========================================
Table users:
- id, tenant_id (nullable, null khusus super_admin/sub_admin)
- username (unik per tenant)
- email (format Gmail wajib divalidasi, unik per tenant)
- pin (hashed, jangan simpan plain text)
- role (enum: super_admin, owner, admin_cabang, kasir, driver)
- status (enum: pending, active, suspended, rejected)
- created_at, approved_at, approved_by, last_login_at, last_login_device

Validasi wajib:
- Email harus format valid & domain gmail.com
- Kombinasi (tenant_id, username) unik per tenant
- Kombinasi (tenant_id, email) unik per tenant

Table tenants:
- id, nama_toko, owner_user_id, status (pending, active, suspended, expired)
- subscription_plan_id, subscription_status (trial, active, expired, canceled)
- trial_ends_at, created_at

Table subscription_plans:
- id, nama_paket (Free/Pro/Enterprise), harga, fitur_termasuk (json), batas_cabang, batas_staff, batas_transaksi_per_bulan

Table invoices:
- id, tenant_id, plan_id, jumlah, status (unpaid, paid, overdue), due_date, paid_at

Table feature_flags:
- id, tenant_id, nama_fitur, is_enabled

Table audit_logs:
- id, actor_id, actor_role, aksi, target_type, target_id, keterangan, created_at

Table support_tickets:
- id, tenant_id, dibuat_oleh, subjek, deskripsi, status (open, in_progress, resolved, closed), prioritas, created_at, resolved_at

Table broadcasts:
- id, judul, isi, target (all/specific_plan/specific_tenant), dikirim_oleh, created_at

Aturan penting:
- Super Admin dibuat manual/seed, tidak lewat form daftar publik.
- Semua angka finansial (revenue, invoice) dihitung dari data transaksi real, bukan estimasi/dummy.

===========================================
3. ALUR REGISTRASI OWNER TOKO
===========================================
1. Owner isi form daftar dengan toggle "Daftar sebagai Pemilik Toko": Username + Email Gmail + PIN.
2. Sistem otomatis buat 1 tenant baru (status "pending") + 1 user role "owner" (status "pending"), saling terhubung.
3. Tenant baru otomatis masuk plan "Free/Trial" default sampai owner upgrade nanti.
4. Layar tampilkan: "Akun sedang menunggu persetujuan, maksimal 1x24 jam kerja."
5. Login tetap pakai Username + PIN (email dipakai untuk notifikasi & reset PIN, bukan untuk login harian).
6. Selama pending, login diblok — cek status SEBELUM validasi PIN. Pesan beda untuk pending vs rejected.
7. Approval manual oleh Super Admin saja (tidak ada auto-approve otomatis walau lewat 24 jam).

===========================================
4. ALUR TAMBAH AKUN STAFF
===========================================
1. Owner/Admin Cabang buka menu "Staff & Role" → klik "Tambah Staff".
2. Input: Username + Email Gmail + PIN.
3. Role default "kasir", status langsung "active" (tanpa approval Super Admin — beda dari alur Owner).
4. Owner bisa ubah role staff (kasir/admin_cabang/driver) setelah akun dibuat, dari menu yang sama.
5. Login staff tetap pakai Username + PIN.

===========================================
5. DASHBOARD SUPER ADMIN — HALAMAN & FITUR LENGKAP
===========================================
Layout /superadmin, tema visual & sidebar beda total dari dashboard toko (bukan warna kuning "Delivero").

a. OVERVIEW
   - Total tenant (aktif/pending/suspended), total user platform, total transaksi & revenue gabungan semua tenant (real-time dari data agregasi)
   - Grafik pertumbuhan tenant baru & revenue per bulan
   - Top 5 tenant dengan transaksi tertinggi

b. ANTRIAN APPROVAL
   - List tenant/owner pending, detail Username + Email + waktu daftar
   - Approve → tenant & owner jadi "active" bersamaan (1 aksi)
   - Reject → wajib isi alasan, status "rejected"

c. MANAJEMEN TENANT
   - List semua tenant, filter by status/plan
   - Detail tenant: info toko, jumlah cabang, staff, riwayat transaksi
   - Suspend/aktifkan kembali tenant kapan saja
   - Paksa logout semua device milik tenant tertentu (misal kasus fraud)

d. MANAJEMEN USER GLOBAL
   - List semua user lintas tenant (username, email, role, status)
   - Reset PIN, suspend/aktifkan user tanpa masuk ke dashboard tenant tsb
   - Lihat last login & device terakhir per user

e. LANGGANAN & BILLING
   - Kelola paket langganan (buat/edit plan: harga, batas cabang, batas staff, fitur termasuk)
   - List invoice semua tenant (paid/unpaid/overdue), bisa tandai lunas manual (untuk pembayaran transfer manual)
   - Notifikasi otomatis ke tenant saat mendekati masa trial/langganan habis (H-3, H-1, hari-H) — dikirim ke email tenant
   - Tenant yang expired otomatis downgrade ke fitur terbatas (bukan langsung disuspend total, kecuali diatur lain)

f. FEATURE FLAGS
   - Toggle aktif/nonaktif fitur tertentu per tenant (misal fitur Driver Ojek, Split Payment, dll) di luar batasan plan
   - Toggle fitur secara global untuk semua tenant (misal rilis fitur baru bertahap)

g. SUPPORT / TIKET BANTUAN
   - List keluhan/pertanyaan dari tenant, status open/in_progress/resolved
   - Assign tiket ke sub_admin tertentu (jika ada), prioritas (low/medium/high)
   - Riwayat percakapan per tiket

h. BROADCAST & NOTIFIKASI
   - Kirim pengumuman ke semua tenant / plan tertentu / tenant spesifik (via email & in-app notif)
   - Riwayat broadcast yang pernah dikirim

i. AUDIT LOG
   - Catatan semua aksi sensitif (approve, reject, suspend, reset pin, edit plan, dll) — siapa (actor), aksi apa, ke siapa/apa, kapan
   - Bisa difilter by actor atau tanggal

j. MANAJEMEN SUB-ADMIN (opsional tapi disarankan)
   - Super Admin bisa buat akun sub_admin dengan permission terbatas (misal cuma boleh handle approval & support tiket, tanpa akses billing)
   - Permission diatur granular per menu (checklist akses per halaman)

k. PENGATURAN SISTEM
   - Konfigurasi umum platform (nama platform, kontak support, dll)
   - Kelola integrasi (payment gateway, email notifikasi)
   - Backup/export data platform (tenant list, invoice, dll ke CSV)

===========================================
6. DASHBOARD TOKO (OWNER/ADMIN/KASIR) — TETAP DESAIN LAMA
===========================================
- Sidebar & fitur existing (Dashboard, Food Order, Message, Order History, Bills, Settings) tidak berubah tampilan.
- Tambahan menu "Staff & Role" khusus owner/admin_cabang: kelola staff (tambah akun via Username + Email + PIN, ubah role, suspend, reset PIN) dalam tenant sendiri.
- Tambahan menu "Langganan Saya": lihat plan aktif, sisa masa trial/aktif, tombol upgrade, riwayat invoice milik tenant sendiri saja.
- Semua query WAJIB difilter otomatis by tenant_id dari session/token — tidak ada cara lihat data tenant lain lewat manipulasi apapun.

===========================================
7. LOGIKA AUTH & KEAMANAN
===========================================
- Login menggunakan Username + PIN untuk semua role toko (owner, admin_cabang, kasir, driver) — satu halaman/form yang sama, sistem membaca role & tenant_id dari database lalu redirect ke dashboard yang sesuai.
- Super Admin login lewat halaman terpisah (/superadmin/login), tidak digabung dengan form login toko.
- Token/session simpan: user_id, role, tenant_id (null untuk super_admin/sub_admin), status, permission (khusus sub_admin).
- Middleware wajib cek role di SETIAP request ke /superadmin/* — hanya super_admin (dan sub_admin sesuai permission-nya) yang lolos, selain itu redirect/403.
- Middleware wajib cek tenant_id di SETIAP request ke /admin/* atau /kasir/* — user hanya akses data dengan tenant_id sama dengan miliknya.
- Sub_admin hanya bisa akses menu yang di-permission-kan; menu lain hidden DAN diblok di level API (bukan cuma disembunyikan di UI).
- PIN wajib di-hash, jangan pernah simpan/tampilkan plain text.
- Email dipakai khusus untuk notifikasi sistem & reset PIN, bukan untuk proses login harian.
- Tidak ada dummy data — semua status, approval, billing, dan log harus real dan konsisten dengan database.

===========================================
8. KRITERIA "SELESAI" (DEFINITION OF DONE)
===========================================
- Owner baru daftar (Username + Email + PIN) → pending → tidak bisa login → muncul di Antrian Approval → di-approve → login pakai Username + PIN ke dashboard tokonya, otomatis dapat plan trial default.
- Owner bisa tambah staff (Username + Email + PIN) dari menu Staff & Role, staff langsung aktif tanpa approval Super Admin.
- Super Admin login lewat halaman terpisah, dashboard dengan sidebar & fitur sama sekali beda dari dashboard toko.
- Semua fitur di bagian 5 (a–k) berfungsi nyata dengan data real dari database, bukan mockup statis.
- Tidak ada satupun jalan bagi role toko untuk mengakses halaman/data milik Super Admin maupun tenant lain.
- Sub_admin (jika dipakai) hanya bisa melakukan aksi sesuai permission yang diberikan, dicoba akses di luar itu harus ditolak sistem.