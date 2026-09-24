import { CheckCircle2, MessageCircle, Phone } from "lucide-react";
import { rupiah } from "../../types";

const steps = [
  { id: 1, label: "Order Confirmed", sub: "12:15 PM", done: true },
  { id: 2, label: "Preparing", sub: "12:20 PM", done: true, active: false },
  { id: 3, label: "On the Way", sub: "Est. 12:38 PM", done: false, active: true },
  { id: 4, label: "Delivered", sub: "Est. 12:45 PM", done: false },
];

interface TrackingPageProps {
  ordered: boolean;
}

export function TrackingPage({ ordered }: TrackingPageProps) {
  return (
    <div className="px-5 pb-28 pt-5 lg:px-8 lg:pb-10">
      {ordered && (
        <div className="mb-5 flex items-center gap-3 rounded-2xl bg-[#e7f5ec] px-5 py-4 text-sm font-medium text-[#1a6c35]">
          <CheckCircle2 size={18} className="flex-shrink-0" />
          Order placed successfully and is being prepared!
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        {/* Left */}
        <div className="space-y-5">
          {/* Map */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#d6dce8] to-[#c4ccdb]" style={{ height: 280 }}>
            {/* Grid overlay */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: "repeating-linear-gradient(0deg, rgba(120,130,160,0.15) 0px, rgba(120,130,160,0.15) 1px, transparent 1px, transparent 48px), repeating-linear-gradient(90deg, rgba(120,130,160,0.15) 0px, rgba(120,130,160,0.15) 1px, transparent 1px, transparent 48px)"
              }}
            />
            {/* Road-like elements */}
            <div className="absolute left-[20%] top-0 bottom-0 w-8 rounded-sm bg-white/25" />
            <div className="absolute left-0 right-0 top-[45%] h-8 rounded-sm bg-white/25" />
            <div className="absolute left-0 right-0 top-[45%] h-8 flex items-center justify-center overflow-hidden">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="mx-4 h-1 w-8 rounded-full bg-white/60" />
              ))}
            </div>

            {/* Delivery pin */}
            <div className="absolute left-[35%] top-[32%] flex flex-col items-center">
              <div className="grid size-14 place-items-center rounded-full bg-[#ffe51c] shadow-xl ring-4 ring-white animate-bounce" style={{ animationDuration: "2s" }}>
                🛵
              </div>
              <div className="mt-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#1c075c] shadow-sm">
                BUDI
              </div>
            </div>

            {/* Destination pin */}
            <div className="absolute right-[22%] bottom-[28%] flex flex-col items-center">
              <div className="grid size-10 place-items-center rounded-full bg-[#1c075c] shadow-xl ring-4 ring-white">
                🏠
              </div>
            </div>

            {/* Route line */}
            <svg className="absolute inset-0 w-full h-full" style={{ pointerEvents: "none" }}>
              <polyline
                points="38%,38% 55%,47% 78%,72%"
                stroke="#ffe51c"
                strokeWidth="3"
                strokeDasharray="8 5"
                fill="none"
                opacity="0.8"
              />
            </svg>

            {/* ETA chip */}
            <div className="absolute right-4 top-4 rounded-2xl bg-white px-4 py-3 shadow-md">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">ETA</p>
              <p className="font-['Space_Grotesk'] text-xl font-bold text-[#1c075c]">12:45 PM</p>
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-[#1a6c35] font-medium">
                <span className="inline-block size-1.5 rounded-full bg-[#1a6c35]" />
                ~15 min away
              </p>
            </div>
          </div>

          {/* Order steps */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-[#1c075c]">
              Order #DF-9284 Status
            </h2>
            <div className="mt-5 relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-5 bottom-5 w-0.5 bg-gray-100" />
              <div className="absolute left-[19px] top-5 w-0.5 bg-[#ffe51c] transition-all" style={{ height: "50%" }} />

              <div className="space-y-5">
                {steps.map((step) => (
                  <div key={step.id} className="flex items-center gap-4 relative z-10">
                    <div className={`grid size-10 flex-shrink-0 place-items-center rounded-full border-2 transition-all ${
                      step.done
                        ? "border-[#1c075c] bg-[#1c075c]"
                        : step.active
                        ? "border-[#ffe51c] bg-[#ffe51c]"
                        : "border-gray-200 bg-white"
                    }`}>
                      {step.done ? (
                        <CheckCircle2 size={18} className="text-white" />
                      ) : step.active ? (
                        <div className="size-3 rounded-full bg-[#1c075c] animate-ping" />
                      ) : (
                        <div className="size-2 rounded-full bg-gray-300" />
                      )}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${step.done || step.active ? "text-[#1c075c]" : "text-gray-400"}`}>
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-400">{step.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-5">
          {/* Driver */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-[#1c075c]">Your Driver</h2>
            <div className="mt-4 flex items-center gap-4">
              <div className="grid size-14 place-items-center rounded-full bg-gradient-to-br from-amber-200 to-orange-300 text-2xl flex-shrink-0">
                👨‍✈️
              </div>
              <div className="flex-1">
                <p className="font-semibold text-[#1c075c]">Budi Santoso</p>
                <p className="text-xs text-gray-500">Yamaha NMAX · B 1234 XYZ</p>
                <div className="mt-1.5 flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-xs ${i < 5 ? "text-[#ffe51c]" : "text-gray-200"}`}>★</span>
                  ))}
                  <span className="ml-1 text-xs text-gray-500">4.9 · 1,240 trips</span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button className="grid size-10 place-items-center rounded-2xl bg-[#f0ebff] text-[#1c075c] transition hover:bg-[#e0d5ff]">
                  <MessageCircle size={18} />
                </button>
                <button className="grid size-10 place-items-center rounded-2xl bg-[#f0ebff] text-[#1c075c] transition hover:bg-[#e0d5ff]">
                  <Phone size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="font-['Space_Grotesk'] text-base font-bold text-[#1c075c]">Order Summary</h2>
            <div className="mt-4 space-y-3">
              {[
                ["2× Classic Truffle Burger", 25.98],
                ["1× Sweet Potato Fries", 5.5],
                ["1× Lemon Iced Tea", 3.5],
              ].map(([item, price]) => (
                <div key={item as string} className="flex justify-between text-sm">
                  <span className="text-gray-600">{item as string}</span>
                  <span className="font-semibold text-[#1c075c]">{rupiah(price as number)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-gray-100 pt-4">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Delivery Fee</span>
                <span className="text-sm font-medium text-[#1c075c]">{rupiah(2.5)}</span>
              </div>
              <div className="mt-2 flex justify-between">
                <span className="text-sm font-bold text-[#1c075c]">Total</span>
                <span className="font-['Space_Grotesk'] text-xl font-bold text-[#1c075c]">{rupiah(37.48)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
