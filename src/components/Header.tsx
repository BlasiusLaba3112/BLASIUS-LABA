import React, { useState } from 'react';
import { 
  Building2, 
  UserPlus, 
  Printer, 
  ShieldAlert, 
  Download, 
  Upload, 
  RotateCcw,
  CheckCircle2,
  FileSpreadsheet,
  Monitor,
  Menu,
  X,
  MapPin,
  Users,
  Target,
  Cloud,
  RefreshCw,
  LogIn,
  LogOut,
  UserCheck,
  Lock,
  Eye,
  ShieldCheck,
  KeyRound,
  Sparkles,
  HeartHandshake
} from 'lucide-react';
import { PuskesmasInfo } from '../types/employee';
import { SyncStatus } from '../services/firestoreDb';
import { AuthUser } from '../types/auth';

export type MainViewType = 'employees' | 'profile' | 'vision-mission' | 'villages' | 'posyandu' | 'spm';

interface HeaderProps {
  puskesmasInfo: PuskesmasInfo;
  totalEmployees: number;
  expiringCount: number;
  currentView: MainViewType;
  currentUser?: AuthUser | null;
  isAdmin?: boolean;
  onOpenLogin?: () => void;
  onLogout?: () => void;
  syncStatus?: SyncStatus;
  isCloudSyncing?: boolean;
  onManualCloudSync?: () => void;
  onViewChange: (view: MainViewType) => void;
  onAddNew: () => void;
  onPrintRekap: () => void;
  onOpenMonitoring: () => void;
  onOpenGoogleSheets: () => void;
  onOpenPCGuide?: () => void;
  onExportCSV: () => void;
  onExportJSON: () => void;
  onImportJSON: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onResetData: () => void;
  onToggleSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  puskesmasInfo,
  totalEmployees,
  expiringCount,
  currentView,
  currentUser,
  isAdmin = false,
  onOpenLogin,
  onLogout,
  syncStatus = 'connected',
  isCloudSyncing = false,
  onManualCloudSync,
  onViewChange,
  onAddNew,
  onPrintRekap,
  onOpenMonitoring,
  onOpenGoogleSheets,
  onOpenPCGuide,
  onExportCSV,
  onExportJSON,
  onImportJSON,
  onResetData,
  onToggleSidebar
}) => {
  const [showExportMenu, setShowExportMenu] = useState(false);

  return (
    <header id="main-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs print:hidden">
      {/* Top Meta Identity Bar with Top-Right Login / Logout & Profile */}
      <div className="bg-slate-950 text-slate-300 px-4 sm:px-8 py-2 text-xs font-medium flex flex-wrap justify-between items-center gap-2.5 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-300">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-xs shadow-emerald-400/50"></span>
          <span className="font-semibold text-slate-200">
            Pemerintah Kabupaten Sikka &bull; Dinkes &bull; <span className="text-white font-bold">{puskesmasInfo.fullName}</span>
          </span>
        </div>

        {/* Top-Right Area: Role Mode Badge + Data Lock Badge + Cloud Database Status + Login / Shyllpb Account & Logout */}
        <div className="flex items-center gap-2 text-[11px] ml-auto flex-wrap">
          {/* Access Control Role Badge */}
          {isAdmin ? (
            <div 
              id="role-mode-badge-admin"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-semibold shadow-inner"
              title="Hak Akses: Administrator (Dapat menambah, mengubah, dan menghapus seluruh data)"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-emerald-200">Mode Admin (Edit Aktif)</span>
            </div>
          ) : (
            <button 
              id="role-mode-badge-viewer"
              onClick={onOpenLogin}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-amber-300 font-semibold shadow-inner cursor-pointer hover:bg-amber-900/80 transition-colors"
              title="Hak Akses: Pengunjung / Staf (Hanya Lihat). Klik untuk Login sebagai Admin."
            >
              <Eye className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px] text-amber-200">Mode Hanya Lihat (Read-Only)</span>
            </button>
          )}

          {/* Data Lock Protection Badge */}
          <div 
            id="data-locked-protection-badge"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/70 border border-blue-800/60 text-blue-300 font-medium shadow-inner"
            title="Sistem Penguncian Data Aktif: Data tidak akan terhapus saat Login/Logout maupun Refresh"
          >
            <Lock className="w-3 h-3 text-blue-400" />
            <span className="text-[10px] font-semibold text-blue-200">Data Terkunci & Aman</span>
          </div>

          {/* Cloud Sync Pill */}
          <div 
            id="cloud-database-status-pill"
            className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800 text-emerald-400 font-medium shadow-inner"
            title="Database Cloud Firestore Terhubung & Sinkron Real-time"
          >
            <Cloud className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-slate-300 font-mono">
              {isCloudSyncing ? 'Sinkron Cloud...' : 'Cloud Terhubung'}
            </span>
            {onManualCloudSync && (
              <button 
                onClick={onManualCloudSync} 
                disabled={isCloudSyncing}
                className="hover:text-white transition-colors cursor-pointer ml-0.5"
                title="Paksa Sinkronkan Database Cloud"
              >
                <RefreshCw className={`w-2.5 h-2.5 ${isCloudSyncing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
              </button>
            )}
          </div>

          <span className="hidden sm:inline text-slate-600">&bull;</span>
          <span className="hidden xl:inline text-slate-400">Kode: <strong className="text-white font-mono">{puskesmasInfo.codePuskesmas}</strong></span>

          {/* User Account / Profile & Dedicated Logout Buttons in TOP-RIGHT CORNER */}
          {currentUser ? (
            <div className="flex items-center gap-1.5 pl-2 sm:border-l sm:border-slate-800">
              {onOpenLogin && (
                <button
                  id="topbar-user-profile"
                  onClick={onOpenLogin}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-emerald-500/40 hover:border-emerald-400 transition-all cursor-pointer shadow-xs group"
                  title={`Klik untuk melihat detail profil: ${currentUser.fullName} (${currentUser.username})`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-emerald-400/60 shadow-2xs shrink-0">
                    <img 
                      src="/images/user_avatar.jpg" 
                      alt="Avatar" 
                      className="w-full h-full object-cover object-top"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://iili.io/Cmfynls.jpg";
                      }}
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-left">
                    <span className="font-bold text-white text-xs group-hover:text-emerald-300 transition-colors">
                      {currentUser.fullName}
                    </span>
                    <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 text-[10px] font-mono rounded">
                      Admin
                    </span>
                  </div>
                </button>
              )}

              {onLogout && (
                <button
                  id="topbar-logout-btn"
                  onClick={onLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-xl bg-rose-950/80 hover:bg-rose-600 text-rose-200 hover:text-white border border-rose-700/50 hover:border-rose-500 transition-all cursor-pointer shadow-xs"
                  title="Keluar dari Akun Admin (Beralih ke Mode Hanya Lihat)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          ) : (
            onOpenLogin && (
              <button
                id="topbar-login-btn"
                onClick={onOpenLogin}
                className="inline-flex items-center gap-2 px-3.5 py-1 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/30 transition-all cursor-pointer ring-1 ring-blue-400/40"
                title="Login Petugas (shyllpb@2026)"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-200" />
                <span>Login Admin</span>
              </button>
            )
          )}
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="px-4 sm:px-8 py-3.5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3.5">
        {/* Left: Mobile Toggle & Main Navigation Switcher */}
        <div className="flex items-center gap-3 flex-wrap">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200 transition-colors cursor-pointer shadow-2xs"
              title="Buka Menu Samping"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}
          
          {/* Main Navigation Segmented Switcher */}
          <nav className="flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 shadow-inner overflow-x-auto max-w-full gap-1">
            {/* 1. SIMPEG Pegawai */}
            <button
              id="tab-nav-employees"
              onClick={() => onViewChange('employees')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'employees'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-1 ring-blue-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="Data Kepegawaian & Nakes Puskesmas"
            >
              <Users className={`w-3.5 h-3.5 ${currentView === 'employees' ? 'text-white' : 'text-blue-600'}`} />
              <span>SIMPEG</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                currentView === 'employees' ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-700'
              }`}>
                {totalEmployees}
              </span>
            </button>

            {/* 2. Profil Puskesmas */}
            <button
              id="tab-nav-profile"
              onClick={() => onViewChange('profile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'profile'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-1 ring-emerald-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="Profil Lembaga & Fasilitas Puskesmas"
            >
              <Building2 className={`w-3.5 h-3.5 ${currentView === 'profile' ? 'text-white' : 'text-emerald-600'}`} />
              <span>Profil</span>
            </button>

            {/* 3. Visi & Misi */}
            <button
              id="tab-nav-vision-mission"
              onClick={() => onViewChange('vision-mission')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'vision-mission'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/20 ring-1 ring-teal-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="Visi, Misi & Tata Nilai Budaya Kerja"
            >
              <Sparkles className={`w-3.5 h-3.5 ${currentView === 'vision-mission' ? 'text-white' : 'text-teal-600'}`} />
              <span>Visi & Misi</span>
            </button>

            {/* 4. 5 Desa Binaan */}
            <button
              id="tab-nav-villages"
              onClick={() => onViewChange('villages')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'villages'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20 ring-1 ring-cyan-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="Matriks Demografi & Wilayah 5 Desa Binaan"
            >
              <MapPin className={`w-3.5 h-3.5 ${currentView === 'villages' ? 'text-white' : 'text-cyan-600'}`} />
              <span>5 Desa</span>
            </button>

            {/* 5. Data Posyandu */}
            <button
              id="tab-nav-posyandu"
              onClick={() => onViewChange('posyandu')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'posyandu'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/20 ring-1 ring-pink-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="Data 16 Posyandu, Jadwal & Kader"
            >
              <HeartHandshake className={`w-3.5 h-3.5 ${currentView === 'posyandu' ? 'text-white' : 'text-pink-600'}`} />
              <span>Posyandu</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-semibold ${
                currentView === 'posyandu' ? 'bg-pink-800 text-pink-100' : 'bg-slate-200 text-slate-700'
              }`}>
                16
              </span>
            </button>

            {/* 6. 12 SPM Kesehatan */}
            <button
              id="tab-nav-spm"
              onClick={() => onViewChange('spm')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentView === 'spm'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 ring-1 ring-indigo-700'
                  : 'text-slate-700 hover:text-slate-900 hover:bg-white/80'
              }`}
              title="Monitoring Capaian 12 Standar Pelayanan Minimal"
            >
              <Target className={`w-3.5 h-3.5 ${currentView === 'spm' ? 'text-white' : 'text-indigo-600'}`} />
              <span>12 SPM</span>
            </button>
          </nav>
        </div>

        {/* Right: Action Buttons Group */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary CTA: Tambah Pegawai */}
          <button
            id="btn-add-employee"
            onClick={onAddNew}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer transform active:scale-95 ${
              isAdmin
                ? 'text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 hover:shadow-md hover:shadow-blue-600/20'
                : 'text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200'
            }`}
            title={isAdmin ? "Tambah Data Pegawai / Nakes Baru" : "Hanya Admin yang dapat menambah pegawai (Klik untuk Login)"}
          >
            {isAdmin ? <UserPlus className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5 text-blue-600" />}
            <span>+ Tambah Pegawai</span>
            {!isAdmin && (
              <span className="px-1.5 py-0.2 bg-blue-200/70 text-blue-800 text-[10px] font-semibold rounded">
                Admin
              </span>
            )}
          </button>

          {/* Quick Action Tools Group */}
          <div className="flex items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 shadow-2xs">
            {/* STR / SIP Alert Button */}
            <button
              id="btn-monitoring-str-sip"
              onClick={onOpenMonitoring}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                expiringCount > 0
                  ? 'bg-amber-500 text-white shadow-xs hover:bg-amber-600 animate-pulse'
                  : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
              title="Monitoring Masa Berlaku STR & SIP Tenaga Kesehatan"
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${expiringCount > 0 ? 'text-white' : 'text-amber-500'}`} />
              <span className="hidden sm:inline">STR/SIP</span>
              {expiringCount > 0 && (
                <span className="px-1.5 py-0.2 bg-amber-800 text-white rounded-full text-[10px] font-black">
                  {expiringCount}
                </span>
              )}
            </button>

            {/* Google Sheets Sync Button */}
            <button
              id="btn-open-google-sheets"
              onClick={onOpenGoogleSheets}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-lg transition-all shadow-2xs cursor-pointer"
              title="Integrasi & Sinkronisasi Google Sheets Puskesmas Boganatar"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden md:inline">Sheets</span>
            </button>

            {/* Cetak Rekap List */}
            <button
              id="btn-print-rekap"
              onClick={onPrintRekap}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
              title="Cetak Laporan Rekapitulasi Pegawai"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden md:inline">Cetak Rekap</span>
            </button>

            {/* PC Desktop App Button */}
            {onOpenPCGuide && (
              <button
                id="btn-open-pc-mode"
                onClick={onOpenPCGuide}
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
                title="Petunjuk Pasang / Buka sebagai Aplikasi Komputer PC"
              >
                <Monitor className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden xl:inline">Mode PC</span>
              </button>
            )}

            {/* Backup / Export Dropdown */}
            <div className="relative">
              <button
                id="btn-export-menu"
                onClick={() => setShowExportMenu(!showExportMenu)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors shadow-2xs cursor-pointer"
                title="Menu Cadangkan & Ekspor Data"
              >
                <Download className="w-3.5 h-3.5 text-slate-500" />
                <span>Data</span>
              </button>

              {showExportMenu && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setShowExportMenu(false)}
                >
                  <div className="px-3.5 py-1 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Google Cloud & Sheets
                  </div>
                  <button
                    id="btn-menu-google-sheets"
                    onClick={() => { onOpenGoogleSheets(); setShowExportMenu(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-emerald-50 text-emerald-800 flex items-center gap-2.5 font-medium cursor-pointer"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>Sinkronisasi Google Sheets</span>
                  </button>

                  <div className="my-1.5 border-t border-slate-100"></div>
                  <div className="px-3.5 py-1 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                    Ekspor Data
                  </div>
                  <button
                    id="btn-export-csv"
                    onClick={() => { onExportCSV(); setShowExportMenu(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-blue-600" />
                    <span>Unduh Excel / CSV Pegawai</span>
                  </button>
                  <button
                    id="btn-export-json"
                    onClick={() => { onExportJSON(); setShowExportMenu(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer font-medium"
                  >
                    <Download className="w-4 h-4 text-slate-600" />
                    <span>Cadangkan File JSON</span>
                  </button>
                  
                  {isAdmin && (
                    <>
                      <div className="my-1.5 border-t border-slate-100"></div>
                      <div className="px-3.5 py-1 font-bold text-slate-400 uppercase tracking-wider text-[10px] flex items-center justify-between">
                        <span>Pemulihan Data</span>
                        <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 text-slate-600 font-mono rounded">Admin</span>
                      </div>
                      <label className="w-full text-left px-3.5 py-2 hover:bg-slate-50 text-slate-700 flex items-center gap-2.5 cursor-pointer font-medium">
                        <Upload className="w-4 h-4 text-indigo-600" />
                        <span>Pulihkan Backup JSON</span>
                        <input type="file" accept=".json" onChange={(e) => { onImportJSON(e); setShowExportMenu(false); }} className="hidden" />
                      </label>
                      <button
                        id="btn-reset-sample"
                        onClick={() => { onResetData(); setShowExportMenu(false); }}
                        className="w-full text-left px-3.5 py-2 hover:bg-red-50 text-red-600 flex items-center gap-2.5 cursor-pointer font-medium"
                      >
                        <RotateCcw className="w-4 h-4 text-red-500" />
                        <span>Reset ke Data Pegawai Awal</span>
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
