import { Heart, LayoutDashboard, PackageCheck, ShoppingCart, WalletCards } from "lucide-react";
import { Page, Staff } from "../types";

const items = [
  { page: "dashboard" as Page, label: "Home", icon: LayoutDashboard },
  { page: "order" as Page, label: "Kasir", icon: ShoppingCart },
  { page: "favorites" as Page, label: "Saved", icon: Heart },
  { page: "history" as Page, label: "History", icon: PackageCheck },
  { page: "wallet" as Page, label: "Wallet", icon: WalletCards },
];

function isActive(navPage: Page, currentPage: Page) {
  if (navPage === currentPage) return true;
  if (navPage === "order" && (currentPage === "detail" || currentPage === "checkout")) return true;
  if (navPage === "history" && currentPage === "tracking") return true;
  return false;
}

interface BottomNavProps {
  active: Page;
  go: (p: Page) => void;
  staff: Staff | null;
}

export function BottomNav({ active, go, staff }: BottomNavProps) {
  const visibleItems = items.filter(item => (staff?.role !== "Kasir" && staff?.role !== "Kitchen Display") || item.page !== "dashboard");
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 flex h-[72px] items-center justify-around border-t border-gray-100 bg-white px-1 lg:hidden safe-area-inset-bottom">
      {visibleItems.map(({ page, label, icon: Icon }) => {
        const on = isActive(page, active);
        return (
          <button
            key={page}
            onClick={() => go(page)}
            className="flex flex-1 flex-col items-center gap-1 py-2 transition-all"
          >
            <div
              className={`grid size-10 place-items-center rounded-2xl transition-all duration-200 ${
                on ? "bg-[#ffe51c] scale-110 shadow-[0_4px_12px_rgba(255,229,28,0.4)]" : ""
              }`}
            >
              <Icon
                size={20}
                strokeWidth={on ? 2.5 : 2}
                className={on ? "text-[#1c075c]" : "text-gray-400"}
              />
            </div>
            <span className={`text-[10px] font-medium ${on ? "text-[#1c075c]" : "text-gray-400"}`}>
              {label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
