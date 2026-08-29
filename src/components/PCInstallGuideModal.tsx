import React from 'react';
import { Monitor, Download, CheckCircle2, ShieldCheck, Sparkles, X, Laptop } from 'lucide-react';

interface PCInstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerInstall?: () => void;
  canInstallPrompt: boolean;
}

export const PCInstallGuideModal: React.FC<PCInstallGuideModalProps> = ({
  isOpen,
  onClose,
  onTriggerInstall,
  canInstallPrompt
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden">
      <div 
        id="modal-pc-install-guide"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Laptop className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                Jalankan Sebagai Aplikasi Desktop PC
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Instalasi Mandiri SIMPEG Puskesmas Boganatar di Windows, macOS, atau Linux
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto max-h-[65vh] space-y-5">
          {/* Quick Install Banner if available */}
          {canInstallPrompt ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                  <Download className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-blue-950">
                    Instal Aplikasi Sekarang
                  </h4>
                  <p className="text-xs text-blue-800 mt-0.5">
                    Browser Anda mendukung pemasangan aplikasi PC langsung ke desktop.
                  </p>
                </div>
              </div>
              <button
                id="btn-trigger-pwa-install"
                type="button"
                onClick={() => {
                  if (onTriggerInstall) onTriggerInstall();
                }}
                className="w-full sm:w-auto px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Monitor className="w-4 h-4" />
                <span>Pasang ke PC / Desktop</span>
              </button>
            </div>
          ) : (
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Mode Desktop Mandiri (Standalone PWA PC)
                </h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Aplikasi SIMPEG Puskesmas Boganatar dirancang dengan standar PWA (Progressive Web Application). Anda dapat memasang dan membukanya di jendela khusus PC tanpa browser URL bar, memiliki ikon aplikasi di Desktop / Start Menu, serta bekerja secara mandiri dan cepat.
                </p>
              </div>
            </div>
          )}

          {/* Step by step guide */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Cara Memasang ke Desktop PC (Google Chrome & Microsoft Edge):
            </h4>
            
            <div className="space-y-2.5">
              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                  1
                </span>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Klik Ikon Pasang di Address Bar:</strong> Pada Google Chrome / Microsoft Edge di PC Anda, perhatikan ikon <em>&quot;Install App / Pasang Aplikasi&quot;</em> (<Download className="w-3.5 h-3.5 inline mx-1 text-slate-500" />) di ujung kanan bilah alamat (URL bar) browser.
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                  2
                </span>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Atau via Menu Browser:</strong> Klik tombol titik tiga (<strong>&vellip;</strong>) di pojok kanan atas browser &rarr; Pilih <strong>&quot;Simpan dan bagikan&quot;</strong> atau <strong>&quot;Aplikasi&quot;</strong> &rarr; Klik <strong>&quot;Instal SIMPEG UPT Puskesmas Boganatar&quot;</strong>.
                </div>
              </div>

              <div className="p-3 bg-white border border-slate-200 rounded-xl flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 font-bold text-xs flex items-center justify-center flex-shrink-0">
                  3
                </span>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Selesai:</strong> Pintasan ikon aplikasi SIMPEG akan otomatis muncul di Desktop PC dan Taskbar Windows/Mac Anda. Anda bisa membukanya langsung seperti aplikasi komputer native kapan saja!
                </div>
              </div>
            </div>
          </div>

          {/* PC Application Features */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Keunggulan Menjalankan Aplikasi di PC:</span>
            </h4>
            <ul className="text-xs text-slate-600 space-y-1.5 pl-1">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span><strong>Tampilan Layar Penuh Desktop:</strong> Tata letak tabel, filter, dan dialog dioptimalkan untuk monitor PC lebar (Full HD / 4K).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span><strong>Cetak & Printer Siap Pakai:</strong> Langsung terhubung dengan sistem cetak printer lokal untuk cetak Biodata dan Rekap Duk Kepegawaian (A4/Folio).</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                <span><strong>Penyimpanan Mandiri & Offline-Safe:</strong> Data tersimpan aman di browser/storage lokal PC dan dapat disinkronkan ke Google Sheets kapan saja.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            SIMPEG UPT Puskesmas Boganatar &bull; Desktop Ready
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Mengerti & Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
