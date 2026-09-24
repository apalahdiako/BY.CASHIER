import { useState } from "react";
import { Bell, ChevronRight, Globe, Heart, Lock, MapPin, ShieldCheck, User } from "lucide-react";

const menuItems = [
  { id: "personal", label: "Personal Data", icon: User, active: true },
  { id: "addresses", label: "Saved Addresses", icon: MapPin },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Preferences", icon: Globe },
  { id: "privacy", label: "Privacy & Security", icon: ShieldCheck },
];

interface SettingsPageProps {
  onNotice: (msg: string) => void;
}

export function SettingsPage({ onNotice }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState("personal");
  const [name, setName] = useState("Samantha");
  const [lastName, setLastName] = useState("Doe");
  const [email, setEmail] = useState("samantha.doe@example.com");
  const [phone, setPhone] = useState("+62 812 3456 7890");
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promos, setPromos] = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <div className="px-5 pb-28 pt-5 lg:px-8 lg:pb-10">
      <div className="grid gap-6 xl:grid-cols-[280px_1fr]">
        {/* Left sidebar */}
        <aside className="space-y-5">
          {/* Profile card */}
          <div className="rounded-3xl bg-white p-6 text-center shadow-sm ring-1 ring-gray-100">
            <div className="relative mx-auto w-fit">
              <div className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-amber-100 to-rose-300 text-4xl">
                👩
              </div>
              <button className="absolute -bottom-1 -right-1 grid size-7 place-items-center rounded-full bg-[#1c075c] ring-2 ring-white transition hover:bg-[#2d1080]">
                <span className="text-[14px] text-white">✎</span>
              </button>
            </div>
            <h2 className="mt-4 font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">
              {name} {lastName}
            </h2>
            <p className="text-xs text-gray-500">{email}</p>
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl bg-[#f0ebff] px-4 py-2">
              <Heart size={13} className="fill-[#7c5cbf] text-[#7c5cbf]" />
              <span className="text-xs font-semibold text-[#1c075c]">Pro Member</span>
            </div>
          </div>

          {/* Nav */}
          <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-gray-100">
            {menuItems.map(({ id, label, icon: Icon }, idx) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`flex w-full items-center gap-3 px-5 py-4 text-sm transition-all ${
                  activeSection === id
                    ? "bg-[#f0ebff] text-[#1c075c]"
                    : "text-gray-600 hover:bg-gray-50"
                } ${idx !== 0 ? "border-t border-gray-50" : ""}`}
              >
                <div className={`grid size-8 place-items-center rounded-xl ${activeSection === id ? "bg-[#1c075c]" : "bg-gray-100"} transition-colors`}>
                  <Icon size={15} className={activeSection === id ? "text-white" : "text-gray-500"} />
                </div>
                <span className={`flex-1 text-left font-medium ${activeSection === id ? "text-[#1c075c]" : ""}`}>{label}</span>
                <ChevronRight size={15} className={activeSection === id ? "text-[#7c5cbf]" : "text-gray-300"} />
              </button>
            ))}
          </div>

          <button className="w-full rounded-3xl border border-red-100 bg-white py-4 text-sm font-semibold text-red-500 shadow-sm ring-1 ring-gray-50 transition hover:bg-red-50">
            ⇥ Sign Out
          </button>
        </aside>

        {/* Right – content */}
        <div className="space-y-5">
          {activeSection === "personal" && (
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
                <div className="grid size-10 place-items-center rounded-2xl bg-[#f0ebff]">
                  <User size={18} className="text-[#1c075c]" />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Personal Information</h2>
                  <p className="text-xs text-gray-400">Update your profile details</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">First Name</span>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-sm outline-none ring-1 ring-gray-100 focus:ring-[#1c075c]/30 transition"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Last Name</span>
                  <input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-sm outline-none ring-1 ring-gray-100 focus:ring-[#1c075c]/30 transition"
                  />
                </label>
                <label className="block md:col-span-2">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Email Address</span>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-sm outline-none ring-1 ring-gray-100 focus:ring-[#1c075c]/30 transition"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Phone Number</span>
                  <input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-sm outline-none ring-1 ring-gray-100 focus:ring-[#1c075c]/30 transition"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Date of Birth</span>
                  <input
                    type="date"
                    defaultValue="1995-04-12"
                    className="w-full rounded-2xl bg-gray-50 px-4 py-3.5 text-sm outline-none ring-1 ring-gray-100 focus:ring-[#1c075c]/30 transition"
                  />
                </label>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button className="rounded-2xl border border-gray-200 px-6 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={() => onNotice("Profile changes saved successfully")}
                  className="rounded-2xl bg-[#1c075c] px-6 py-3 text-sm font-bold text-white transition hover:brightness-110 active:scale-[0.98]"
                >
                  Save Changes
                </button>
              </div>
            </section>
          )}

          {activeSection === "addresses" && (
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
                <div className="grid size-10 place-items-center rounded-2xl bg-[#f0ebff]">
                  <MapPin size={18} className="text-[#1c075c]" />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Saved Addresses</h2>
                  <p className="text-xs text-gray-400">Manage your delivery locations</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {[
                  { label: "🏠 Home", addr: "Jl. Sudirman No. 123, Tower B\nJakarta Selatan, 12190" },
                  { label: "🏢 Office", addr: "Gedung Inovasi, Jl. Thamrin Kav 9\nJakarta Pusat, 10350" },
                ].map((a) => (
                  <div key={a.label} className="rounded-2xl border-2 border-gray-100 p-5 transition hover:border-[#1c075c]/20">
                    <p className="font-semibold text-[#1c075c]">{a.label}</p>
                    <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-gray-500">{a.addr}</p>
                    <div className="mt-3 flex gap-2">
                      <button className="rounded-xl border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:bg-gray-50">Edit</button>
                      <button className="rounded-xl border border-red-100 px-3 py-1.5 text-xs font-medium text-red-500 transition hover:bg-red-50">Delete</button>
                    </div>
                  </div>
                ))}
                <button className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-200 p-8 text-gray-400 transition hover:border-[#1c075c]/30 hover:text-[#7c5cbf]">
                  <span className="text-2xl">+</span>
                  <span className="text-sm font-medium">Add New Address</span>
                </button>
              </div>
            </section>
          )}

          {activeSection === "notifications" && (
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
                <div className="grid size-10 place-items-center rounded-2xl bg-[#f0ebff]">
                  <Bell size={18} className="text-[#1c075c]" />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Notifications</h2>
                  <p className="text-xs text-gray-400">Control how we reach you</p>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                {[
                  { label: "Order Updates", sub: "Status changes for your orders", value: orderUpdates, set: setOrderUpdates },
                  { label: "Promotions & Offers", sub: "Special deals and new menu items", value: promos, set: setPromos },
                  { label: "Newsletter", sub: "Weekly food tips and stories", value: newsletter, set: setNewsletter },
                ].map((item) => (
                  <label key={item.label} className="flex cursor-pointer items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4 transition hover:border-gray-200">
                    <div>
                      <p className="text-sm font-semibold text-[#1c075c]">{item.label}</p>
                      <p className="mt-0.5 text-xs text-gray-500">{item.sub}</p>
                    </div>
                    <button
                      onClick={() => item.set(!item.value)}
                      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors duration-200 ${item.value ? "bg-[#1c075c]" : "bg-gray-300"}`}
                    >
                      <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${item.value ? "translate-x-5" : "translate-x-0.5"}`} />
                    </button>
                  </label>
                ))}
              </div>
            </section>
          )}

          {activeSection === "preferences" && (
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
                <div className="grid size-10 place-items-center rounded-2xl bg-[#f0ebff]">
                  <Globe size={18} className="text-[#1c075c]" />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Preferences</h2>
                  <p className="text-xs text-gray-400">Language, currency and more</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Language</span>
                  <select className="w-full appearance-none rounded-2xl bg-gray-50 px-4 py-3.5 text-sm outline-none ring-1 ring-gray-100 focus:ring-[#1c075c]/30 transition">
                    <option>English (US)</option>
                    <option>Bahasa Indonesia</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-gray-500">Currency</span>
                  <select className="w-full appearance-none rounded-2xl bg-gray-50 px-4 py-3.5 text-sm outline-none ring-1 ring-gray-100 focus:ring-[#1c075c]/30 transition">
                    <option>IDR (Rp)</option>
                    <option>USD ($)</option>
                  </select>
                </label>
              </div>
            </section>
          )}

          {activeSection === "privacy" && (
            <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100">
              <div className="flex items-center gap-3 border-b border-gray-50 pb-5">
                <div className="grid size-10 place-items-center rounded-2xl bg-[#f0ebff]">
                  <Lock size={18} className="text-[#1c075c]" />
                </div>
                <div>
                  <h2 className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">Privacy & Security</h2>
                  <p className="text-xs text-gray-400">Manage your account security</p>
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {["Change Password", "Two-Factor Authentication", "Connected Devices", "Delete Account"].map((item, i) => (
                  <button
                    key={item}
                    className={`flex w-full items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 px-5 py-4 text-sm transition hover:border-gray-200 hover:bg-white ${i === 3 ? "text-red-500" : "text-[#1c075c]"}`}
                  >
                    <span className="font-medium">{item}</span>
                    <ChevronRight size={16} className="text-gray-400" />
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
