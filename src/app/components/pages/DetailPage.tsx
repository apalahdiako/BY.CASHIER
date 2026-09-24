import { useState } from "react";
import { ChevronLeft, Clock, Heart, Minus, Plus, Share2, ShoppingCart, Star } from "lucide-react";
import { Food, Page, rupiah } from "../../types";

const extrasList: { label: string; price: number }[] = [
  { label: "Extra Cheese", price: 1.5 },
  { label: "Crispy Bacon", price: 2.0 },
  { label: "Fried Egg", price: 1.0 },
  { label: "Jalapeños", price: 0.75 },
];

interface DetailPageProps {
  food: Food;
  cartQty: number;
  isFav: boolean;
  onFav: () => void;
  onAdd: () => void;
  go: (p: Page) => void;
}

export function DetailPage({ food, cartQty, isFav, onFav, onAdd, go }: DetailPageProps) {
  const [size, setSize] = useState<"Regular" | "Large" | "Double">("Regular");
  const [extras, setExtras] = useState<string[]>([]);
  const [qty, setQty] = useState(1);

  const sizes = food.sizes || [{ name: "Regular" as const, extra: 0 }, { name: "Large" as const, extra: 2 }, { name: "Double" as const, extra: 4 }];
  const toppings = food.toppings || extrasList;
  const sizeExtra = sizes.find(item => item.name === size)?.extra || 0;
  const extrasTotal = extras.reduce(
    (acc, label) => acc + (toppings.find((e) => e.label === label)?.price ?? 0),
    0
  );
  const unitPrice = food.price + sizeExtra + extrasTotal;
  const totalPrice = unitPrice * qty;

  const toggleExtra = (label: string) =>
    setExtras((e) => (e.includes(label) ? e.filter((v) => v !== label) : [...e, label]));

  return (
    <div>
      {/* Hero image */}
      <div className="relative h-72 lg:h-96 overflow-hidden bg-gray-200">
        <img
          src={food.image}
          alt={food.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/20" />

        {/* Actions overlay */}
        <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
          <button
            onClick={() => go("order")}
            className="flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#1c075c] backdrop-blur-sm shadow-md transition hover:bg-white"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <div className="flex gap-2">
            <button className="grid size-10 place-items-center rounded-2xl bg-white/90 backdrop-blur-sm shadow-md transition hover:bg-white">
              <Share2 size={16} className="text-gray-600" />
            </button>
            <button
              onClick={onFav}
              className="grid size-10 place-items-center rounded-2xl bg-white/90 backdrop-blur-sm shadow-md transition hover:bg-white"
            >
              <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : "text-gray-600"} />
            </button>
          </div>
        </div>

        {/* Rating + time badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm shadow-sm">
            <Star size={13} className="fill-[#ffe51c] text-[#ffe51c]" />
            <span className="text-sm font-bold text-[#1c075c]">{food.rating}</span>
            <span className="text-xs text-gray-500">({food.reviews.toLocaleString()})</span>
          </span>
          <span className="flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 backdrop-blur-sm shadow-sm">
            <Clock size={13} className="text-[#1c075c]" />
            <span className="text-xs font-medium text-[#1c075c]">{food.time}</span>
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:px-8 lg:grid-cols-[1fr_380px]">
        {/* Left – info */}
        <div className="space-y-6 pb-28 lg:pb-0">
          <div>
            <div className="flex items-start justify-between gap-4">
              <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#1c075c] leading-snug">
                {food.name}
              </h1>
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-[#1c075c]">{rupiah(unitPrice)}</div>
                {food.originalPrice && (
                  <div className="text-sm text-gray-400 line-through">{rupiah(food.originalPrice)}</div>
                )}
              </div>
            </div>
            <p className="mt-1 text-sm font-medium text-[#7c5cbf]">{food.restaurant}</p>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{food.description}</p>
          </div>

          {/* Ingredients */}
          <div>
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-[#1c075c]">Key Ingredients</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {food.ingredients.map((ing) => (
                <span
                  key={ing}
                  className="flex items-center gap-1.5 rounded-xl bg-[#f0ebff] px-3.5 py-2 text-xs font-medium text-[#1c075c]"
                >
                  ◈ {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Nutritional quick info */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Calories", value: `${food.calories ?? 0} kcal` },
              { label: "Protein", value: `${food.protein ?? 0}g` },
              { label: "Carbs", value: `${food.carbs ?? 0}g` },
            ].map((n) => (
              <div key={n.label} className="rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-gray-100">
                <div className="font-['Space_Grotesk'] text-base font-bold text-[#1c075c]">{n.value}</div>
                <div className="mt-0.5 text-[11px] text-gray-400">{n.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right – customize */}
        <aside className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 h-fit">
          <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Customize Order</h2>

          {/* Size */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Size</p>
              <span className="rounded-full bg-[#ffe51c]/30 px-2.5 py-0.5 text-[11px] font-bold text-[#1c075c]">
                Required
              </span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {sizes.map(({ name: s, extra }) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-2xl border-2 p-3 text-left transition-all ${
                    size === s
                      ? "border-[#1c075c] bg-[#f0ebff]"
                      : "border-gray-200 bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  <div className="text-sm font-bold text-[#1c075c]">{s}</div>
                  <div className="mt-0.5 text-[11px] text-gray-500">
                    {extra ? `+${rupiah(extra)}` : "Standard"}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Extras */}
          <div className="mt-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-700">Extra Toppings</p>
              <span className="text-[11px] text-gray-400">Optional</span>
            </div>
            <div className="mt-3 space-y-2.5">
              {toppings.map(({ label, price }) => (
                <label
                  key={label}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 transition-all ${
                    extras.includes(label) ? "border-[#1c075c] bg-[#f0ebff]" : "border-gray-100 bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`grid size-5 place-items-center rounded-md border-2 transition ${
                      extras.includes(label) ? "border-[#1c075c] bg-[#1c075c]" : "border-gray-300"
                    }`}>
                      {extras.includes(label) && (
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </div>
                  <span className="text-sm font-bold text-[#1c075c]">+{rupiah(price)}</span>
                  <input
                    type="checkbox"
                    checked={extras.includes(label)}
                    onChange={() => toggleExtra(label)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="mt-5 flex items-center justify-between">
            <p className="text-sm font-semibold text-gray-700">Quantity</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid size-9 place-items-center rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50 active:scale-95"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-base font-bold text-[#1c075c]">{qty}</span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="grid size-9 place-items-center rounded-xl bg-[#1c075c] text-white transition hover:bg-[#2d1080] active:scale-95"
              >
                <Plus size={14} />
              </button>
            </div>
          </div>

          {/* Total + CTA */}
          <div className="mt-6 border-t border-gray-100 pt-5">
            <div className="flex items-baseline justify-between">
              <span className="text-sm text-gray-500">Total Price</span>
              <span className="font-['Space_Grotesk'] text-2xl font-bold text-[#1c075c]">
                {rupiah(totalPrice)}
              </span>
            </div>
            <button
              onClick={() => { onAdd(); }}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffe51c] py-4 text-sm font-bold text-[#1c075c] transition hover:brightness-105 active:scale-[0.98]"
            >
              <ShoppingCart size={18} />
              Add to Cart {cartQty > 0 && `(${cartQty + qty})`}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
