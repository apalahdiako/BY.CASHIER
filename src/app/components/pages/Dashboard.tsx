import { useState } from "react";
import { Bell, ChevronRight, MapPin, Search, ShoppingCart, SlidersHorizontal } from "lucide-react";
import { CartItem, Food, Page } from "../../types";
import { FoodCard } from "../FoodCard";

const categories = [
  { label: "All", emoji: "🍽️" },
  { label: "Burgers", emoji: "🍔" },
  { label: "Pizza", emoji: "🍕" },
  { label: "Sushi", emoji: "🍣" },
  { label: "Chicken", emoji: "🍗" },
  { label: "Beverage", emoji: "🥤" },
  { label: "Bakery", emoji: "🧁" },
  { label: "Seafood", emoji: "🐟" },
];

interface DashboardProps {
  dishes: Food[];
  favorites: number[];
  cart: CartItem[];
  toggle: (id: number) => void;
  add: (food: Food) => void;
  detail: (food: Food) => void;
  go: (p: Page) => void;
  query?: string;
  setQuery?: (value: string) => void;
}

export function Dashboard({ dishes, favorites, cart, toggle, add, detail, go, query, setQuery }: DashboardProps) {
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div>
      {/* Mobile-only top bar */}
      <div className="flex items-center justify-between px-5 pt-5 pb-2 lg:hidden">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <MapPin size={12} className="text-[#1c075c]" />
            <span>BY.CASHIER UMKM · Outlet Jakarta</span>
          </div>
          <h1 className="mt-0.5 font-['Space_Grotesk'] text-xl font-bold text-[#1c075c]">
            Halo, Ayu 👋
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="grid size-10 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
            <Bell size={18} className="text-gray-600" />
          </button>
          <button
            onClick={() => go("checkout")}
            className="relative grid size-10 place-items-center rounded-2xl bg-[#1c075c]"
          >
            <ShoppingCart size={18} className="text-white" />
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#ffe51c] text-[10px] font-bold text-[#1c075c]">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Desktop greeting */}
      <div className="hidden lg:block px-8 pt-8 pb-2">
        <h1 className="font-['Space_Grotesk'] text-3xl font-bold text-[#1c075c]">
          Halo, Ayu 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">Kelola transaksi outletmu hari ini.</p>
      </div>

      <div className="grid xl:grid-cols-[1fr_320px]">
        {/* Main column */}
        <div className="space-y-6 px-5 pb-28 pt-4 lg:px-8 lg:pb-10">
          {/* Search bar */}
          <div className="flex gap-3">
            <label className="flex flex-1 items-center gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-sm ring-1 ring-gray-100/80 focus-within:ring-[#1c075c]/30 transition">
              <Search size={17} className="flex-shrink-0 text-gray-400" />
              <input
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                value={query}
                onChange={(event) => setQuery?.(event.target.value)}
                placeholder="Cari menu atau kategori..."
              />
            </label>
            <button className="flex-shrink-0 grid place-items-center rounded-2xl bg-[#1c075c] transition hover:brightness-110 active:scale-95" style={{ width: 52, height: 52 }}>
              <SlidersHorizontal size={18} className="text-white" />
            </button>
          </div>

          {/* Promo Banner */}
          <div className="relative overflow-hidden rounded-3xl bg-[#1c075c] px-6 py-7" style={{ minHeight: 164 }}>
            {/* Text */}
            <div className="relative z-10 max-w-[58%]">
              <span className="inline-block rounded-full bg-[#ffe51c] px-3 py-1 text-[11px] font-bold text-[#1c075c]">
                ● Shift Pagi Aktif
              </span>
              <h2 className="mt-3 font-['Space_Grotesk'] text-2xl font-bold leading-tight text-white">
                Kasir siap<br />melayani transaksi
              </h2>
              <button
                onClick={() => go("order")}
                className="mt-4 flex items-center gap-1.5 rounded-xl bg-[#ffe51c] px-4 py-2.5 text-sm font-bold text-[#1c075c] transition hover:brightness-105 active:scale-95"
              >
                Mulai transaksi <ChevronRight size={14} />
              </button>
            </div>
            {/* Food image right side */}
            <div className="absolute right-0 top-0 h-full w-[44%]">
              <img
                src="https://images.unsplash.com/photo-1585238341710-4d3ff484184d?w=320&h=200&fit=crop&auto=format"
                alt="Menu unggulan outlet"
                className="h-full w-full object-cover"
                style={{ clipPath: "polygon(28% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1c075c] via-[#1c075c]/40 to-transparent" />
            </div>
            {/* Dots indicator */}
            <div className="absolute bottom-4 left-6 flex gap-1.5 z-10">
              <span className="h-1.5 w-5 rounded-full bg-[#ffe51c]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            </div>
          </div>

          {/* Categories */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Kategori Menu</h2>
              <button className="text-sm text-[#7c5cbf] hover:text-[#1c075c] transition">Lihat semua</button>
            </div>
            <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
              {categories.map((c) => (
                <button
                  key={c.label}
                  onClick={() => setActiveCategory(c.label)}
                  className={`flex flex-shrink-0 flex-col items-center gap-1.5 rounded-2xl px-4 py-3 text-center transition-all duration-200 ${
                    activeCategory === c.label
                      ? "bg-[#1c075c] text-white shadow-[0_4px_16px_rgba(28,7,92,0.3)]"
                      : "bg-white text-gray-600 shadow-sm ring-1 ring-gray-100 hover:ring-[#1c075c]/20"
                  }`}
                >
                  <span className="text-xl leading-none">{c.emoji}</span>
                  <span className="text-[11px] font-medium">{c.label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Popular Dishes */}
          <section>
            <div className="flex items-center justify-between">
              <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Menu Terlaris</h2>
              <button
                onClick={() => go("order")}
                className="text-sm text-[#7c5cbf] hover:text-[#1c075c] transition"
              >
                Lihat semua →
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 2xl:grid-cols-3">
              {dishes.map((food) => (
                <FoodCard
                  key={food.id}
                  food={food}
                  isFav={favorites.includes(food.id)}
                  onFav={() => toggle(food.id)}
                  onAdd={() => add(food)}
                  onDetail={() => detail(food)}
                />
              ))}
            </div>
          </section>
        </div>

        {/* Right sidebar (desktop only) */}
        <aside className="hidden xl:flex flex-col gap-5 px-4 py-6">
          {/* Balance Card */}
          <div className="rounded-3xl bg-gradient-to-br from-[#1c075c] to-[#3e1595] p-5 text-white">
            <p className="text-[11px] uppercase tracking-widest text-white/50">Kas Shift Hari Ini</p>
            <h3 className="mt-1.5 font-['Space_Grotesk'] text-3xl font-bold">Rp 1.250.000</h3>
            <p className="mt-1 text-xs tracking-widest text-white/40">SHIFT PAGI · KAS AKTIF</p>
            <div className="mt-5 flex gap-2.5">
              <button
                onClick={() => go("wallet")}
                className="rounded-xl bg-[#ffe51c] px-4 py-2.5 text-xs font-bold text-[#1c075c] transition hover:brightness-105"
              >
                Modal Awal
              </button>
              <button className="rounded-xl bg-white/15 px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/25">
                Setor Kas
              </button>
            </div>
          </div>

          {/* Delivery address */}
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
              <MapPin size={11} />
              Informasi Outlet
            </div>
            <p className="mt-2.5 text-sm font-semibold text-[#1c075c]">BY.CASHIER UMKM</p>
            <p className="mt-0.5 text-xs text-gray-400">Jakarta Selatan, 12190</p>
            <button className="mt-3 text-xs font-medium text-[#7c5cbf] hover:text-[#1c075c] transition">
              Ubah outlet →
            </button>
          </div>

          {/* Recent Order */}
          <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <h3 className="font-['Space_Grotesk'] text-base font-bold text-[#1c075c]">Transaksi Terakhir</h3>
            <div className="mt-4 space-y-3">
              {dishes.slice(0, 3).map((food) => (
                <div key={food.id} className="flex items-center gap-3">
                  <div className="size-11 overflow-hidden rounded-xl flex-shrink-0 bg-gray-100">
                    <img src={food.image} alt={food.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-[13px] font-semibold text-[#1c075c]">{food.name}</p>
                    <p className="text-[11px] text-gray-400">Qty: 1 · Siap bayar</p>
                  </div>
                  <span className="text-[13px] font-bold text-[#1c075c]">Rp {(food.price * 15000).toLocaleString("id-ID")}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-50 pt-4 flex justify-between text-sm">
              <span className="text-gray-500">Total transaksi</span>
              <span className="font-bold text-[#1c075c]">
                Rp {(dishes.slice(0, 3).reduce((a, f) => a + f.price, 0) * 15000).toLocaleString("id-ID")}
              </span>
            </div>
            <button
              onClick={() => go("checkout")}
              className="mt-4 w-full rounded-2xl bg-[#1c075c] py-3 text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
            >
              Lanjut ke pembayaran
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
