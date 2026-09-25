import { projectId, publicAnonKey } from "../../../utils/supabase/info";

export type DonationTier = { title: string; caption: string; amount: string };
export type OwnerContent = {
  id?: string;
  appName: string;
  tagline: string;
  privacyUpdatedAt: string;
  privacyIntro: string;
  aboutDescription: string;
  contributorName: string;
  contributorRole: string;
  contributorImage: string;
  contactMessage: string;
  donateIntro: string;
  saweriaUrl: string;
  donationTiers: DonationTier[];
};

export const defaultOwnerContent: OwnerContent = {
  appName: "BY.CASHIER",
  tagline: "Kasir yang tenang di depan, kuat di belakang.",
  privacyUpdatedAt: "25 September 2026",
  privacyIntro: "BY.CASHIER menghargai dan melindungi privasi setiap pengguna. Kebijakan ini menjelaskan data yang kami kumpulkan, gunakan, dan lindungi sesuai Undang-Undang Nomor 27 Tahun 2022 tentang Perlindungan Data Pribadi (UU PDP).",
  aboutDescription: "BY.CASHIER adalah sistem POS untuk UMKM F&B yang membantu pemilik bisnis mengelola transaksi, menu, stok, dan tim dalam satu pengalaman kerja yang rapi. Kami merancang alur yang terasa ringan saat jam ramai, namun tetap memberi kendali operasional yang diperlukan owner.",
  contributorName: "Bayu Raja Syah",
  contributorRole: "Founder & Lead Developer",
  contributorImage: "",
  contactMessage: "Silakan hubungi tim BY.CASHIER melalui kanal resmi Founder.",
  donateIntro: "BY.CASHIER dikembangkan secara independen untuk membantu UMKM bekerja lebih rapi. Dukungan Anda membantu kami terus menghadirkan peningkatan yang berguna.",
  saweriaUrl: "",
  donationTiers: [
    { title: "Traktir Kopi", caption: "Bahan bakar ngoding!", amount: "Rp10.000" },
    { title: "Boost Semangat", caption: "Energi untuk fitur baru", amount: "Rp25.000" },
    { title: "Super Supporter", caption: "Jadi bagian dari perjalanan BY.CASHIER", amount: "Rp50.000+" },
  ],
};

const endpoint = `https://${projectId}.supabase.co/functions/v1/make-server-df04cfb8/platform/system-settings`;
const localKey = "bycashier-owner-content";

export function mergeOwnerContent(value?: Partial<OwnerContent>): OwnerContent {
  return { ...defaultOwnerContent, ...value, donationTiers: value?.donationTiers?.length ? value.donationTiers : defaultOwnerContent.donationTiers };
}

export async function getOwnerContent(): Promise<OwnerContent> {
  try { const response = await fetch(endpoint, { headers: { Authorization: `Bearer ${publicAnonKey}` } }); if (!response.ok) throw new Error(); const data = await response.json() as { records?: (OwnerContent & { type?: string })[] }; const record = data.records?.find(item => item.type === "owner-content"); if (record) return mergeOwnerContent(record); } catch { /* gunakan cache lokal saat edge function belum ter-deploy */ }
  try { return mergeOwnerContent(JSON.parse(window.localStorage.getItem(localKey) || "null") || undefined); } catch { return defaultOwnerContent; }
}

export async function saveOwnerContent(content: OwnerContent): Promise<OwnerContent> {
  const local = mergeOwnerContent(content); window.localStorage.setItem(localKey, JSON.stringify(local)); new BroadcastChannel("bycashier-owner-content").postMessage(local);
  try { const existing = await getOwnerContent(); const method = existing.id ? "PUT" : "POST"; const url = existing.id ? `${endpoint}/${existing.id}` : endpoint; const response = await fetch(url, { method, headers: { Authorization: `Bearer ${publicAnonKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ ...local, type: "owner-content" }) }); if (!response.ok) throw new Error("Konfigurasi server belum tersedia; perubahan disimpan pada browser ini."); const data = await response.json() as { record: OwnerContent }; return mergeOwnerContent(data.record); } catch (error) { return local; }
}
