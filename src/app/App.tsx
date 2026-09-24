import { useEffect, useMemo, useState } from "react";
import { useClerk, useUser } from "@clerk/react";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { Bell, Menu } from "lucide-react";

import { BannerSlide, CartItem, CctvCamera, CctvEvent, CctvOutlet, defaultCategories, defaultStoreSettings, Food, MenuCategory, Page, Staff, StaffMessage, StaffNotification, StoreSettings, Transaction, Voucher, dishes } from "./types";
import { projectId, publicAnonKey } from "../../utils/supabase/info";
import { Sidebar } from "./components/Sidebar";
import { BottomNav } from "./components/BottomNav";
import { Dashboard } from "./components/pages/Dashboard";
import { CashierPOS } from "./components/pages/CashierPOS";
import { AnalyticsDashboard } from "./components/pages/AnalyticsDashboard";
import { CctvMonitoring } from "./components/pages/CctvMonitoring";
import { OperationsPage } from "./components/pages/OperationsPage";
import { DetailPage } from "./components/pages/DetailPage";
import { FavoritesPage } from "./components/pages/FavoritesPage";
import { HistoryPage } from "./components/pages/HistoryPage";
import { TrackingPage } from "./components/pages/TrackingPage";
import { WalletPage } from "./components/pages/WalletPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { AccountLogin, ProfilePage } from "./components/pages/ProfilePage";
import { SuperAdminDashboard, SuperAdminLogin } from "./components/pages/SuperAdminDashboard";

const pageTitles: Partial<Record<Page, string>> = {
  order: "Kasir",
  favorites: "Sering Dipesan",
  history: "Riwayat Transaksi",
  wallet: "Kas Shift",
  settings: "Pengaturan Kasir",
  profile: "Profil Saya",
};

export function StoreApp() {
  const { signOut } = useClerk();
  const { isLoaded: clerkLoaded, isSignedIn, user: clerkUser } = useUser();
  const clerkRole = typeof clerkUser?.publicMetadata.role === "string" ? clerkUser.publicMetadata.role : "";
  const [page, setPage] = useState<Page>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selected, setSelected] = useState<Food>(dishes[0]);
  const [products, setProducts] = useState<Food[]>(() => dishes.map(product => ({ ...product, active: true })));
  const [favorites, setFavorites] = useState<number[]>([1]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [query, setQuery] = useState("");
  const [historyFilter, setHistoryFilter] = useState("All Orders");
  const [balance, setBalance] = useState(1250000);
  const [topup, setTopup] = useState(100000);
  const [ordered, setOrdered] = useState(false);
  const [notice, setNotice] = useState("");
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [banners, setBanners] = useState<BannerSlide[]>([]);
  const [messages, setMessages] = useState<StaffMessage[]>([]);
  const [notifications, setNotifications] = useState<StaffNotification[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(defaultStoreSettings);
  const [currentStaff, setCurrentStaff] = useState<Staff | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<MenuCategory[]>(defaultCategories);
  const [cctvOutlets, setCctvOutlets] = useState<CctvOutlet[]>([]);
  const [cctvCameras, setCctvCameras] = useState<CctvCamera[]>([]);
  const [cctvEvents, setCctvEvents] = useState<CctvEvent[]>([]);
  const [cctvSyncActive, setCctvSyncActive] = useState(false);
  const apiBase = `https://${projectId}.supabase.co/functions/v1/make-server-df04cfb8`;

  useEffect(() => {
    if (!clerkLoaded) return;
    if (!isSignedIn || !clerkUser) { setCurrentStaff(null); return; }
    const accountName = clerkUser.username || clerkUser.firstName || "Staff";
    const savedStaff = staff.find(item => item.name.toLocaleLowerCase("id-ID") === accountName.toLocaleLowerCase("id-ID"));
    const isOwnerBootstrap = accountName.trim().toLocaleUpperCase("id-ID") === "BAYU OWNER";
    setCurrentStaff(savedStaff || { id: clerkUser.id, name: accountName, role: isOwnerBootstrap ? "Admin Owner" : "Kasir", shift: isOwnerBootstrap ? "Owner · Full access" : "Pagi · 08.00–16.00", hourlyRate: 0, permissions: isOwnerBootstrap ? ["Kasir POS", "CCTV Monitoring", "Closing Kasir", "Report", "Settlement"] : ["Kasir POS"], attendance: "Belum check-in", photo: clerkUser.imageUrl });
  }, [clerkLoaded, isSignedIn, clerkUser, staff]);

  useEffect(() => {
    const loadVouchers = async () => {
      try {
        const response = await fetch(`${apiBase}/vouchers`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
        const data = await response.json();
        setVouchers(data.vouchers || []);
      } catch { showNotice("Voucher belum dapat disinkronkan."); }
    };
    const loadBanners = async () => {
      try {
        const response = await fetch(`${apiBase}/banners`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
        const data = await response.json();
        setBanners(data.banners || []);
      } catch { showNotice("Spanduk belum dapat disinkronkan."); }
    };
    const loadMessages = async () => {
      try {
        const response = await fetch(`${apiBase}/messages`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
        const data = await response.json();
        setMessages(data.messages || []);
      } catch { showNotice("Pesan internal belum dapat disinkronkan."); }
    };
    const loadProducts = async () => {
      try {
        const response = await fetch(`${apiBase}/products`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
        const data = await response.json();
        if (data.products?.length) setProducts(data.products);
      } catch { showNotice("Produk belum dapat disinkronkan."); }
    };
    const loadCategories = async () => {
      try {
        const response = await fetch(`${apiBase}/categories`, { headers: { Authorization: `Bearer ${publicAnonKey}` } });
        const data = await response.json();
        if (data.categories?.length) setCategories(data.categories);
      } catch { /* kategori lokal tetap tersedia bila sinkronisasi belum siap */ }
    };
    const loadCctv = async () => {
      try {
        const [outletResponse, cameraResponse, eventResponse] = await Promise.all(["outlets", "cameras", "events"].map(resource => fetch(`${apiBase}/cctv/${resource}`, { headers: { Authorization: `Bearer ${publicAnonKey}` } })));
        if (!outletResponse.ok || !cameraResponse.ok || !eventResponse.ok) throw new Error("CCTV backend tidak merespons");
        const [outletData, cameraData, eventData] = await Promise.all([outletResponse.json(), cameraResponse.json(), eventResponse.json()]);
        setCctvOutlets(outletData.outlets || []); setCctvCameras(cameraData.cameras || []); setCctvEvents(eventData.events || []); setCctvSyncActive(true);
      } catch { setCctvSyncActive(false); }
    };
    const loadNotifications = async () => { try { const response = await fetch(`${apiBase}/notifications`, { headers: { Authorization: `Bearer ${publicAnonKey}` } }); const data = await response.json(); setNotifications(data.notifications || []); } catch { /* retry on next sync */ } };
    const loadStaff = async () => { try { const response = await fetch(`${apiBase}/staff`, { headers: { Authorization: `Bearer ${publicAnonKey}` } }); const data = await response.json(); setStaff(data.staff || []); } catch { /* retry */ } };
    const loadStoreSettings = async () => { try { const response = await fetch(`${apiBase}/store-settings`, { headers: { Authorization: `Bearer ${publicAnonKey}` } }); const data = await response.json(); if (data.settings) setStoreSettings(data.settings); } catch { /* retry */ } };
    const loadTransactions = async () => { try { const response = await fetch(`${apiBase}/transactions`, { headers: { Authorization: `Bearer ${publicAnonKey}` } }); const data = await response.json(); setTransactions(data.transactions || []); } catch { /* retry */ } };
    loadVouchers(); loadBanners(); loadMessages(); loadProducts(); loadCategories(); loadCctv(); loadNotifications(); loadStaff(); loadStoreSettings(); loadTransactions();
    const refresh = window.setInterval(() => { loadVouchers(); loadBanners(); loadMessages(); loadProducts(); loadCategories(); loadCctv(); loadNotifications(); loadStaff(); loadStoreSettings(); loadTransactions(); }, 2500);
    const channel = new BroadcastChannel("bycashier-vouchers");
    channel.onmessage = () => { loadVouchers(); loadBanners(); loadMessages(); loadProducts(); loadCategories(); loadCctv(); loadNotifications(); loadStaff(); loadStoreSettings(); loadTransactions(); };
    return () => { window.clearInterval(refresh); channel.close(); };
  }, [apiBase]);

  const go = (next: Page) => {
    const allowedCctv = currentStaff?.role === "Admin Owner" || currentStaff?.role === "Manager Dashboard" && Boolean(currentStaff.permissions.includes("CCTV Monitoring"));
    setPage(!allowedCctv && next === "cctv" ? "order" : (currentStaff?.role === "Kasir" || currentStaff?.role === "Kitchen Display") && next === "dashboard" ? "order" : next === "checkout" ? "order" : next);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showNotice = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2500);
  };

  const addToCart = (food: Food) => {
    if (food.active === false) return showNotice(`${food.name} sedang nonaktif.`);
    setCart(current => {
      const row = current.find(item => item.food.id === food.id);
      if (row) return current.map(item => item.food.id === food.id ? { ...item, qty: item.qty + 1 } : item);
      return [...current, { food, qty: 1, size: "Regular", extras: [] }];
    });
    showNotice(`${food.name} ditambahkan ke transaksi`);
  };
  const updateProducts = async (next: Food[]) => {
    setProducts(next);
    const response = await fetch(`${apiBase}/products`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify(next) });
    if (!response.ok) throw new Error("Produk gagal disimpan");
    new BroadcastChannel("bycashier-vouchers").postMessage({ type: "products-updated" });
    showNotice("Katalog kasir sudah diperbarui.");
  };
  const updateCategories = async (next: MenuCategory[]) => {
    setCategories(next);
    const response = await fetch(`${apiBase}/categories`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify(next) });
    if (!response.ok) throw new Error("Kategori gagal disimpan");
    new BroadcastChannel("bycashier-vouchers").postMessage({ type: "categories-updated" });
    showNotice("Kategori menu kasir sudah diperbarui.");
  };
  const updateCart = (id: number, change: number) => setCart(current => current.flatMap(item => item.food.id === id ? (item.qty + change > 0 ? [{ ...item, qty: item.qty + change }] : []) : [item]));
  const createVoucher = async (draft: Omit<Voucher, "id" | "active" | "createdAt">) => {
    const response = await fetch(`${apiBase}/vouchers`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify(draft) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Voucher gagal dibuat");
    setVouchers(current => [data.voucher, ...current]);
    new BroadcastChannel("bycashier-vouchers").postMessage({ type: "created" });
    showNotice(`Voucher ${data.voucher.name} aktif dan siap dipakai kasir.`);
  };
  const createBanner = async (draft: Omit<BannerSlide, "id" | "createdAt">) => {
    const response = await fetch(`${apiBase}/banners`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify(draft) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Spanduk gagal dibuat");
    setBanners(current => [...current, data.banner]);
    new BroadcastChannel("bycashier-vouchers").postMessage({ type: "banner-created" });
    showNotice("Spanduk baru aktif di halaman kasir.");
  };
  const deleteBanner = async (id: string) => {
    const response = await fetch(`${apiBase}/banners/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${publicAnonKey}` } });
    const data = await response.json();
    if (!response.ok) throw new Error("Spanduk gagal dihapus");
    setBanners(data.banners || []);
    new BroadcastChannel("bycashier-vouchers").postMessage({ type: "banner-deleted" });
  };
  const sendMessage = async (message: Omit<StaffMessage, "id" | "createdAt">) => {
    const response = await fetch(`${apiBase}/messages`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify(message) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Pesan gagal dikirim");
    setMessages(current => [...current, data.message]);
    new BroadcastChannel("bycashier-vouchers").postMessage({ type: "message-created" });
  };
  const broadcast = async (body: string, recipients: string[]) => {
    const response = await fetch(`${apiBase}/broadcast`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify({ body, recipients }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Broadcast gagal dikirim");
    setNotifications(current => [data.notification, ...current]);
    new BroadcastChannel("bycashier-vouchers").postMessage({ type: "broadcast" });
    showNotice(recipients.length ? "Notifikasi kasir tersimpan. WhatsApp sedang dibuka." : "Broadcast terkirim ke Kasir.");
  };
  const createStaff = async (draft: Omit<Staff, "id" | "attendance" | "lastAttendanceAt"> & { pin: string }) => {
    const response = await fetch(`${apiBase}/staff`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify(draft) });
    const data = await response.json(); if (!response.ok) throw new Error(data.error || "Staff gagal dibuat"); setStaff(current => [data.staff, ...current]); new BroadcastChannel("bycashier-vouchers").postMessage({ type: "staff-created" }); showNotice("Akun staff berhasil dibuat.");
  };
  const updateStaff = async (id: string, next: Pick<Staff, "role" | "permissions">) => { const response = await fetch(`${apiBase}/staff/${id}`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify(next) }); const data = await response.json(); if (!response.ok || !data.staff) throw new Error(data.error || "Akun staff gagal diperbarui"); setStaff(current=>current.map(item=>item.id===id?data.staff:item)); if(currentStaff?.id===id)setCurrentStaff(data.staff); new BroadcastChannel("bycashier-vouchers").postMessage({type:"staff-updated"}); showNotice("Role dan permission staff diperbarui."); };
  const deleteStaff = async (id: string) => { const response = await fetch(`${apiBase}/staff/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${publicAnonKey}` } }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Akun staff gagal dihapus"); setStaff(data.staff || []); if(currentStaff?.id===id) logoutStaff(); new BroadcastChannel("bycashier-vouchers").postMessage({type:"staff-deleted"}); showNotice("Akun staff dihapus."); };
  const setAttendance = async (id: string, attendance: Staff["attendance"]) => { const response = await fetch(`${apiBase}/staff/${id}/attendance`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify({ attendance }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Absensi gagal diperbarui"); setStaff(current => current.map(item => item.id === id ? data.staff : item)); if (currentStaff?.id === id) setCurrentStaff(data.staff); new BroadcastChannel("bycashier-vouchers").postMessage({ type: "attendance" }); };
  const saveStoreSettings = async (settings: StoreSettings) => { const response = await fetch(`${apiBase}/store-settings`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify(settings) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Pengaturan toko gagal disimpan"); setStoreSettings(data.settings); new BroadcastChannel("bycashier-vouchers").postMessage({ type: "store-settings" }); showNotice("Pengaturan toko dan struk diperbarui."); };
  const loginStaff = async (name: string, pin: string) => { const response = await fetch(`${apiBase}/staff/login`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify({ name, pin }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Login gagal"); setCurrentStaff(data.staff); if (data.staff.role === "Kasir" || data.staff.role === "Kitchen Display") setPage("order"); showNotice(`Selamat datang, ${data.staff.name}.`); };
  const logoutStaff = async () => { await signOut(); setCurrentStaff(null); setPage("dashboard"); setSidebarOpen(false); showNotice("Akun staff sudah logout."); };
  const saveProfile = async (next: Pick<Staff, "name" | "photo">) => { if (!currentStaff) return; const response = await fetch(`${apiBase}/staff/${currentStaff.id}/profile`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify(next) }); const data = await response.json(); if (!response.ok || !data.staff) throw new Error(data.error || "Profil gagal diperbarui"); setCurrentStaff(data.staff); setStaff(current=>current.map(item=>item.id===data.staff.id?data.staff:item)); new BroadcastChannel("bycashier-vouchers").postMessage({type:"profile-updated"}); showNotice("Profil berhasil diperbarui."); };
  const completeTransaction = async (draft: Omit<Transaction, "id" | "invoice" | "status" | "createdAt">) => { const response = await fetch(`${apiBase}/transactions`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify(draft) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Transaksi gagal disimpan"); setTransactions(current => [data.transaction, ...current]); new BroadcastChannel("bycashier-vouchers").postMessage({ type: "transaction-created" }); setOrdered(true); showNotice("Pembayaran berhasil. Nota siap dicetak."); };
  const syncCctv = async () => { const response = await fetch(`${apiBase}/cctv/sync`, { method: "POST", headers: { Authorization: `Bearer ${publicAnonKey}` } }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Sinkronisasi NVR gagal"); showNotice(`${data.checked} kamera diperiksa${data.failed ? `, ${data.failed} gagal` : ""}.`); return data; };
  const resetCctv = async (cameraId: string) => { const response = await fetch(`${apiBase}/cctv/cameras/${cameraId}/reset`, { method: "POST", headers: { Authorization: `Bearer ${publicAnonKey}` } }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Reset koneksi gagal"); showNotice("Permintaan reset koneksi telah dikirim ke media gateway."); };
  const connectCctv = async (draft: { outletId: string; name: string; protocol: "RTSP" | "ONVIF"; streamUrl: string; username: string; port: string }) => { const response = await fetch(`${apiBase}/cctv/cameras`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify(draft) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Koneksi kamera gagal diuji"); setCctvCameras(current => [...current, data.camera]); };
  const saveOperation = async (record: { type: "closing" | "reports" | "settlement"; note: string; total: number; transactionIds: string[] }) => { const response = await fetch(`${apiBase}/operations`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` }, body: JSON.stringify({ ...record, staffId: currentStaff?.id, staffName: currentStaff?.name }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Data operasional gagal disimpan"); new BroadcastChannel("bycashier-vouchers").postMessage({ type: "operation-saved" }); showNotice("Data operasional tersimpan."); };

  const toggleFav = (id: number) => setFavorites(current => current.includes(id) ? current.filter(value => value !== id) : [...current, id]);
  const visibleDishes = useMemo(() => products.filter(item => item.active !== false && (item.name.toLowerCase().includes(query.toLowerCase()) || item.restaurant.toLowerCase().includes(query.toLowerCase()))), [products, query]);
  const title = pageTitles[page];

  if (clerkLoaded && isSignedIn && clerkRole === "super_admin") return <Navigate to="/superadmin" replace />;

  return <div className="min-h-screen bg-[#f5f6fa] text-[#1c075c]">
    {notice && <div className="fixed right-4 top-4 z-[100] flex items-center gap-3 rounded-2xl bg-[#1c075c] px-5 py-3.5 text-sm text-white shadow-2xl"><span className="size-2 rounded-full bg-[#ffe51c]" />{notice}</div>}
    <Sidebar active={page} go={go} open={sidebarOpen} close={() => setSidebarOpen(false)} staff={currentStaff} />
    <main className="min-h-screen lg:pl-72">
      {page !== "dashboard" && page !== "order" && page !== "cctv" && <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-gray-100 bg-white/95 px-5 backdrop-blur lg:px-8"><div className="flex items-center gap-4"><button onClick={() => setSidebarOpen(true)} className="grid size-10 place-items-center rounded-2xl bg-gray-100 transition hover:bg-gray-200 lg:hidden"><Menu size={20}/></button>{title && <h1 className="font-['Space_Grotesk'] text-2xl font-bold text-[#1c075c]">{title}</h1>}</div><div className="flex items-center gap-3"><button className="grid size-10 place-items-center rounded-2xl bg-gray-50 ring-1 ring-gray-100"><Bell size={18} className="text-gray-600"/></button><button onClick={() => currentStaff ? go("profile") : setLoginOpen(true)} className="grid size-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-amber-100 to-rose-300 text-lg">{currentStaff?.photo?<img src={currentStaff.photo} alt="Profil" className="size-full object-cover"/>:"👩"}</button></div></header>}
      {page === "cctv" && <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-transparent px-5 lg:hidden"><button onClick={() => setSidebarOpen(true)} className="grid size-10 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"><Menu size={18} className="text-gray-600"/></button></header>}
      {page === "dashboard" && currentStaff?.role !== "Kasir" && <header className="sticky top-0 z-30 flex h-14 items-center justify-between bg-transparent px-5 lg:hidden"><button onClick={() => setSidebarOpen(true)} className="grid size-10 place-items-center rounded-2xl bg-white shadow-sm ring-1 ring-gray-100"><Menu size={18} className="text-gray-600"/></button></header>}
      {page === "dashboard" && <AnalyticsDashboard dishes={products} vouchers={vouchers} banners={banners} messages={messages} notifications={notifications} staff={staff} settings={storeSettings} transactions={transactions} categories={categories} currentStaff={currentStaff} onCreateStaff={createStaff} onUpdateStaff={updateStaff} onDeleteStaff={deleteStaff} onAttendance={setAttendance} onSaveSettings={saveStoreSettings} onBroadcast={broadcast} onSendMessage={sendMessage} onUpdateProducts={updateProducts} onUpdateCategories={updateCategories} onCreateVoucher={createVoucher} onCreateBanner={createBanner} onDeleteBanner={deleteBanner} goToCashier={() => go("order")} goToCctv={() => go("cctv")} />}
      {page === "cctv" && <CctvMonitoring outlets={cctvOutlets} cameras={cctvCameras} events={cctvEvents} currentStaff={currentStaff} syncActive={cctvSyncActive} onSync={syncCctv} onReset={resetCctv} onConnect={connectCctv}/>} 
      {page === "closing" && <OperationsPage mode="closing" transactions={transactions} staff={currentStaff} onSave={saveOperation}/>} 
      {page === "reports" && <OperationsPage mode="reports" transactions={transactions} staff={currentStaff} onSave={saveOperation}/>} 
      {page === "settlement" && <OperationsPage mode="settlement" transactions={transactions} staff={currentStaff} onSave={saveOperation}/>} 
      {page === "order" && <CashierPOS dishes={visibleDishes} categories={categories} banners={banners} vouchers={vouchers} messages={messages} notifications={notifications} storeSettings={storeSettings} currentStaff={currentStaff} sendMessage={sendMessage} favorites={favorites} cart={cart} toggle={toggleFav} add={addToCart} detail={food => { setSelected(food); go("detail"); }} update={updateCart} clear={() => setCart([])} completed={completeTransaction} openSidebar={() => setSidebarOpen(true)}/>}
      {page === "detail" && <DetailPage food={selected} cartQty={cart.find(item => item.food.id === selected.id)?.qty ?? 0} isFav={favorites.includes(selected.id)} onFav={() => toggleFav(selected.id)} onAdd={() => addToCart(selected)} go={go}/>} 
      {page === "favorites" && <FavoritesPage list={products.filter(item => item.active !== false && favorites.includes(item.id))} favorites={favorites} toggle={toggleFav} add={addToCart} detail={food => { setSelected(food); go("detail"); }} go={go}/>} 
      {page === "history" && <HistoryPage filter={historyFilter} setFilter={setHistoryFilter} transactions={transactions}/>} 
      {page === "tracking" && <TrackingPage ordered={ordered}/>} 
      {page === "wallet" && <WalletPage balance={balance} topup={topup} setTopup={setTopup} topupNow={() => { setBalance(current => current + topup); showNotice(`Modal kas Rp ${topup.toLocaleString("id-ID")} tercatat`); }}/>} 
      {page === "settings" && <SettingsPage onNotice={showNotice}/>} 
      {page === "profile" && currentStaff && <ProfilePage staff={currentStaff} save={saveProfile} logout={logoutStaff}/>} 
    </main>
    <BottomNav active={page} go={go} staff={currentStaff}/>{loginOpen && <AccountLogin close={() => setLoginOpen(false)} />}
  </div>;
}

const router = createBrowserRouter([
  { path: "/superadmin/login", Component: SuperAdminLogin },
  { path: "/superadmin", Component: SuperAdminDashboard },
  { path: "*", Component: StoreApp },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
