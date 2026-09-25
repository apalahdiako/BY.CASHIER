import { useEffect, useState } from "react";
import { useClerk, useUser } from "@clerk/react";
import { useSignIn, useSignUp } from "@clerk/react/legacy";
import { Camera, KeyRound, LogIn, LogOut, MailCheck, ShieldCheck, UserRound, Utensils, X } from "lucide-react";
import { Staff } from "../../types";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { projectId, publicAnonKey } from "../../../../utils/supabase/info";

type Props = { staff: Staff; save: (next: Pick<Staff, "name" | "photo">) => Promise<void>; logout: () => void; requestDeletion: (reason: string) => Promise<void> };

export function ProfilePage({ staff, save, logout, requestDeletion }: Props) {
  const [name, setName] = useState(staff.name); const [photo, setPhoto] = useState(staff.photo || ""); const [saving, setSaving] = useState(false); const [deletionReason, setDeletionReason] = useState(""); const [deletionSent, setDeletionSent] = useState(false);
  const upload = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => setPhoto(String(reader.result)); reader.readAsDataURL(file); };
  const submit = async () => { setSaving(true); try { await save({ name, photo }); } finally { setSaving(false); } };
  return <div className="px-5 pb-28 pt-5 lg:px-8 lg:pb-10"><div><p className="text-xs text-gray-500">Akun & keamanan</p><h1 className="mt-1 font-['Space_Grotesk'] text-3xl font-bold text-[#1c075c]">Profil saya</h1></div><section className="mt-6 max-w-2xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-gray-100"><div className="flex flex-col items-center gap-5 sm:flex-row"><label className="relative grid size-28 cursor-pointer place-items-center overflow-hidden rounded-3xl bg-[#f0ebff] text-3xl"><span className="font-bold text-[#7c5cbf]">{staff.name.slice(0,1).toUpperCase()}</span>{photo&&<ImageWithFallback src={photo} alt={`Foto profil ${name}`} className="absolute inset-0 size-full object-cover"/>}<span className="absolute bottom-1 right-1 grid size-8 place-items-center rounded-xl bg-[#ffe51c] text-[#1c075c]"><Camera size={15}/></span><input type="file" accept="image/*" onChange={event=>upload(event.target.files?.[0])} className="hidden"/></label><div className="text-center sm:text-left"><h2 className="font-['Space_Grotesk'] text-xl font-bold text-[#1c075c]">{staff.name}</h2><p className="mt-1 text-sm text-[#7c5cbf]">{staff.role} · {staff.shift}</p><span className="mt-3 inline-flex items-center gap-2 rounded-full bg-[#e7f5ec] px-3 py-1.5 text-xs font-bold text-[#287347]"><ShieldCheck size={14}/> Akses {staff.role}</span></div></div><div className="mt-7 grid gap-4"><label className="text-xs font-bold text-[#1c075c]">NAMA TAMPIL<input value={name} onChange={event=>setName(event.target.value)} className="mt-2 w-full rounded-xl border border-gray-200 p-3 text-sm font-normal outline-none"/></label><div className="rounded-2xl bg-[#faf9fd] p-4"><p className="text-xs font-bold text-[#1c075c]">HAK AKSES</p><p className="mt-2 text-sm text-gray-500">{staff.permissions.join(" · ") || "Hak akses ditentukan oleh admin."}</p></div>{staff.role === "Admin Owner" && <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4"><p className="text-sm font-bold text-rose-700">Ajukan penghapusan akun bisnis</p><p className="mt-1 text-xs leading-5 text-rose-600">Pengajuan akan dikirim ke Super Admin dan akun tetap aktif sampai disetujui.</p><textarea value={deletionReason} onChange={event=>setDeletionReason(event.target.value)} disabled={deletionSent} placeholder="Alasan penghapusan akun" className="mt-3 min-h-20 w-full rounded-xl border border-rose-100 bg-white p-3 text-sm outline-none"/>{deletionSent ? <p className="mt-3 text-xs font-bold text-rose-700">Pengajuan sudah dikirim. Menunggu keputusan Super Admin.</p> : <button disabled={!deletionReason.trim()} onClick={async()=>{await requestDeletion(deletionReason);setDeletionSent(true);}} className="mt-3 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-bold text-white disabled:opacity-50">Ajukan penghapusan</button>}</div>}</div><div className="mt-6 flex flex-wrap gap-3"><button disabled={saving||!name.trim()} onClick={submit} className="rounded-xl bg-[#ffe51c] px-5 py-3 text-sm font-bold text-[#1c075c] disabled:opacity-50">{saving?"Menyimpan...":"Simpan profil"}</button><button onClick={logout} className="flex items-center gap-2 rounded-xl bg-[#1c075c] px-5 py-3 text-sm font-bold text-white"><LogOut size={16}/> Logout akun</button></div></section></div>;
}

type ClerkError = { errors?: { longMessage?: string; message?: string }[] };
const clerkError = (reason: unknown) => (reason as ClerkError)?.errors?.[0]?.longMessage || (reason as ClerkError)?.errors?.[0]?.message || "Tidak dapat memproses akun. Periksa kembali ID dan PIN.";
const clerkIdentifier = (value: string) => { const normalized = value.trim(); return normalized.includes("@") ? normalized : normalized.replace(/\s+/g, "_"); };
// UI tetap memakai PIN 8 digit; Clerk menerima format password khusus aplikasi agar PIN umum tidak ditolak oleh pengecekan password bocor.
const clerkPassword = (pin: string) => `bycashier::pin::${pin}::v1`;
const apiBase = `https://${projectId}.supabase.co/functions/v1/make-server-df04cfb8`;
const pendingAuthKey = "bycashier-pending-auth";
type PendingAuthMode = "register" | "register-verify" | "forgot-code" | "forgot-pin" | "login-code";
type PendingAuth = { mode: PendingAuthMode; id: string; email: string };
const readPendingAuth = (): PendingAuth | null => { try { const value = JSON.parse(window.localStorage.getItem(pendingAuthKey) || "null"); return value && ["register", "register-verify", "forgot-code", "forgot-pin"].includes(value.mode) ? value : null; } catch { return null; } };

export function AccountLogin({ close }: { close: () => void }) {
  const { isSignedIn, user } = useUser(); const { signOut } = useClerk();
  const { isLoaded: signInReady, signIn, setActive: setActiveSignIn } = useSignIn();
  const { isLoaded: signUpReady, signUp, setActive: setActiveSignUp } = useSignUp();
  const [mode, setMode] = useState<"login" | PendingAuthMode>(() => readPendingAuth()?.mode || "login");
  const [id, setId] = useState(() => readPendingAuth()?.id || ""); const [email, setEmail] = useState(() => readPendingAuth()?.email || ""); const [pin, setPin] = useState(""); const [code, setCode] = useState(""); const [error, setError] = useState(""); const [loading, setLoading] = useState(false);
  const clearPendingAuth = () => window.localStorage.removeItem(pendingAuthKey);
  const resetForm = (next: "login" | "register") => { clearPendingAuth(); setMode(next); setEmail(""); setPin(""); setCode(""); setError(""); };
  const closeLogin = () => { clearPendingAuth(); close(); };
  const queueOwnerApproval = async () => {
    const queueKey = `bycashier-owner-approval:${email.trim().toLowerCase()}`;
    if (window.localStorage.getItem(queueKey)) return;
    const response = await fetch(`${apiBase}/platform/approvals`, { method: "POST", headers: { Authorization: `Bearer ${publicAnonKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ ownerId: signUp?.createdUserId || "", ownerName: id.trim(), email: email.trim().toLowerCase(), status: "pending", plan: "Trial 14 hari", submittedAt: new Date().toISOString() }) });
    if (!response.ok) throw new Error("Pendaftaran akun berhasil, tetapi belum bisa masuk ke antrian approval.");
    window.localStorage.setItem(queueKey, "queued");
  };
  const finishSignUp = async (attempt: { status: string | null; createdSessionId: string | null }) => { if (attempt.status !== "complete" || !attempt.createdSessionId || !setActiveSignUp) throw new Error("Verifikasi akun belum selesai."); await queueOwnerApproval(); await setActiveSignUp({ session: attempt.createdSessionId }); closeLogin(); };
  const beginSecondFactor = async () => {
    if (!signIn) throw new Error("Sesi verifikasi tidak tersedia. Silakan masuk ulang.");
    const freshSignIn = await signIn.reload();
    const factor = freshSignIn.supportedSecondFactors?.find(item => item.strategy === "email_code");
    if (!factor || !("emailAddressId" in factor) || typeof factor.emailAddressId !== "string") throw new Error("Akun ini membutuhkan verifikasi tambahan yang belum memakai kode Gmail. Atur Email Code sebagai metode verifikasi di Clerk.");
    await freshSignIn.prepareSecondFactor({ strategy: "email_code", emailAddressId: factor.emailAddressId });
    setCode(""); setMode("login-code");
  };
  const finishSignIn = async (attempt: { status: string | null; createdSessionId: string | null }) => { if (attempt.status !== "complete" || !attempt.createdSessionId || !setActiveSignIn) throw new Error("Verifikasi akun belum selesai."); await setActiveSignIn({ session: attempt.createdSessionId }); closeLogin(); };
  const submit = async () => {
    if (!id.trim() || !pin || (mode === "register" && !email.trim())) return;
    setLoading(true); setError("");
    try {
      if (mode === "login") {
        if (!signInReady || !signIn) return;
        let attempt;
        try { attempt = await signIn.create({ identifier: clerkIdentifier(id), password: clerkPassword(pin) }); }
        catch { attempt = await signIn.create({ identifier: clerkIdentifier(id), password: pin }); }
        if (attempt.status === "needs_second_factor") { await beginSecondFactor(); return; }
        await finishSignIn(attempt);
      } else {
        if (!signUpReady || !signUp) return;
        const attempt = await signUp.create({ username: clerkIdentifier(id), emailAddress: email.trim(), password: clerkPassword(pin) });
        if (attempt.status === "complete") { await finishSignUp(attempt); return; }
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
        setMode("register-verify");
      }
    } catch (reason) { setError(clerkError(reason)); } finally { setLoading(false); }
  };
  const verifyRegistration = async () => {
    if (!code || !signUp) return;
    setLoading(true); setError("");
    try { await finishSignUp(await signUp.attemptEmailAddressVerification({ code })); } catch (reason) { if (signUp.status === "complete" && signUp.createdSessionId) await finishSignUp(signUp); else setError(clerkError(reason)); } finally { setLoading(false); }
  };
  const resendRegistrationCode = async () => {
    if (!signUp) return;
    setLoading(true); setError("");
    try {
      // Clerk dapat menyelesaikan sign-up di tab ini sebelum tombol kirim ulang ditekan.
      // Dalam kondisi itu jangan memanggil prepare lagi karena Clerk menolak saat sesi sudah aktif.
      if (signUp.status === "complete" && signUp.createdSessionId) { await finishSignUp(signUp); return; }
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
    } catch (reason) {
      if (signUp.status === "complete" && signUp.createdSessionId) { await finishSignUp(signUp); return; }
      setError(clerkError(reason));
    } finally { setLoading(false); }
  };
  const startReset = async () => {
    if (!id.trim() || !signInReady || !signIn) return;
    setLoading(true); setError("");
    try {
      const attempt = await signIn.create({ identifier: clerkIdentifier(id) });
      const factor = attempt.supportedFirstFactors?.find(item => item.strategy === "reset_password_email_code");
      if (!factor || !("emailAddressId" in factor) || typeof factor.emailAddressId !== "string") throw new Error("Akun ini belum memiliki email Gmail yang bisa menerima kode reset.");
      await attempt.prepareFirstFactor({ strategy: "reset_password_email_code", emailAddressId: factor.emailAddressId }); setMode("forgot-code");
    } catch (reason) { setError(clerkError(reason)); } finally { setLoading(false); }
  };
  const verifyResetCode = async () => {
    if (!code || !signIn) return;
    setLoading(true); setError("");
    try { const attempt = await signIn.attemptFirstFactor({ strategy: "reset_password_email_code", code }); if (attempt.status !== "needs_new_password") throw new Error("Kode verifikasi belum valid."); setPin(""); setMode("forgot-pin"); } catch (reason) { setError(clerkError(reason)); } finally { setLoading(false); }
  };
  const verifySecondFactor = async () => {
    if (!code || !signIn) return;
    setLoading(true); setError("");
    try { await finishSignIn(await signIn.attemptSecondFactor({ strategy: "email_code", code })); } catch (reason) { setError(clerkError(reason)); } finally { setLoading(false); }
  };
  const saveNewPin = async () => {
    if (pin.length !== 8 || !signIn) return;
    setLoading(true); setError("");
    try { const attempt = await signIn.resetPassword({ password: clerkPassword(pin), signOutOfOtherSessions: false }); if (attempt.status === "needs_second_factor") { await beginSecondFactor(); return; } await finishSignIn(attempt); } catch (reason) { setError(clerkError(reason)); } finally { setLoading(false); }
  };
  const isFlow = mode === "register-verify" || mode === "forgot-code" || mode === "forgot-pin" || mode === "login-code";
  useEffect(() => { if (isFlow) window.localStorage.setItem(pendingAuthKey, JSON.stringify({ mode, id, email })); }, [email, id, isFlow, mode]);
  const isCodeStep = mode === "register-verify" || mode === "forgot-code" || mode === "login-code";
  const title = mode === "login" ? "Masuk ke akun" : mode === "register" ? "Daftarkan akun" : mode === "register-verify" ? "Verifikasi Gmail" : mode === "forgot-code" ? "Cek email Gmail" : mode === "login-code" ? "Verifikasi keamanan" : "Buat PIN baru";
  const description = mode === "login" ? "Masuk dengan ID akun atau Gmail dan PIN yang terdaftar." : mode === "register" ? "Buat ID, Gmail, dan PIN untuk akun baru." : mode === "register-verify" ? "Masukkan kode yang Clerk kirim ke Gmail kamu agar akun aktif." : mode === "forgot-code" ? "Masukkan kode reset yang dikirim ke Gmail akun ini." : mode === "login-code" ? "Clerk meminta satu kode Gmail lagi untuk menyelesaikan login dengan aman." : "Masukkan PIN unik berisi tepat 8 digit.";
  const disabled = loading || !id.trim() || (mode === "login" ? !pin : mode === "register" ? !email.trim() || pin.length !== 8 : isCodeStep ? !code : pin.length !== 8);
  const action = mode === "login" || mode === "register" ? submit : mode === "register-verify" ? verifyRegistration : mode === "forgot-code" ? verifyResetCode : mode === "login-code" ? verifySecondFactor : saveNewPin;
  const actionLabel = mode === "login" ? "Masuk ke BY.CASHIER" : mode === "register" ? "Daftar & kirim kode" : isCodeStep ? "Verifikasi kode" : "Simpan PIN baru";
  if (isSignedIn && user) return <SignedInAccount close={close} logout={async () => { await signOut(); close(); }} />;
  return <div className="fixed inset-0 z-[150] grid place-items-center bg-[#13033f]/60 p-4 backdrop-blur-sm"><section role="dialog" aria-modal="true" aria-labelledby="account-login-title" className="w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl"><header className="bg-[#1c075c] px-6 pb-7 pt-6 text-white"><div className="flex items-start justify-between"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-[#ffe51c] text-[#1c075c]"><Utensils size={19} strokeWidth={2.5}/></span><div><p className="font-['Space_Grotesk'] text-base font-bold leading-none">BY.CASHIER</p><p className="mt-1 text-[10px] font-bold tracking-[0.16em] text-white/45">UMKM POS</p></div></div><button onClick={closeLogin} aria-label="Tutup login" className="rounded-xl p-2 text-white/55 transition hover:bg-white/10 hover:text-white"><X size={18}/></button></div><h2 id="account-login-title" className="mt-7 font-['Space_Grotesk'] text-2xl font-bold">{title}</h2><p className="mt-1.5 text-xs leading-5 text-white/60">{description}</p></header><div className="p-6">{!isFlow && <div className="grid grid-cols-2 rounded-2xl bg-[#f2eefb] p-1"><button onClick={() => resetForm("login")} className={`rounded-xl py-2.5 text-xs font-bold transition ${mode === "login" ? "bg-white text-[#1c075c] shadow-sm" : "text-[#785ca9]"}`}>Masuk</button><button onClick={() => resetForm("register")} className={`rounded-xl py-2.5 text-xs font-bold transition ${mode === "register" ? "bg-white text-[#1c075c] shadow-sm" : "text-[#785ca9]"}`}>Daftar</button></div>}<div className="mt-5 grid gap-3"><label className="text-[10px] font-bold tracking-[0.12em] text-[#68449c]">ID AKUN<div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#ded5ef] px-3 py-3 text-[#68449c] focus-within:border-[#7c5cbf]"><UserRound size={16}/><input value={id} disabled={isFlow} onChange={event => setId(event.target.value)} autoComplete="username" placeholder="Masukkan ID akun" className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#1c075c] outline-none placeholder:text-gray-400 disabled:cursor-not-allowed disabled:opacity-60"/></div></label>{mode === "register" && <label className="text-[10px] font-bold tracking-[0.12em] text-[#68449c]">GMAIL<div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#ded5ef] px-3 py-3 text-[#68449c] focus-within:border-[#7c5cbf]"><MailCheck size={16}/><input value={email} onChange={event => setEmail(event.target.value)} type="email" autoComplete="email" placeholder="nama@gmail.com" className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#1c075c] outline-none placeholder:text-gray-400"/></div></label>}{isCodeStep ? <label className="text-[10px] font-bold tracking-[0.12em] text-[#68449c]">KODE DARI GMAIL<div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#ded5ef] px-3 py-3 text-[#68449c] focus-within:border-[#7c5cbf]"><MailCheck size={16}/><input value={code} onChange={event => setCode(event.target.value.replace(/\D/g, ""))} inputMode="numeric" autoComplete="one-time-code" placeholder="Masukkan kode email" className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#1c075c] outline-none placeholder:text-gray-400"/></div></label> : <label className="text-[10px] font-bold tracking-[0.12em] text-[#68449c]">{mode === "forgot-pin" ? "PIN BARU · TEPAT 8 DIGIT" : "PIN · TEPAT 8 DIGIT"}<div className="mt-1.5 flex items-center gap-2 rounded-xl border border-[#ded5ef] px-3 py-3 text-[#68449c] focus-within:border-[#7c5cbf]"><KeyRound size={16}/><input value={pin} onChange={event => setPin(event.target.value.replace(/\D/g, "").slice(0, 8))} maxLength={8} inputMode="numeric" autoComplete={mode === "login" ? "current-password" : "new-password"} placeholder={mode === "forgot-pin" ? "Buat PIN 8 digit" : "Masukkan PIN"} className="min-w-0 flex-1 bg-transparent text-sm font-medium text-[#1c075c] outline-none placeholder:text-gray-400"/></div></label>}{mode === "register" && <p className="rounded-xl bg-[#fff8d5] px-3 py-2.5 text-[11px] leading-4 text-[#745d00]">Kode aktivasi dikirim ke Gmail. Nomor telepon tidak diperlukan untuk mendaftar.</p>}{error && <p className="rounded-xl bg-[#fff0f0] px-3 py-2.5 text-xs font-medium text-[#b94c5b]">{error}</p>}</div><button disabled={disabled} onClick={action} className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#ffe51c] py-3.5 text-sm font-bold text-[#1c075c] transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Memproses..." : actionLabel}</button>{mode === "login" && <button disabled={!id.trim() || loading} onClick={startReset} className="mt-3 w-full py-2 text-xs font-bold text-[#68449c] transition hover:text-[#1c075c] disabled:opacity-45">Lupa PIN? Kirim kode ke Gmail</button>}{mode === "register-verify" && <button disabled={loading} onClick={resendRegistrationCode} className="mt-3 w-full py-2 text-xs font-bold text-[#68449c] transition hover:text-[#1c075c] disabled:opacity-45">Kirim ulang kode ke Gmail</button>}{isFlow && <button onClick={() => resetForm("login")} className="mt-3 w-full py-2 text-xs font-bold text-[#68449c] transition hover:text-[#1c075c]">Batalkan dan kembali ke login</button>}<p className="mt-3 text-center text-[10px] leading-4 text-gray-400">Akun, kode Gmail, dan PIN diproses langsung oleh Clerk. Tidak ada branding Clerk pada layar ini.</p></div></section></div>;
}

function SignedInAccount({ close, logout }: { close: () => void; logout: () => Promise<void> }) {
  const { user } = useUser(); const [name, setName] = useState(user?.firstName || user?.username || ""); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const save = async () => { if (!user || !name.trim()) return; setSaving(true); setError(""); try { await user.update({ firstName: name.trim() }); } catch (reason) { setError(clerkError(reason)); } finally { setSaving(false); } };
  const upload = async (file?: File) => { if (!file || !user) return; setSaving(true); setError(""); try { await user.setProfileImage({ file }); } catch (reason) { setError(clerkError(reason)); } finally { setSaving(false); } };
  return <div className="fixed inset-0 z-[150] grid place-items-center bg-[#13033f]/60 p-4 backdrop-blur-sm"><section className="w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-2xl"><header className="bg-[#1c075c] px-6 py-6 text-white"><div className="flex items-center justify-between"><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-2xl bg-[#ffe51c] text-[#1c075c]"><Utensils size={19} strokeWidth={2.5}/></span><div><p className="font-['Space_Grotesk'] text-base font-bold">BY.CASHIER</p><p className="text-[10px] font-bold tracking-[.16em] text-white/45">AKUN SAYA</p></div></div><button onClick={close} className="rounded-xl p-2 text-white/60 hover:bg-white/10"><X size={18}/></button></div></header><div className="p-6"><div className="flex items-center gap-4"><label className="relative grid size-16 cursor-pointer place-items-center overflow-hidden rounded-2xl bg-[#f0ebff] text-[#1c075c]">{user?.imageUrl ? <img src={user.imageUrl} alt="Profil" className="size-full object-cover"/> : <UserRound size={25}/>}<span className="absolute bottom-0 right-0 grid size-6 place-items-center rounded-lg bg-[#ffe51c] text-[10px]">✎</span><input className="hidden" type="file" accept="image/*" onChange={event => void upload(event.target.files?.[0])}/></label><div><p className="font-['Space_Grotesk'] text-lg font-bold text-[#1c075c]">{user?.username || name}</p><p className="mt-1 text-xs text-gray-500">{user?.primaryEmailAddress?.emailAddress || "Akun BY.CASHIER"}</p></div></div><label className="mt-6 block text-[10px] font-bold tracking-[.12em] text-[#68449c]">NAMA TAMPIL<input value={name} onChange={event => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#ded5ef] px-3 py-3 text-sm font-medium text-[#1c075c] outline-none focus:border-[#7c5cbf]"/></label>{error && <p className="mt-3 rounded-xl bg-[#fff0f0] px-3 py-2 text-xs text-[#b94c5b]">{error}</p>}<button disabled={saving || !name.trim()} onClick={() => void save()} className="mt-5 w-full rounded-xl bg-[#ffe51c] py-3 text-sm font-bold text-[#1c075c] disabled:opacity-50">{saving ? "Menyimpan..." : "Simpan profil"}</button><button onClick={() => void logout()} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-[#1c075c] py-3 text-sm font-bold text-white"><LogOut size={16}/> Logout akun</button></div></section></div>;
}
