import { useState, useEffect, useRef } from "react";
import {
  Home, Clock, User, CheckCircle, XCircle,
  ChevronDown, Calendar, FileText, ArrowLeft,
  Eye, EyeOff, Bell, LogOut, Wifi, AlertCircle,
  ChevronRight
} from "lucide-react";

type Page = "login" | "dashboard" | "history" | "profile";
type LoginTab = "form" | "nfc";
type AttendanceStatus = "on-time" | "late" | "absent";

interface AttendanceRecord {
  id: number;
  day: string;
  dayName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  status: AttendanceStatus;
}

const records: AttendanceRecord[] = [
  { id: 1, day: "01", dayName: "Sel", date: "1 Jul 2026", checkIn: "06:52", checkOut: "14:05", status: "on-time" },
  { id: 2, day: "30", dayName: "Sen", date: "30 Jun 2026", checkIn: "07:18", checkOut: "14:00", status: "late" },
  { id: 3, day: "27", dayName: "Jum", date: "27 Jun 2026", checkIn: "06:50", checkOut: "11:30", status: "on-time" },
  { id: 4, day: "26", dayName: "Kam", date: "26 Jun 2026", checkIn: "-", checkOut: "-", status: "absent" },
  { id: 5, day: "25", dayName: "Rab", date: "25 Jun 2026", checkIn: "06:58", checkOut: "14:02", status: "on-time" },
  { id: 6, day: "24", dayName: "Sel", date: "24 Jun 2026", checkIn: "07:22", checkOut: "14:10", status: "late" },
  { id: 7, day: "23", dayName: "Sen", date: "23 Jun 2026", checkIn: "06:45", checkOut: "14:00", status: "on-time" },
  { id: 8, day: "20", dayName: "Jum", date: "20 Jun 2026", checkIn: "06:53", checkOut: "11:30", status: "on-time" },
];

/* ── Mosque illustration ─────────────────────────────── */
function MosqueIllustration() {
  return (
    <svg viewBox="0 0 320 220" className="w-full max-w-[300px] mx-auto" fill="none" aria-hidden="true">
      <rect width="320" height="220" rx="20" fill="#ecfdf5" />
      {/* clouds */}
      <ellipse cx="70" cy="42" rx="34" ry="15" fill="white" opacity="0.85" />
      <ellipse cx="52" cy="47" rx="22" ry="13" fill="white" opacity="0.85" />
      <ellipse cx="95" cy="47" rx="24" ry="13" fill="white" opacity="0.85" />
      <ellipse cx="230" cy="36" rx="28" ry="13" fill="white" opacity="0.75" />
      <ellipse cx="252" cy="40" rx="20" ry="11" fill="white" opacity="0.75" />
      {/* ground */}
      <rect x="0" y="168" width="320" height="52" fill="#a7f3d0" />
      {/* path */}
      <rect x="142" y="168" width="36" height="52" fill="#6ee7b7" />
      {/* main building */}
      <rect x="80" y="100" width="160" height="75" fill="#059669" />
      {/* roof arch */}
      <path d="M80 100 Q160 55 240 100 Z" fill="#047857" />
      {/* central dome */}
      <ellipse cx="160" cy="90" rx="28" ry="18" fill="#065f46" />
      {/* small domes */}
      <ellipse cx="95" cy="105" rx="16" ry="10" fill="#047857" />
      <ellipse cx="225" cy="105" rx="16" ry="10" fill="#047857" />
      {/* minaret left */}
      <rect x="62" y="72" width="16" height="105" fill="#047857" rx="3" />
      <path d="M70 72 m0 0 a12 12 0 0 1 -10 -10 L70 52 L80 62 a12 12 0 0 1 -10 10Z" fill="#065f46" />
      <rect x="67" y="46" width="6" height="18" fill="#065f46" rx="2" />
      {/* minaret right */}
      <rect x="242" y="72" width="16" height="105" fill="#047857" rx="3" />
      <path d="M250 72 m0 0 a12 12 0 0 1 -10 -10 L250 52 L260 62 a12 12 0 0 1 -10 10Z" fill="#065f46" />
      <rect x="247" y="46" width="6" height="18" fill="#065f46" rx="2" />
      {/* door */}
      <rect x="148" y="133" width="24" height="42" fill="#065f46" rx="12 12 0 0" />
      {/* windows */}
      <rect x="97" y="118" width="18" height="22" fill="#a7f3d0" rx="9 9 0 0" />
      <rect x="205" y="118" width="18" height="22" fill="#a7f3d0" rx="9 9 0 0" />
      {/* star on dome */}
      <path d="M160 68 l2 6 h6 l-5 4 2 6 -5-3 -5 3 2-6 -5-4 h6z" fill="#fbbf24" />
      {/* trees */}
      <ellipse cx="35" cy="158" rx="20" ry="26" fill="#34d399" />
      <rect x="32" y="168" width="6" height="12" fill="#065f46" />
      <ellipse cx="285" cy="155" rx="20" ry="26" fill="#34d399" />
      <rect x="282" y="165" width="6" height="12" fill="#065f46" />
    </svg>
  );
}

/* ── NFC pulse widget ────────────────────────────────── */
function NFCPulse({ active, size = "lg" }: { active: boolean; size?: "sm" | "lg" }) {
  const outer = size === "lg" ? "w-40 h-40" : "w-24 h-24";
  const inner = size === "lg" ? "w-24 h-24" : "w-14 h-14";
  const icon = size === "lg" ? 44 : 24;

  return (
    <div className={`relative flex items-center justify-center ${outer} mx-auto`}>
      {active && (
        <>
          <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-15 animate-ping" style={{ animationDuration: "1.8s" }} />
          <span className="absolute inset-3 rounded-full bg-emerald-400 opacity-15 animate-ping" style={{ animationDuration: "1.8s", animationDelay: "0.35s" }} />
          <span className="absolute inset-6 rounded-full bg-emerald-400 opacity-15 animate-ping" style={{ animationDuration: "1.8s", animationDelay: "0.7s" }} />
        </>
      )}
      <div
        className={`relative z-10 ${inner} rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-xl shadow-emerald-300/40`}
      >
        <svg viewBox="0 0 48 48" width={icon} height={icon} fill="none" aria-hidden="true">
          <path d="M8 24C8 15.16 15.16 8 24 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.4" />
          <path d="M8 24C8 15.16 15.16 8 24 8C32.84 8 40 15.16 40 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
          <path d="M15 24C15 19.03 19.03 15 24 15C28.97 15 33 19.03 33 24C33 28.97 28.97 33 24 33" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
          <circle cx="24" cy="24" r="3.5" fill="white" />
          <path d="M40 12 L40 24 L28 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

/* ── Status badge ────────────────────────────────────── */
function StatusBadge({ status }: { status: AttendanceStatus }) {
  if (status === "on-time")
    return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 whitespace-nowrap">Tepat Waktu</span>;
  if (status === "late")
    return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-700 whitespace-nowrap">Terlambat</span>;
  return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-600 whitespace-nowrap">Tidak Hadir</span>;
}

/* ── School header strip ─────────────────────────────── */
function SchoolHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 px-5 pt-10 pb-5 text-white">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-lg shrink-0">☪</div>
        <div>
          <p className="font-extrabold text-base leading-tight" style={{ fontFamily: "'Nunito', sans-serif" }}>
            SD Muhammadiyah Wonosari
          </p>
          {subtitle && <p className="text-emerald-200 text-xs mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   LOGIN PAGE
════════════════════════════════════════════════════════ */
function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [tab, setTab] = useState<LoginTab>("form");
  const [showPw, setShowPw] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [nfcState, setNfcState] = useState<"idle" | "scanning" | "success">("scanning");

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* Top header */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 px-6 pt-12 pb-6 text-center text-white">
        <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-3xl mx-auto mb-3">☪</div>
        <h1 className="text-xl font-extrabold leading-snug" style={{ fontFamily: "'Nunito', sans-serif" }}>
          SD Muhammadiyah Wonosari
        </h1>
        <p className="text-emerald-200 text-sm mt-1">Sistem Presensi Mandiri — NFC Absensi</p>
      </div>

      {/* Illustration */}
      <div className="px-8 pt-6 pb-2">
        <MosqueIllustration />
        <p className="text-center text-sm text-gray-500 mt-2 font-medium">Selamat datang, silahkan masuk</p>
      </div>

      {/* Login options */}
      <div className="px-5 mt-2">
        <div className="flex bg-gray-100 rounded-2xl p-1 gap-1">
          <button
            onClick={() => setTab("form")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${tab === "form" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-400"}`}
          >
            Username & Password
          </button>
          <button
            onClick={() => setTab("nfc")}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${tab === "nfc" ? "bg-white text-emerald-700 shadow-sm" : "text-gray-400"}`}
          >
            Kartu NFC
          </button>
        </div>
      </div>

      <div className="px-5 py-5 flex-1">
        {tab === "form" ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Username / NIP</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                type="text"
                placeholder="Masukkan username Anda..."
                className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPw ? "text" : "password"}
                  placeholder="Masukkan password Anda..."
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-shadow pr-12"
                />
                <button
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label={showPw ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <button
              onClick={onLogin}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-200 active:scale-[0.98] transition-transform mt-2"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              Masuk
            </button>
            <p className="text-center text-xs text-gray-400">Lupa password? Hubungi administrator</p>
          </div>
        ) : (
          <div className="flex flex-col items-center py-2">
            <p className="text-gray-500 text-sm text-center mb-6 leading-relaxed">
              Dekatkan kartu NFC Anda ke sensor perangkat<br />untuk login secara otomatis
            </p>
            <NFCPulse active={nfcState === "scanning"} />
            <div className="mt-5 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-emerald-600 font-bold text-sm">Mendeteksi kartu NFC...</p>
            </div>
            <div className="mt-8 w-full space-y-3">
              <button
                onClick={onLogin}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-200 active:scale-[0.98] transition-transform"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                Simulasi Tap Kartu NFC
              </button>
              <p className="text-center text-xs text-gray-400">Gunakan kartu NFC yang telah terdaftar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   DASHBOARD PAGE
════════════════════════════════════════════════════════ */
function DashboardPage() {
  const [now, setNow] = useState(new Date());
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-emerald-600 px-5 pt-10 pb-20 text-white">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-emerald-300 text-xs font-semibold uppercase tracking-widest">Selamat Pagi</p>
            <h2 className="font-extrabold text-lg leading-tight mt-0.5" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Budi Santoso, S.Pd.
            </h2>
          </div>
          <div className="relative">
            <button className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
              <Bell size={18} />
            </button>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
              2
            </div>
          </div>
        </div>
        <div className="text-center">
          <p
            className="text-5xl font-extrabold tabular-nums tracking-tight"
            style={{ fontFamily: "'Nunito', sans-serif", letterSpacing: "-0.02em" }}
          >
            {timeStr}
          </p>
          <p className="text-emerald-200 text-sm mt-1.5 capitalize">{dateStr}</p>
        </div>
      </div>

      {/* Cards */}
      <div className="px-4 -mt-12 space-y-3 pb-6">
        {/* Profile card */}
        <div className="bg-white rounded-2xl shadow-sm border border-white p-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center font-extrabold text-emerald-700 text-base shrink-0">
            BS
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-800 text-sm truncate">Budi Santoso, S.Pd.</p>
            <p className="text-emerald-600 text-xs font-semibold">Guru Kelas IV</p>
            <p className="text-gray-400 text-[11px]">NIP: 197806142005011003</p>
          </div>
          <div className="shrink-0 flex flex-col items-end gap-1">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[11px] text-emerald-600 font-semibold">Aktif</span>
            </div>
          </div>
        </div>

        {/* Attendance today */}
        <div className="bg-white rounded-2xl shadow-sm border border-white p-4">
          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Status Kehadiran Hari Ini</p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-50 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-1">
                <CheckCircle size={13} className="text-emerald-600" />
                <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wide">Masuk</span>
              </div>
              <p className="text-2xl font-extrabold text-emerald-700 tabular-nums" style={{ fontFamily: "'Nunito', sans-serif" }}>07:02</p>
              <p className="text-[11px] text-emerald-500 mt-0.5 font-semibold">Tepat Waktu</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3.5">
              <div className="flex items-center gap-1.5 mb-1">
                <Clock size={13} className="text-gray-400" />
                <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Keluar</span>
              </div>
              <p className="text-2xl font-extrabold text-gray-300 tabular-nums" style={{ fontFamily: "'Nunito', sans-serif" }}>--:--</p>
              <p className="text-[11px] text-gray-400 mt-0.5 font-semibold">Belum absen</p>
            </div>
          </div>
        </div>

        {/* NFC scan card */}
        <div className="bg-gradient-to-br from-emerald-800 to-emerald-700 rounded-2xl shadow-xl p-5 text-white overflow-hidden relative">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/5" />
          <div className="absolute -right-2 -top-6 w-20 h-20 rounded-full bg-white/5" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-extrabold text-base" style={{ fontFamily: "'Nunito', sans-serif" }}>Scan Kehadiran</h3>
                <p className="text-emerald-300 text-xs mt-0.5">Dekatkan kartu NFC ke perangkat</p>
              </div>
              <button
                onClick={() => setScanning(!scanning)}
                className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-colors ${scanning ? "bg-emerald-500/30 border-emerald-400/40 text-emerald-200" : "bg-white/10 border-white/20 text-white/60"}`}
              >
                {scanning ? "● AKTIF" : "○ NONAKTIF"}
              </button>
            </div>
            <NFCPulse active={scanning} />
            {scanning ? (
              <p className="text-center text-emerald-300 text-xs font-semibold mt-3 animate-pulse">Siap memindai kartu NFC...</p>
            ) : (
              <p className="text-center text-white/40 text-xs font-semibold mt-3">Pemindai dinonaktifkan</p>
            )}
          </div>
        </div>

        {/* Monthly stats */}
        <div className="bg-white rounded-2xl shadow-sm border border-white p-4">
          <p className="text-[11px] font-extrabold text-gray-400 uppercase tracking-widest mb-3">Rekapitulasi Bulan Ini</p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Hadir", value: "18", color: "text-emerald-600", bg: "bg-emerald-50", bar: "bg-emerald-500", pct: "75%" },
              { label: "Terlambat", value: "3", color: "text-amber-600", bg: "bg-amber-50", bar: "bg-amber-400", pct: "12.5%" },
              { label: "Izin/Absen", value: "1", color: "text-red-500", bg: "bg-red-50", bar: "bg-red-400", pct: "4%" },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-3 text-center`}>
                <p className={`text-2xl font-extrabold ${s.color}`} style={{ fontFamily: "'Nunito', sans-serif" }}>{s.value}</p>
                <p className="text-[11px] text-gray-500 font-semibold mt-0.5">{s.label}</p>
                <div className="mt-2 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                  <div className={`h-full ${s.bar} rounded-full`} style={{ width: s.pct }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   HISTORY PAGE
════════════════════════════════════════════════════════ */
function HistoryPage() {
  const [month, setMonth] = useState("Juli 2026");
  const months = ["Juli 2026", "Juni 2026", "Mei 2026", "April 2026", "Maret 2026"];

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <SchoolHeader title="SD Muhammadiyah Wonosari" subtitle="Riwayat Kehadiran" />

      {/* Filter + summary */}
      <div className="bg-white px-5 pb-4 border-b border-gray-100">
        <div className="mt-4 flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5">
          <Calendar size={15} className="text-emerald-600 shrink-0" />
          <div className="flex-1 relative">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full bg-transparent text-sm font-bold text-gray-700 focus:outline-none appearance-none cursor-pointer pr-6"
            >
              {months.map((m) => <option key={m}>{m}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Summary row */}
        <div className="grid grid-cols-3 gap-2 mt-3">
          {[
            { label: "Tepat Waktu", val: "18", color: "text-emerald-700", bg: "bg-emerald-50" },
            { label: "Terlambat", val: "3", color: "text-amber-700", bg: "bg-amber-50" },
            { label: "Tidak Hadir", val: "1", color: "text-red-600", bg: "bg-red-50" },
          ].map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl py-2.5 text-center`}>
              <p className={`text-xl font-extrabold ${s.color}`} style={{ fontFamily: "'Nunito', sans-serif" }}>{s.val}</p>
              <p className="text-[10px] text-gray-500 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="px-4 mt-3 pb-24 space-y-2.5">
        {records.map((r) => {
          const stripColor =
            r.status === "on-time" ? "bg-emerald-600" : r.status === "late" ? "bg-amber-500" : "bg-red-400";

          return (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex">
              {/* Day strip */}
              <div className={`${stripColor} flex flex-col items-center justify-center px-3.5 py-3 shrink-0`}>
                <span className="text-white font-extrabold text-xl leading-none" style={{ fontFamily: "'Nunito', sans-serif" }}>{r.day}</span>
                <span className="text-white/75 text-[11px] font-semibold">{r.dayName}</span>
              </div>

              {/* Content */}
              <div className="flex-1 px-4 py-3 min-w-0">
                <p className="text-xs text-gray-400 font-semibold mb-1.5">{r.date}</p>
                <div className="flex items-center gap-5">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                    <span className="text-sm font-bold text-gray-700 tabular-nums">{r.checkIn}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <XCircle size={13} className="text-gray-300 shrink-0" />
                    <span className="text-sm font-bold text-gray-400 tabular-nums">{r.checkOut}</span>
                  </div>
                </div>
              </div>

              {/* Badge */}
              <div className="flex items-center pr-4 shrink-0">
                <StatusBadge status={r.status} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   PROFILE PAGE
════════════════════════════════════════════════════════ */
function ProfilePage({ onLogout }: { onLogout: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [leaveStart, setLeaveStart] = useState("");
  const [leaveEnd, setLeaveEnd] = useState("");
  const [leaveReason, setLeaveReason] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setTimeout(() => {
      setShowForm(false);
      setSubmitted(false);
      setLeaveType("");
      setLeaveStart("");
      setLeaveEnd("");
      setLeaveReason("");
    }, 2000);
  };

  const profileFields = [
    { label: "NIP", value: "197806142005011003" },
    { label: "Jabatan", value: "Guru Kelas IV" },
    { label: "Unit Kerja", value: "SD Muhammadiyah Wonosari" },
    { label: "Status Kepegawaian", value: "Pegawai Tetap Yayasan" },
    { label: "Masa Kerja", value: "18 Tahun" },
    { label: "No. HP", value: "0812-3456-7890" },
    { label: "Email", value: "budi.santoso@sdmuh.sch.id" },
  ];

  const leaveHistory = [
    { date: "15 Jun 2026", type: "Sakit", status: "Disetujui", ok: true },
    { date: "2 Mei 2026", type: "Cuti Tahunan", status: "Disetujui", ok: true },
    { date: "10 Apr 2026", type: "Izin Khusus", status: "Ditolak", ok: false },
  ];

  return (
    <div className="flex flex-col min-h-full bg-gray-50">
      <SchoolHeader title="SD Muhammadiyah Wonosari" subtitle="Profil &amp; Pengajuan Izin" />

      {/* Profile hero card */}
      <div className="mx-4 -mt-4 bg-white rounded-2xl shadow-sm border border-white overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-5 py-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center font-extrabold text-emerald-700 text-xl shadow-lg shrink-0">
            BS
          </div>
          <div>
            <h3 className="font-extrabold text-white text-base" style={{ fontFamily: "'Nunito', sans-serif" }}>Budi Santoso, S.Pd.</h3>
            <p className="text-emerald-100 text-sm font-semibold">Guru Kelas IV</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300" />
              <span className="text-emerald-200 text-[11px]">Aktif &bull; Tepat Waktu</span>
            </div>
          </div>
        </div>

        {/* Info fields */}
        <div className="px-5 py-4 space-y-0">
          {profileFields.map((f, i) => (
            <div key={f.label} className={`flex items-start justify-between gap-3 py-2.5 ${i < profileFields.length - 1 ? "border-b border-gray-50" : ""}`}>
              <span className="text-xs text-gray-400 font-semibold w-32 shrink-0 pt-0.5">{f.label}</span>
              <span className="text-xs font-bold text-gray-700 text-right flex-1">{f.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sisa cuti strip */}
      <div className="mx-4 mt-3 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-emerald-600" />
          <span className="text-sm font-bold text-emerald-700">Sisa Cuti Tahunan</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-2xl font-extrabold text-emerald-700" style={{ fontFamily: "'Nunito', sans-serif" }}>10</span>
          <span className="text-xs text-emerald-600 font-semibold">hari</span>
        </div>
      </div>

      {/* Leave section */}
      <div className="mx-4 mt-3 mb-4 bg-white rounded-2xl shadow-sm border border-white p-5">
        {!showForm ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-extrabold text-gray-800" style={{ fontFamily: "'Nunito', sans-serif" }}>Riwayat Izin</h4>
              <span className="text-xs text-gray-400">3 pengajuan</span>
            </div>
            <div className="space-y-2 mb-5">
              {leaveHistory.map((item) => (
                <div key={item.date} className="flex items-center justify-between bg-gray-50 rounded-xl px-3.5 py-2.5">
                  <div>
                    <p className="text-sm font-bold text-gray-700">{item.type}</p>
                    <p className="text-[11px] text-gray-400">{item.date}</p>
                  </div>
                  <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${item.ok ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-100 flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              <FileText size={16} />
              Ajukan Izin / Permit
            </button>
          </>
        ) : (
          <div>
            {submitted ? (
              <div className="py-8 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
                  <CheckCircle size={32} className="text-emerald-600" />
                </div>
                <h4 className="font-extrabold text-gray-800 text-base" style={{ fontFamily: "'Nunito', sans-serif" }}>Pengajuan Terkirim!</h4>
                <p className="text-gray-500 text-sm mt-1">Menunggu persetujuan atasan</p>
              </div>
            ) : (
              <>
                <button onClick={() => setShowForm(false)} className="flex items-center gap-1.5 text-sm text-emerald-600 font-bold mb-5">
                  <ArrowLeft size={15} />
                  Kembali
                </button>
                <h4 className="font-extrabold text-gray-800 mb-4" style={{ fontFamily: "'Nunito', sans-serif" }}>Form Pengajuan Izin</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Jenis Izin</label>
                    <div className="relative">
                      <select
                        value={leaveType}
                        onChange={(e) => setLeaveType(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 appearance-none pr-10"
                      >
                        <option value="">Pilih jenis izin...</option>
                        <option>Sakit</option>
                        <option>Cuti Tahunan</option>
                        <option>Keperluan Keluarga</option>
                        <option>Tugas Dinas Luar</option>
                        <option>Izin Khusus</option>
                      </select>
                      <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Tanggal Mulai</label>
                      <input
                        type="date"
                        value={leaveStart}
                        onChange={(e) => setLeaveStart(e.target.value)}
                        className="w-full px-3 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Tanggal Selesai</label>
                      <input
                        type="date"
                        value={leaveEnd}
                        onChange={(e) => setLeaveEnd(e.target.value)}
                        className="w-full px-3 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Keterangan</label>
                    <textarea
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      placeholder="Jelaskan alasan pengajuan izin Anda secara singkat..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleSubmit}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-700 to-emerald-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-100 active:scale-[0.98] transition-transform"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    Kirim Pengajuan
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Logout */}
      <div className="px-4 pb-28">
        <button
          onClick={onLogout}
          className="w-full py-3.5 rounded-xl border-2 border-red-200 text-red-500 font-bold text-sm flex items-center justify-center gap-2 active:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════
   ROOT
════════════════════════════════════════════════════════ */
export default function App() {
  const [page, setPage] = useState<Page>("login");

  const navItems: { id: Page; Icon: typeof Home; label: string }[] = [
    { id: "dashboard", Icon: Home, label: "Beranda" },
    { id: "history", Icon: Clock, label: "Riwayat" },
    { id: "profile", Icon: User, label: "Profil" },
  ];

  return (
    <>
      <style>{`
        body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .scrollbar-hide { scrollbar-width: none; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        @keyframes softping {
          0%, 100% { transform: scale(1); opacity: 0.2; }
          50% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>

      <div className="min-h-dvh bg-gray-200 flex items-center justify-center">
        {/* Phone shell */}
        <div
          className="w-full max-w-[390px] bg-white flex flex-col relative overflow-hidden shadow-2xl"
          style={{ height: "100dvh", maxHeight: "100dvh" }}
        >
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide">
            {page === "login" && <LoginPage onLogin={() => setPage("dashboard")} />}
            {page === "dashboard" && <DashboardPage />}
            {page === "history" && <HistoryPage />}
            {page === "profile" && <ProfilePage onLogout={() => setPage("login")} />}
          </div>

          {/* Bottom nav */}
          {page !== "login" && (
            <div className="shrink-0 bg-white border-t border-gray-100 flex shadow-[0_-4px_24px_rgba(0,0,0,0.06)]">
              {navItems.map(({ id, Icon, label }) => {
                const active = page === id;
                return (
                  <button
                    key={id}
                    onClick={() => setPage(id)}
                    className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors duration-150 ${active ? "text-emerald-600" : "text-gray-400"}`}
                  >
                    <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                    <span className="text-[11px] font-bold">{label}</span>
                    {active && <span className="w-5 h-0.5 rounded-full bg-emerald-500 mt-0.5" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
