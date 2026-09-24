import { ArrowDownLeft, ArrowUpRight, Building2, CreditCard, QrCode, Store } from "lucide-react";

const topupAmounts = [50000, 100000, 200000, 500000];

const transactions = [
  { icon: "🍴", label: "Food Order", sub: "Today, 12:30 PM", amount: -85000, positive: false },
  { icon: "⊕", label: "Top Up Balance", sub: "Today, 10:00 AM", amount: 500000, positive: true },
  { icon: "☕", label: "Coffee & Snacks", sub: "Yesterday, 03:15 PM", amount: -42000, positive: false },
  { icon: "🛵", label: "Delivery Fee", sub: "Yesterday, 12:00 PM", amount: -12000, positive: false },
  { icon: "⊕", label: "Top Up Balance", sub: "Oct 20, 09:00 AM", amount: 200000, positive: true },
];

const methods = [
  { id: "bank", label: "Bank Transfer", icon: Building2 },
  { id: "card", label: "Credit Card", icon: CreditCard },
  { id: "qris", label: "QRIS", icon: QrCode },
  { id: "store", label: "Minimarket", icon: Store },
];

interface WalletPageProps {
  balance: number;
  topup: number;
  setTopup: (v: number) => void;
  topupNow: () => void;
}

export function WalletPage({ balance, topup, setTopup, topupNow }: WalletPageProps) {
  return (
    <div className="px-5 pb-28 pt-5 lg:px-8 lg:pb-10">
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        {/* Left */}
        <div className="space-y-5">
          {/* Balance Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c075c] via-[#2d1080] to-[#4a1fa8] p-7 text-white">
            {/* Decorative circles */}
            <div className="absolute -right-12 -top-12 size-48 rounded-full bg-white/5" />
            <div className="absolute -right-4 -bottom-16 size-56 rounded-full bg-white/5" />

            <div className="relative z-10">
              <p className="text-[11px] font-semibold uppercase tracking-widest text-white/50">Total Balance</p>
              <h2 className="mt-2 font-['Space_Grotesk'] text-4xl font-bold tracking-tight">
                Rp {balance.toLocaleString("id-ID")}
              </h2>
              <p className="mt-2 font-mono text-sm tracking-widest text-white/40">•••• •••• •••• 4209</p>

              <div className="mt-7 flex items-center gap-3">
                <button className="flex items-center gap-2 rounded-xl bg-[#ffe51c] px-5 py-2.5 text-sm font-bold text-[#1c075c] transition hover:brightness-105">
                  <ArrowDownLeft size={16} />
                  Top Up
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-white/15 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-white/25">
                  <ArrowUpRight size={16} />
                  Transfer
                </button>
              </div>
            </div>
          </div>

          {/* Top Up Section */}
          <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
            <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Top Up Balance</h2>

            {/* Methods */}
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-gray-400">Payment Method</p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {methods.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-[#1c075c]/20 hover:bg-[#f0ebff]"
                >
                  <div className="grid size-10 place-items-center rounded-xl bg-[#f0ebff]">
                    <Icon size={18} className="text-[#1c075c]" />
                  </div>
                  <span className="text-center text-[11px] font-medium text-gray-600 leading-tight">{label}</span>
                </button>
              ))}
            </div>

            {/* Quick amounts */}
            <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-gray-400">Quick Amount</p>
            <div className="mt-3 flex flex-wrap gap-2.5">
              {topupAmounts.map((amount) => (
                <button
                  key={amount}
                  onClick={() => setTopup(amount)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                    topup === amount
                      ? "bg-[#1c075c] text-white shadow-sm"
                      : "border border-gray-200 bg-white text-gray-600 hover:border-[#1c075c]/20"
                  }`}
                >
                  Rp {amount.toLocaleString("id-ID")}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="mt-4 flex gap-3">
              <input
                placeholder="Or enter custom amount"
                className="flex-1 rounded-2xl bg-gray-50 px-4 py-3.5 text-sm outline-none ring-1 ring-gray-100 focus:ring-[#1c075c]/30 transition"
              />
              <button
                onClick={topupNow}
                className="rounded-2xl bg-[#1c075c] px-6 text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.98] whitespace-nowrap"
              >
                Top Up Now
              </button>
            </div>
          </div>
        </div>

        {/* Right – Transaction History */}
        <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100 h-fit">
          <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Transaction History</h2>
          <div className="mt-5 space-y-4">
            {transactions.map((tx, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                <div className="grid size-12 flex-shrink-0 place-items-center rounded-2xl bg-[#f0ebff] text-xl">
                  {tx.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-semibold text-[#1c075c]">{tx.label}</p>
                  <p className="text-xs text-gray-400">{tx.sub}</p>
                </div>
                <div className={`text-right text-sm font-bold flex-shrink-0 ${tx.positive ? "text-[#1a6c35]" : "text-[#b91c1c]"}`}>
                  {tx.positive ? "+" : "−"} Rp {Math.abs(tx.amount).toLocaleString("id-ID")}
                </div>
              </div>
            ))}
          </div>
          <button className="mt-5 w-full rounded-2xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:border-[#1c075c]/20 hover:text-[#1c075c]">
            View All Transactions
          </button>
        </div>
      </div>
    </div>
  );
}
