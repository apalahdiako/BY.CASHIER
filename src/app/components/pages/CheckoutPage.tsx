import { useState } from "react";
import { ChevronLeft, CreditCard, MapPin, Smartphone, Banknote, ChevronRight } from "lucide-react";
import { CartItem, dishes, Page, rupiah } from "../../types";

const paymentMethods = [
  { id: "card", label: "Credit Card", sub: "•••• •••• •••• 4209", icon: CreditCard },
  { id: "wallet", label: "Digital Wallet", sub: "Saldo tersedia", icon: Smartphone },
  { id: "cash", label: "Cash on Delivery", sub: "Pay when your order arrives", icon: Banknote },
];

interface CheckoutPageProps {
  cart: CartItem[];
  total: number;
  go: (p: Page) => void;
  onOrder: () => void;
}

export function CheckoutPage({ cart, total, go, onOrder }: CheckoutPageProps) {
  const [payment, setPayment] = useState("card");
  const displayCart = cart.length > 0 ? cart : [{ food: dishes[0], qty: 1, size: "Regular", extras: [] }];
  const subtotal = cart.length > 0 ? total : dishes[0].price;
  const delivery = 2.5;
  const tax = parseFloat((subtotal * 0.1).toFixed(2));
  const grandTotal = subtotal + delivery + tax;

  return (
    <div className="px-5 pb-28 pt-5 lg:px-8 lg:pb-10">
      {/* Back header */}
      <button
        onClick={() => go("detail")}
        className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-[#1c075c]"
      >
        <ChevronLeft size={18} />
        Back to menu
      </button>

      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {/* Left column */}
        <div className="space-y-5">
          {/* Delivery Address */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Delivery Address</h2>
              <button className="text-sm font-medium text-[#7c5cbf] hover:text-[#1c075c] transition">Edit</button>
            </div>
            <div className="mt-4 flex items-start gap-4">
              <div className="grid size-12 flex-shrink-0 place-items-center rounded-2xl bg-[#f0ebff]">
                <MapPin size={20} className="text-[#1c075c]" />
              </div>
              <div>
                <p className="font-semibold text-[#1c075c]">Home</p>
                <p className="mt-0.5 text-sm text-gray-500">
                  Emi Street 23, Tower B, Jakarta Selatan, 12190
                </p>
                <p className="mt-1 text-xs text-[#7c5cbf]">Estimated: 20–30 minutes</p>
              </div>
            </div>

            {/* Mini map placeholder */}
            <div className="mt-4 grid h-28 place-items-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#e8eef3] to-[#d5dce5] relative">
              <div className="absolute inset-0 opacity-30"
                style={{ backgroundImage: "repeating-linear-gradient(0deg, #aab 0px, #aab 1px, transparent 1px, transparent 40px), repeating-linear-gradient(90deg, #aab 0px, #aab 1px, transparent 1px, transparent 40px)" }}
              />
              <div className="relative grid size-10 place-items-center rounded-full bg-[#ffe51c] shadow-lg ring-4 ring-white">
                <MapPin size={18} className="text-[#1c075c]" />
              </div>
            </div>
          </section>

          {/* Order Summary */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Order Summary</h2>
              <span className="rounded-full bg-[#1c075c] px-3 py-1 text-xs font-semibold text-white">
                {displayCart.length} item{displayCart.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="mt-5 space-y-4">
              {displayCart.map((item) => (
                <div key={item.food.id} className="flex items-center gap-4">
                  <div className="size-14 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100">
                    <img src={item.food.image} alt={item.food.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-[#1c075c]">{item.food.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.qty} · {item.size}</p>
                  </div>
                  <span className="text-sm font-bold text-[#1c075c]">
                    {rupiah(item.food.price * item.qty)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Payment Method */}
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Payment Method</h2>
            <div className="mt-4 space-y-3">
              {paymentMethods.map(({ id, label, sub, icon: Icon }) => (
                <label
                  key={id}
                  className={`flex cursor-pointer items-center justify-between rounded-2xl border-2 p-4 transition-all ${
                    payment === id
                      ? "border-[#1c075c] bg-[#f0ebff]"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`grid size-10 place-items-center rounded-xl ${payment === id ? "bg-[#1c075c]" : "bg-gray-200"} transition-colors`}>
                      <Icon size={18} className={payment === id ? "text-white" : "text-gray-600"} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1c075c]">{label}</p>
                      <p className="text-xs text-gray-400">{sub}</p>
                    </div>
                  </div>
                  <div className={`grid size-5 place-items-center rounded-full border-2 transition-all ${
                    payment === id ? "border-[#1c075c] bg-[#1c075c]" : "border-gray-300"
                  }`}>
                    {payment === id && <div className="size-2 rounded-full bg-white" />}
                  </div>
                  <input
                    type="radio"
                    name="payment"
                    checked={payment === id}
                    onChange={() => setPayment(id)}
                    className="sr-only"
                  />
                </label>
              ))}
            </div>
          </section>
        </div>

        {/* Right – Bill Details */}
        <aside className="space-y-5">
          <section className="rounded-3xl bg-[#1c075c] p-6 text-white shadow-sm">
            <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#ffe51c]">Bill Details</h2>
            <div className="mt-5 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Subtotal</span>
                <span className="font-medium">{rupiah(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Delivery Fee</span>
                <span className="font-medium">{rupiah(delivery)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-white/70">Tax & Platform Fee</span>
                <span className="font-medium">{rupiah(tax)}</span>
              </div>
            </div>
            <div className="mt-5 border-t border-white/15 pt-5">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-white/70">Total</span>
                <span className="font-['Space_Grotesk'] text-3xl font-bold text-[#ffe51c]">
                  {rupiah(grandTotal)}
                </span>
              </div>
            </div>

            <button
              onClick={onOrder}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffe51c] py-4 text-sm font-bold text-[#1c075c] transition hover:brightness-105 active:scale-[0.98]"
            >
              Place Order
              <ChevronRight size={16} />
            </button>
            <p className="mt-3 text-center text-xs text-white/40">
              By placing your order you agree to our Terms of Service
            </p>
          </section>

          {/* Voucher */}
          <section className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-[#1c075c]">Apply Voucher</p>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
            <div className="mt-3 flex gap-2">
              <input
                placeholder="Enter voucher code"
                className="flex-1 rounded-xl bg-gray-50 px-3.5 py-2.5 text-sm outline-none ring-1 ring-gray-200 focus:ring-[#1c075c]/30 transition"
              />
              <button className="rounded-xl bg-[#1c075c] px-4 text-sm font-bold text-white transition hover:bg-[#2d1080]">
                Apply
              </button>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
