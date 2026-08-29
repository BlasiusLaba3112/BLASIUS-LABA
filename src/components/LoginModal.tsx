import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  LogOut, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  Sparkles,
  ZoomIn,
  Download,
  Maximize2,
  MessageCircle,
  Phone
} from 'lucide-react';
import { AuthUser, REGISTERED_CREDENTIALS } from '../types/auth';

interface LoginModalProps {
  isOpen: boolean;
  currentUser: AuthUser | null;
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onLoginSuccess,
  onLogout
}) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    setTimeout(() => {
      const cleanInputUser = username.trim();
      const cleanInputPass = password.trim();

      if (!cleanInputUser || !cleanInputPass) {
        setErrorMsg('Harap masukkan Username dan Password.');
        setIsLoading(false);
        return;
      }

      // Check registered credentials
      const isUserMatch = cleanInputUser.toLowerCase() === REGISTERED_CREDENTIALS.username.toLowerCase();
      const isPassMatch = cleanInputPass === REGISTERED_CREDENTIALS.password;

      if (isUserMatch && isPassMatch) {
        const loggedUser: AuthUser = {
          username: REGISTERED_CREDENTIALS.username,
          fullName: REGISTERED_CREDENTIALS.fullName,
          role: REGISTERED_CREDENTIALS.role,
          roleType: REGISTERED_CREDENTIALS.roleType,
          workUnit: REGISTERED_CREDENTIALS.workUnit,
          loginTime: new Date().toISOString()
        };

        if (rememberMe) {
          localStorage.setItem('simpeg_auth_user', JSON.stringify(loggedUser));
        } else {
          sessionStorage.setItem('simpeg_auth_user', JSON.stringify(loggedUser));
        }

        onLoginSuccess(loggedUser);
        setUsername('');
        setPassword('');
        setIsLoading(false);
        onClose();
      } else {
        setIsLoading(false);
        if (!isUserMatch && !isPassMatch) {
          setErrorMsg('Username dan Password tidak cocok dengan data akun terdaftar.');
        } else if (!isUserMatch) {
          setErrorMsg('Username salah. Silakan periksa kembali akun Anda.');
        } else {
          setErrorMsg('Password salah. Pastikan penulisan huruf besar/kecil sesuai (Boganatar@2026).');
        }
      }
    }, 300);
  };

  const handleFillCredentials = () => {
    setUsername(REGISTERED_CREDENTIALS.username);
    setPassword(REGISTERED_CREDENTIALS.password);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        id="login-modal-container"
        className="relative bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header with Dark Green/Blue Gradient */}
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 p-6 text-white text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center mb-3 shadow-inner p-1.5 backdrop-blur-xs">
            <img 
              src="https://iili.io/CmDvGdQ.png" 
              alt="Logo Puskesmas Boganatar" 
              className="w-full h-full object-contain filter drop-shadow-md"
              referrerPolicy="no-referrer"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (!target.dataset.triedJpg) {
                  target.dataset.triedJpg = 'true';
                  target.src = 'https://iili.io/CmDvGdQ.jpg';
                }
              }}
            />
          </div>

          <h2 className="text-lg font-bold tracking-tight text-white uppercase">
            {currentUser ? 'Akun Petugas Terhubung' : 'LOGIN SIMPEG UPT PUSKESMAS BOGANATAR'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            UPT Puskesmas Boganatar &bull; Dinas Kesehatan Kab. Sikka
          </p>
        </div>

        {/* Content Area */}
        <div className="p-6 sm:p-8">
          {currentUser ? (
            /* Already Logged In View */
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-3.5">
                <div 
                  onClick={() => setIsImageViewerOpen(true)}
                  className="w-14 h-14 rounded-full overflow-hidden border-2 border-emerald-500 shadow-md shrink-0 cursor-zoom-in relative group transition-transform hover:scale-105"
                  title="Klik untuk melihat foto profil ukuran besar"
                >
                  <img 
                    src="/images/user_avatar.jpg" 
                    alt="Foto Profil Petugas" 
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://iili.io/Cmfynls.jpg";
                    }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                    <ZoomIn className="w-5 h-5 drop-shadow-md" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-sm">
                    <span>{currentUser.fullName}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                  </div>
                  <p className="text-xs text-emerald-700 font-bold tracking-wide uppercase mt-0.5">ADMINISTRATOR</p>
                  <p className="text-[11px] text-slate-600 mt-1 font-mono">User: {currentUser.username}</p>
                  
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsImageViewerOpen(true)}
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 cursor-pointer"
                    >
                      <ZoomIn className="w-3.5 h-3.5" />
                      <span>Lihat Foto</span>
                    </button>
                    <span className="text-slate-300">&bull;</span>
                    <a
                      href="https://wa.me/6281236862741?text=Halo%20Admin%20SIMPEG%20UPT%20Puskesmas%20Boganatar"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-bold shadow-xs transition-colors cursor-pointer"
                      title="Kirim pesan WhatsApp langsung"
                    >
                      <MessageCircle className="w-3 h-3" />
                      <span>WhatsApp: 081236862741</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">Status Sesi:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Aktif / Terautentikasi
                  </span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">Hak Akses:</span>
                  <span className="font-semibold text-slate-800">@shyllpb</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-slate-200">
                  <span className="text-slate-500">Puskesmas:</span>
                  <span className="font-semibold text-slate-800">UPT Boganatar (Kode: P5310040202)</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-slate-500">Kontak Pengelola:</span>
                  <a
                    href="https://wa.me/6281236862741?text=Halo%20Admin%20SIMPEG%20UPT%20Puskesmas%20Boganatar"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 underline underline-offset-2"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>081236862741 (Chat WA)</span>
                  </a>
                </div>
              </div>

              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Kembali ke Aplikasi
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar / Logout</span>
                </button>
              </div>
            </div>
          ) : (
            /* Login Form View */
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2 text-xs text-red-700 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Username Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Username Terdaftar
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="login-username-input"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="shyllpb@2026"
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-slate-900"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Password Akun
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <input
                    id="login-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan Password..."
                    className="w-full pl-9 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all text-slate-900"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={showPassword ? 'Sembunyikan Password' : 'Lihat Password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 border-slate-300 focus:ring-blue-500"
                  />
                  <span>Ingat login di perangkat ini</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  id="btn-submit-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Masuk / Login Petugas</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Footer Info */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-center flex flex-col sm:flex-row items-center justify-center gap-1.5 sm:gap-3">
          <span className="text-[11px] font-medium text-slate-600">
            Created By @shyllpb
          </span>
          <span className="hidden sm:inline text-slate-300">&bull;</span>
          <a
            href="https://wa.me/6281236862741?text=Halo%20Admin%20SIMPEG%20UPT%20Puskesmas%20Boganatar"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[11px] font-bold transition-all cursor-pointer shadow-2xs hover:scale-105"
            title="Kirim pesan WhatsApp langsung ke 081236862741"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>WA: 081236862741 (Chat Sekarang)</span>
          </a>
        </div>
      </div>

      {/* FULLSCREEN PHOTO PREVIEW MODAL / LIGHTBOX */}
      {isImageViewerOpen && (
        <div 
          id="photo-lightbox-modal"
          className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsImageViewerOpen(false)}
        >
          <div 
            className="relative max-w-lg w-full bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="w-full px-5 py-3.5 bg-slate-800/90 border-b border-slate-700/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Maximize2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-white tracking-wide">
                  Foto Profil Petugas
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsImageViewerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/60 transition-colors cursor-pointer"
                title="Tutup Pratinjau"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main High-Res Image Display */}
            <div className="p-6 flex flex-col items-center justify-center bg-slate-950/60 w-full">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border-2 border-slate-700 bg-slate-900 max-h-[60vh] max-w-xs flex items-center justify-center">
                <img 
                  src="/images/user_avatar.jpg" 
                  alt="Foto Profil Petugas Ukuran Penuh" 
                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://iili.io/Cmfynls.jpg";
                  }}
                />
              </div>

              {/* User Bio Details */}
              <div className="text-center mt-4 text-white">
                <h4 className="text-base font-bold text-emerald-300">
                  {currentUser?.fullName || 'Blasius Laba'}
                </h4>
                <p className="text-xs text-slate-300 mt-0.5">
                  {currentUser?.role || 'Administrator Kepegawaian & Wilayah'}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  User: {currentUser?.username || 'shyllpb@2026'} &bull; UPT Puskesmas Boganatar
                </p>
              </div>
            </div>

            {/* Modal Footer with Actions */}
            <div className="w-full px-5 py-3 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between gap-3">
              <a
                href="https://iili.io/Cmfynls.jpg"
                target="_blank"
                rel="noreferrer"
                download="Foto_Profil_Petugas.jpg"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Foto</span>
              </a>

              <button
                type="button"
                onClick={() => setIsImageViewerOpen(false)}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
