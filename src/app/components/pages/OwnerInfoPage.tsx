import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck, Coffee, Database, Heart, HeartHandshake, Layers3, LockKeyhole, MonitorSmartphone, PackageSearch, ReceiptText, ShieldCheck, Sparkles, Star, Store, Zap } from "lucide-react";
import { defaultOwnerContent, getOwnerContent, OwnerContent } from "../../content/ownerContent";

type OwnerInfoPageProps = {
  page: "privacy" | "about" | "donate";
  onBack: () => void;
  onNotice: (message: string) => void;
};

const policySections = [
  { title: "Data yang Dikumpulkan", icon: Database, points: ["Registrasi hanya memerlukan nama toko, Gmail, dan PIN akun.", "BY.CASHIER tidak meminta atau menyimpan dokumen KTP maupun NPWP.", "Data operasional dapat mencakup katalog menu, transaksi, dan pengaturan toko yang Anda kelola."] },
  { title: "Tujuan Penggunaan Data", icon: Sparkles, points: ["Mengaktifkan akun, fitur kasir, stok, laporan, dan pengaturan bisnis.", "Menyediakan bantuan teknis, notifikasi penting, serta peningkatan layanan.", "Menjaga keandalan sinkronisasi data antar perangkat yang Anda gunakan."] },
  { title: "Penyimpanan dan Keamanan", icon: LockKeyhole, points: ["Akses akun dilindungi autentikasi dan kontrol peran pengguna.", "Data diproses dengan langkah keamanan yang wajar sesuai kebutuhan layanan.", "Kami menerapkan prinsip minimisasi data: hanya data relevan yang digunakan."] },
  { title: "Pembagian Data ke Pihak Ketiga", icon: Layers3, points: ["Data dapat diproses oleh layanan cloud sync dan payment gateway untuk menjalankan fitur yang dipilih.", "Pihak tersebut bertindak sebagai penyedia layanan pendukung, bukan pemilik data bisnis Anda.", "Kami tidak menjual data pribadi maupun data operasional toko kepada pihak lain."] },
  { title: "Hak Pengguna", icon: BadgeCheck, points: ["Meminta akses, koreksi, atau penghapusan data pribadi sesuai ketentuan yang berlaku.", "Mengelola akses staff dan izin operasional dari akun Admin Owner.", "Menarik persetujuan pemrosesan data tertentu bila tidak mengganggu kewajiban layanan."] },
  { title: "Cache dan Data Lokal", icon: MonitorSmartphone, points: ["Cache lokal dipakai untuk membantu mode offline dan mempercepat pengalaman kasir.", "Ini bukan cookie browser untuk iklan atau pelacakan lintas situs.", "Data lokal dapat diperbarui atau dibersihkan saat sinkronisasi dan pengaturan perangkat berubah."] },
];

const featureCards = [
  { icon: Zap, title: "Kasir Cepat", text: "Proses pesanan, pembayaran, dan cetak nota dalam satu alur." },
  { icon: PackageSearch, title: "Kelola Stok", text: "Pantau ketersediaan menu dan kebutuhan operasional harian." },
  { icon: ReceiptText, title: "Laporan Penjualan", text: "Lihat ringkasan transaksi untuk pengambilan keputusan yang lebih jelas." },
  { icon: MonitorSmartphone, title: "Multi Perangkat", text: "Akses sistem sesuai peran dari perangkat yang mendukung pekerjaan tim." },
];

const donationTiers = [
  { icon: Coffee, title: "Traktir Kopi", caption: "Bahan bakar ngoding!", amount: "Rp10.000" },
  { icon: Zap, title: "Boost Semangat", caption: "Energi untuk fitur baru", amount: "Rp25.000" },
  { icon: Star, title: "Super Supporter", caption: "Jadi bagian dari perjalanan BY.CASHIER", amount: "Rp50.000+" },
];

function OwnerHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return <header className="sticky top-0 z-40 border-b border-[#1A1150]/10 bg-white/92 backdrop-blur"><div className="mx-auto flex h-20 max-w-4xl items-center gap-4 px-5 sm:px-8"><button onClick={onBack} aria-label="Kembali ke Pengaturan" className="grid size-11 place-items-center rounded-full bg-[#1A1150] text-white shadow-sm transition hover:bg-[#2A1D7A]"><ArrowLeft size={20}/></button><h1 className="font-['Poppins'] text-sm font-extrabold tracking-[.14em] text-[#1A1150] sm:text-base">{title}</h1></div></header>;
}

function DarkCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-[18px] border border-white/[.14] bg-gradient-to-br from-[#1A1150] to-[#2A1D7A] p-5 text-white shadow-[0_14px_30px_rgba(26,17,80,.12)] sm:p-7 ${className}`}>{children}</section>;
}

function PrivacyPage({ content }: { content: OwnerContent }) {
  return <div className="space-y-4"><p className="px-1 text-center font-['Poppins'] text-xs font-medium text-[#746e9a]">Terakhir diperbarui: {content.privacyUpdatedAt}</p><DarkCard><p className="font-['Poppins'] text-sm leading-7 text-[#E7E4F7]">{content.privacyIntro}</p></DarkCard>{policySections.map(({title,icon:Icon,points}, index) => <DarkCard key={title}><div className="flex items-center gap-3"><span className="grid size-9 place-items-center rounded-xl bg-[#F4D900] text-[#1A1150]"><Icon size={17}/></span><h2 className="font-['Poppins'] text-base font-extrabold text-white"><span className="text-[#F4D900]">{index + 1}. </span>{title}</h2></div><ul className="mt-5 grid gap-3">{points.map(point => <li key={point} className="flex gap-3 font-['Poppins'] text-sm leading-6 text-[#E7E4F7]"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#F4D900]"/>{point}</li>)}</ul></DarkCard>)}</div>;
}

function AboutPage({ onNotice, content }: Pick<OwnerInfoPageProps, "onNotice"> & { content: OwnerContent }) {
  const initials = content.contributorName.split(" ").map(part => part[0]).slice(0,2).join("").toUpperCase();
  return <div className="space-y-4"><DarkCard className="overflow-hidden"><div className="flex items-center gap-4"><span className="grid size-14 place-items-center rounded-2xl bg-[#F4D900] text-[#1A1150]"><Store size={28}/></span><div><p className="font-['Poppins'] text-[10px] font-extrabold tracking-[.2em] text-[#F4D900]">UMKM POS</p><h2 className="font-['Poppins'] text-2xl font-extrabold">{content.appName}</h2></div></div><p className="mt-7 font-['Poppins'] text-lg font-semibold leading-8 text-[#E7E4F7]">{content.tagline}</p></DarkCard><DarkCard><h2 className="font-['Poppins'] text-lg font-extrabold">Tentang {content.appName}</h2><p className="mt-3 font-['Poppins'] text-sm leading-7 text-[#E7E4F7]">{content.aboutDescription}</p></DarkCard><DarkCard><h2 className="font-['Poppins'] text-lg font-extrabold">Fitur Utama</h2><div className="mt-5 grid gap-3 sm:grid-cols-2">{featureCards.map(({icon:Icon,title,text}) => <article key={title} className="rounded-2xl border border-white/[.12] bg-[#251A6E] p-4"><span className="grid size-9 place-items-center rounded-xl bg-[#F4D900] text-[#1A1150]"><Icon size={17}/></span><h3 className="mt-4 font-['Poppins'] text-sm font-extrabold">{title}</h3><p className="mt-1.5 font-['Poppins'] text-xs leading-5 text-[#B4AEDD]">{text}</p></article>)}</div></DarkCard><DarkCard><h2 className="font-['Poppins'] text-lg font-extrabold">Contributors</h2><div className="mt-5 flex items-center gap-4 rounded-2xl border border-white/[.12] bg-[#251A6E] p-4">{content.contributorImage ? <img src={content.contributorImage} alt={content.contributorName} className="size-14 rounded-full border border-[#F4D900]/70 object-cover"/> : <span className="grid size-14 place-items-center rounded-full border border-[#F4D900]/70 bg-[#1A1150] font-['Poppins'] text-lg font-extrabold text-[#F4D900]">{initials}</span>}<div><h3 className="font-['Poppins'] text-sm font-extrabold">{content.contributorName}</h3><p className="mt-1 font-['Poppins'] text-xs text-[#B4AEDD]">{content.contributorRole}</p></div></div></DarkCard><DarkCard className="text-center"><p className="font-['Poppins'] text-sm leading-6 text-[#E7E4F7]">Tertarik berkolaborasi atau memberi masukan untuk {content.appName}?</p><button onClick={() => onNotice(content.contactMessage)} className="mt-5 rounded-xl bg-[#F4D900] px-5 py-3 font-['Poppins'] text-sm font-extrabold text-[#1A1150] transition hover:brightness-105">Hubungi Kami</button></DarkCard></div>;
}

function DonatePage({ onNotice, content }: Pick<OwnerInfoPageProps, "onNotice"> & { content: OwnerContent }) {
  return <div className="space-y-4"><DarkCard className="text-center"><span className="mx-auto grid size-16 place-items-center rounded-full bg-[#F4D900] text-[#1A1150]"><Heart size={31} fill="currentColor"/></span><h2 className="mt-5 font-['Poppins'] text-2xl font-extrabold">Dukung {content.appName}!</h2><p className="mt-3 font-['Poppins'] text-sm leading-7 text-[#E7E4F7]">{content.donateIntro}</p></DarkCard><div className="grid gap-3">{content.donationTiers.map(({title,caption,amount}, index) => { const Icon = donationTiers[index]?.icon || Heart; return <DarkCard key={title} className="!p-4"><div className="flex items-center gap-4"><span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#251A6E] text-[#F4D900]"><Icon size={23}/></span><div className="min-w-0 flex-1"><h3 className="font-['Poppins'] text-base font-extrabold">{title}</h3><p className="font-['Poppins'] text-xs text-[#B4AEDD]">{caption}</p></div><strong className="font-['Poppins'] text-sm text-[#F4D900]">{amount}</strong></div></DarkCard>})}</div><button onClick={() => content.saweriaUrl ? window.open(content.saweriaUrl, "_blank", "noopener,noreferrer") : onNotice("Tautan Saweria belum diatur di Founder Control.")} className="flex w-full items-center justify-center gap-2 rounded-[18px] bg-[#F4D900] px-5 py-4 font-['Poppins'] text-sm font-extrabold text-[#1A1150] shadow-[0_10px_24px_rgba(244,217,0,.28)] transition hover:brightness-105"><HeartHandshake size={19}/>Donate via Saweria</button><DarkCard><h2 className="font-['Poppins'] text-base font-extrabold">Metode Pembayaran</h2><p className="mt-2 font-['Poppins'] text-sm text-[#B4AEDD]">Donasi melalui Saweria mendukung pilihan pembayaran berikut.</p><div className="mt-5 flex flex-wrap gap-2">{["GoPay", "OVO", "DANA", "LinkAja", "QRIS"].map(method => <span key={method} className="rounded-full border border-white/[.16] bg-[#251A6E] px-4 py-2 font-['Poppins'] text-xs font-semibold text-[#E7E4F7]">{method}</span>)}</div></DarkCard></div>;
}

export function OwnerInfoPage({ page, onBack, onNotice }: OwnerInfoPageProps) {
  const [content, setContent] = useState<OwnerContent>(defaultOwnerContent);
  useEffect(() => { void getOwnerContent().then(setContent).catch(() => undefined); const channel = new BroadcastChannel("bycashier-owner-content"); channel.onmessage = event => setContent(event.data as OwnerContent); return () => channel.close(); }, []);
  const title = page === "privacy" ? "PRIVACY POLICY" : page === "about" ? "ABOUT" : "DONATE";
  return <div className="min-h-screen bg-white"><OwnerHeader title={title} onBack={onBack}/><main className="mx-auto max-w-3xl px-5 py-7 pb-28 sm:px-8 sm:py-10"><div className="font-['Poppins']">{page === "privacy" ? <PrivacyPage content={content}/> : page === "about" ? <AboutPage content={content} onNotice={onNotice}/> : <DonatePage content={content} onNotice={onNotice}/>}</div></main></div>;
}
