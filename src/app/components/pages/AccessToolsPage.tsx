import { useMemo, useState } from "react";
import { BadgePercent, Boxes, MonitorUp, Undo2 } from "lucide-react";
import { Food, Transaction } from "../../types";

type Mode = "kds" | "discounts" | "refunds" | "stock";
const config = {
  kds: { title: "Kitchen Display", subtitle: "Antrian pesanan yang diteruskan dari Kasir POS.", icon: MonitorUp, action: "Tandai pesanan siap" },
  discounts: { title: "Diskon", subtitle: "Kontrol diskon item dan voucher yang dipakai di outlet.", icon: BadgePercent, action: "Aktifkan diskon" },
  refunds: { title: "Void / Refund", subtitle: "Tinjau transaksi sebelum pembatalan atau pengembalian dana.", icon: Undo2, action: "Ajukan void" },
  stock: { title: "Stok menu", subtitle: "Pantau ketersediaan menu yang tampil di Kasir POS.", icon: Boxes, action: "Ubah status menu" },
} as const;

export function AccessToolsPage({ mode, products, transactions }: { mode: Mode; products: Food[]; transactions: Transaction[] }) {
  const [notice, setNotice] = useState(""); const item = config[mode]; const Icon = item.icon;
  const rows = useMemo(() => mode === "stock" ? products.map(product => ({ primary: product.name, secondary: product.category, status: product.active === false ? "Nonaktif" : "Tersedia" })) : transactions.slice(0, 8).map(transaction => ({ primary: transaction.invoice, secondary: `${transaction.customer} · ${transaction.payment}`, status: transaction.status || "Selesai" })), [mode, products, transactions]);
  return <div className="px-5 pb-28 pt-5 lg:px-8 lg:pb-10"><div className="flex flex-wrap items-end justify-between gap-4"><div><div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-2xl bg-[#ffe51c] text-[#1c075c]"><Icon size={20}/></span><div><p className="text-xs font-bold tracking-[.12em] text-[#7c5cbf]">AKSES OPERASIONAL</p><h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#1c075c]">{item.title}</h1></div></div><p className="mt-4 text-sm text-gray-500">{item.subtitle}</p></div><button onClick={() => setNotice(`${item.action} siap diproses.`)} className="rounded-xl bg-[#1c075c] px-4 py-3 text-sm font-bold text-white">{item.action}</button></div>{notice && <p className="mt-5 rounded-xl bg-[#fff8d5] px-4 py-3 text-sm text-[#745d00]">{notice}</p>}<section className="mt-6 overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100"><header className="flex items-center justify-between border-b border-gray-100 px-6 py-5"><div><h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Data operasional</h2><p className="mt-1 text-xs text-gray-400">{rows.length} data tersedia</p></div><span className="rounded-full bg-[#e7f5ec] px-3 py-1.5 text-[10px] font-bold text-[#287347]">AKTIF</span></header><div className="divide-y divide-gray-100">{rows.map((row, index) => <article key={`${row.primary}-${index}`} className="flex items-center justify-between gap-4 px-6 py-4"><div><p className="font-semibold text-[#1c075c]">{row.primary}</p><p className="mt-1 text-xs text-gray-400">{row.secondary}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${row.status === "Nonaktif" ? "bg-[#fff0f0] text-[#b94c5b]" : "bg-[#f0ebff] text-[#68449c]"}`}>{row.status}</span></article>)}{!rows.length && <p className="px-6 py-12 text-center text-sm text-gray-400">Belum ada data untuk ditampilkan.</p>}</div></section></div>;
}
