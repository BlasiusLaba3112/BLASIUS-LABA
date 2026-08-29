import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  KeyRound, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Sparkles,
  HeartPulse,
  Database,
  MapPin,
  Users,
  Award
} from 'lucide-react';
import { AuthUser, REGISTERED_CREDENTIALS } from '../types/auth';

interface LoginScreenProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(false);
      } else {
        setIsLoading(false);
        if (!isUserMatch && !isPassMatch) {
          setErrorMsg('Username dan Password tidak cocok dengan akun terdaftar.');
        } else if (!isUserMatch) {
          setErrorMsg('Username salah. Pastikan menggunakan: shyllpb@2026');
        } else {
          setErrorMsg('Password salah. Pastikan menggunakan: Boganatar@2026 (perhatikan huruf besar/kecil).');
        }
      }
    }, 350);
  };

  const handleFillCredentials = () => {
    setUsername(REGISTERED_CREDENTIALS.username);
    setPassword(REGISTERED_CREDENTIALS.password);
    setErrorMsg(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between text-slate-100 font-sans relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Subtle Gradient & Accents */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      {/* Top Banner Navigation Identity */}
      <header className="relative z-10 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1 border border-white/20 flex items-center justify-center shadow-md overflow-hidden">
              <img 
                src="/images/logo_sidebar.png" 
                alt="Logo Puskesmas" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://iili.io/CmfDQtt.png";
                }}
              />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide flex items-center gap-2">
                <span>SIMPEG &bull; UPT PUSKESMAS BOGANATAR</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono border border-blue-500/30">
                  Kode: 1050727
                </span>
              </h1>
              <p className="text-xs text-slate-400">
                Pemerintah Kabupaten Sikka &bull; Dinas Kesehatan
              </p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Cloud Database Firestore Active</span>
          </div>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden backdrop-blur-xl transition-all">
            
            {/* Header / Brand Banner */}
            <div className="p-8 pb-6 text-center border-b border-slate-800/80 relative">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4 ring-4 ring-blue-500/10 p-1.5 backdrop-blur-xs">
                <img 
                  src="https://iili.io/CmfDQtt.png" 
                  alt="Logo Puskesmas Boganatar" 
                  className="w-full h-full object-contain filter drop-shadow-md"
                  referrerPolicy="no-referrer"
                />
              </div>

              <h2 className="text-xl font-bold text-white tracking-tight">
                Autentikasi Petugas
              </h2>
              <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
                Silakan masuk dengan akun terdaftar untuk mengelola data kepegawaian, 5 desa wilayah kerja, dan 12 SPM.
              </p>

              {/* Data Protection Lock Banner */}
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800/80 text-[11px] text-blue-300">
                <Lock className="w-3 h-3 text-blue-400" />
                <span>Penguncian Data Aktif: Data aman saat login & logout</span>
              </div>
            </div>

            {/* Form Section */}
            <div className="p-8 pt-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Error Alert */}
                {errorMsg && (
                  <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/60 text-red-200 text-xs flex items-start gap-2.5 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Username Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      id="login-screen-username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="shyllpb@2026"
                      className="w-full pl-10 pr-3.5 py-2.5 text-sm bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-sans"
                      autoComplete="username"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                      <KeyRound className="w-4 h-4" />
                    </div>
                    <input
                      id="login-screen-password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Masukkan kata sandi..."
                      className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-950/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-sans"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                      title={showPassword ? 'Sembunyikan password' : 'Lihat password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded bg-slate-950 border-slate-700 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900"
                    />
                    <span>Ingat sesi masuk di perangkat ini</span>
                  </label>
                </div>

                {/* Submit CTA */}
                <div className="pt-3">
                  <button
                    id="btn-screen-submit-login"
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Lock className="w-4 h-4" />
                        <span>Masuk ke Aplikasi SIMPEG</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Quick Summary Info Footer */}
            <div className="px-8 py-4 bg-slate-950/60 border-t border-slate-800/80 text-center">
              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-slate-500" />
                  Kepegawaian
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  5 Wilayah Desa
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-slate-500" />
                  12 SPM
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Identity */}
      <footer className="relative z-10 py-4 px-6 border-t border-slate-800/80 bg-slate-900/40 text-center text-xs text-slate-500">
        <p>
          &copy; 2026 UPT Puskesmas Boganatar &bull; Jl. Trans Flores Maumere - Larantuka, Kec. Talibura, Kab. Sikka, NTT
        </p>
      </footer>
    </div>
  );
};
