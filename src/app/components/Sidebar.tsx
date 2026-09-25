import { BadgePercent, BarChart3, BotMessageSquare, Boxes, Heart, HeartHandshake, Info, LayoutDashboard, MonitorPlay, MonitorUp, PackageCheck, ReceiptText, Settings, ShieldCheck, ShoppingCart, Undo2, Utensils, WalletCards, X } from "lucide-react";
import { Page, Staff } from "../types";

const navItems = [
  { page: "dashboard" as Page, label: "Dashboard Manager", icon: LayoutDashboard },
  { page: "order" as Page, label: "Kasir", icon: ShoppingCart },
  { page: "kds" as Page, label: "Kitchen Display", icon: MonitorUp },
  { page: "discounts" as Page, label: "Diskon", icon: BadgePercent },
  { page: "refunds" as Page, label: "Void / Refund", icon: Undo2 },
  { page: "stock" as Page, label: "Stok", icon: Boxes },
  { page: "favorites" as Page, label: "Sering Dipesan", icon: Heart },
  { page: "history" as Page, label: "Laporan Transaksi", icon: PackageCheck },
  { page: "wallet" as Page, label: "Kas Shift", icon: WalletCards },
  { page: "settings" as Page, label: "Pengaturan", icon: Settings },
  { page: "cctv" as Page, label: "CCTV Monitoring", icon: MonitorPlay },
  { page: "closing" as Page, label: "Closing Kasir", icon: ReceiptText },
  { page: "reports" as Page, label: "Report", icon: BarChart3 },
  { page: "settlement" as Page, label: "Settlement", icon: WalletCards },
  { page: "ai-assistant" as Page, label: "Asisten AI", icon: BotMessageSquare },
  { page: "privacy-policy" as Page, label: "Privacy Policy", icon: ShieldCheck },
  { page: "about" as Page, label: "About BY.CASHIER", icon: Info },
  { page: "donate" as Page, label: "Donate Saweria", icon: HeartHandshake },
];

function isActive(navPage: Page, currentPage: Page) {
  if (navPage === currentPage) return true;
  if (navPage === "order" && (currentPage === "detail" || currentPage === "checkout")) return true;
  if (navPage === "history" && currentPage === "tracking") return true;
  return false;
}

interface SidebarProps {
  active: Page;
  go: (p: Page) => void;
  open: boolean;
  close: () => void;
  staff: Staff | null;
}

export function Sidebar({ active, go, open, close, staff }: SidebarProps) {
  const has = (permission: string) => Boolean(staff?.permissions.includes(permission));
  const isBusinessOwner = staff?.role === "Admin Owner";
  const canDashboard = staff?.role === "Admin Owner" ? has("Dashboard Manager") : staff?.role !== "Kasir" && staff?.role !== "Kitchen Display";
  const canCctv = has("CCTV Monitoring");
  // Kasir POS adalah jalur utama sesudah akun aktif; pembatasan detail tindakan tetap berlaku di halaman POS.
  const permissionByPage: Partial<Record<Page, string>> = { history: "Laporan", kds: "Kitchen Display", discounts: "Diskon", refunds: "Void / refund", stock: "Stok", cctv: "CCTV Monitoring", closing: "Closing Kasir", reports: "Report", settlement: "Settlement" };
  const ownerOnlyPages: Page[] = ["privacy-policy", "about", "donate"];
  const visibleNav = navItems.filter(item => (canDashboard || item.page !== "dashboard") && (!ownerOnlyPages.includes(item.page) || isBusinessOwner) && (!permissionByPage[item.page] || has(permissionByPage[item.page]!) || isBusinessOwner));
  return (
    <>
      {/* Backdrop */}
      <button
        onClick={close}
        aria-label="Close menu"
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden ${open ? "block" : "hidden"}`}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#1c075c] transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-6">
          <button
            onClick={() => { go(canDashboard ? "dashboard" : "order"); close(); }}
            className="flex items-center gap-3"
          >
            <div className="grid size-10 place-items-center rounded-2xl bg-[#ffe51c]">
              <Utensils size={18} className="text-[#1c075c]" strokeWidth={2.5} />
            </div>
            <div className="text-left">
              <div className="font-['Space_Grotesk'] text-lg font-bold leading-tight text-white">
                BY.CASHIER
              </div>
              <div className="text-[11px] text-white/40 leading-none">UMKM POS</div>
            </div>
          </button>
          <button
            onClick={close}
            className="rounded-xl p-1.5 text-white/50 hover:bg-white/10 transition lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav divider label */}
        <div className="px-6 pb-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-white/30">Main Menu</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
          {visibleNav.map(({ page, label, icon: Icon }) => {
            const active_ = isActive(page, active);
            return (
              <button
                key={page}
                onClick={() => { go(page); close(); }}
                className={`group flex w-full items-center gap-3.5 rounded-2xl px-4 py-3.5 text-sm font-medium transition-all duration-200 ${
                  active_
                    ? "bg-[#ffe51c] text-[#1c075c] shadow-[0_4px_16px_rgba(255,229,28,0.3)]"
                    : "text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={20} strokeWidth={active_ ? 2.5 : 2} />
                <span>{label}</span>
                {active_ && (
                  <span className="ml-auto size-1.5 rounded-full bg-[#1c075c] opacity-60" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Order Now CTA */}
        <div className="mx-3 mb-3">
          <div className="rounded-2xl bg-white/[0.08] border border-white/10 p-4">
            <p className="text-xs text-white/50">Shift aktif. Siap melayani?</p>
            <button
              onClick={() => { go("order"); close(); }}
              className="mt-3 w-full rounded-xl bg-[#ffe51c] py-3 text-sm font-bold text-[#1c075c] transition hover:brightness-105 active:scale-[0.98]"
            >
              Mulai transaksi →
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
