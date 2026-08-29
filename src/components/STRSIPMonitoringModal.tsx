import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Printer, 
  Calendar, 
  Edit3, 
  Search,
  ExternalLink,
  Lock
} from 'lucide-react';
import { Employee } from '../types/employee';
import { getCredentialStatus, formatDateIndonesian } from '../utils/helpers';

interface STRSIPMonitoringModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  isAdmin?: boolean;
  onEditEmployee: (emp: Employee) => void;
  onPrintEmployee: (emp: Employee) => void;
}

export const STRSIPMonitoringModal: React.FC<STRSIPMonitoringModalProps> = ({
  isOpen,
  onClose,
  employees,
  isAdmin = false,
  onEditEmployee,
  onPrintEmployee
}) => {
  const [filterMode, setFilterMode] = useState<'ALL_NAKES' | 'WARNING_EXPIRED' | 'EXPIRED' | 'LIFETIME'>('ALL_NAKES');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const nakesEmployees = employees.filter(e => e.staffCategory === 'Nakes');

  const processed = nakesEmployees.map(emp => {
    const strStat = getCredentialStatus(emp.strExpiryDate, emp.strIsLifetime, true);
    const sipStat = getCredentialStatus(emp.sipExpiryDate, false, true);

    const hasWarning = strStat.status === 'warning' || sipStat.status === 'warning';
    const hasExpired = strStat.status === 'expired' || sipStat.status === 'expired';

    return {
      emp,
      strStat,
      sipStat,
      hasWarning,
      hasExpired,
      needsAttention: hasWarning || hasExpired
    };
  });

  const filtered = processed.filter(item => {
    const q = search.toLowerCase();
    const matchQuery = !q || 
      item.emp.fullName.toLowerCase().includes(q) || 
      item.emp.nip.toLowerCase().includes(q) ||
      item.emp.jobTitle.toLowerCase().includes(q);

    if (!matchQuery) return false;

    if (filterMode === 'WARNING_EXPIRED') return item.needsAttention;
    if (filterMode === 'EXPIRED') return item.hasExpired;
    if (filterMode === 'LIFETIME') return item.emp.strIsLifetime;
    return true;
  });

  const expiredCount = processed.filter(p => p.hasExpired).length;
  const warningCount = processed.filter(p => p.hasWarning).length;
  const lifetimeCount = processed.filter(p => p.emp.strIsLifetime).length;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:hidden">
      <div 
        id="modal-str-sip-monitoring"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-600 flex items-center justify-center text-white shadow-2xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Monitoring Masa Berlaku Legalitas Profesi (STR & SIP Nakes)
              </h2>
              <p className="text-xs text-slate-400">
                Peringatan Dini & Validasi Surat Izin Praktik Tenaga Kesehatan Puskesmas Boganatar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Stats Bar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterMode('ALL_NAKES')}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                filterMode === 'ALL_NAKES' 
                  ? 'bg-blue-600 text-white border-blue-600 shadow-2xs' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              Semua Nakes ({nakesEmployees.length})
            </button>
            <button
              onClick={() => setFilterMode('WARNING_EXPIRED')}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all flex items-center gap-1.5 ${
                filterMode === 'WARNING_EXPIRED' 
                  ? 'bg-orange-600 text-white border-orange-600 shadow-2xs' 
                  : 'bg-orange-50 text-orange-900 border-orange-200 hover:bg-orange-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
              <span>Perlu Perpanjangan ({warningCount + expiredCount})</span>
            </button>
            <button
              onClick={() => setFilterMode('LIFETIME')}
              className={`px-3 py-1.5 rounded-lg font-semibold border transition-all ${
                filterMode === 'LIFETIME' 
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
              }`}
            >
              STR Seumur Hidup ({lifetimeCount})
            </button>
          </div>

          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari nakes atau jabatan..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-1 focus:ring-blue-500 focus:outline-none placeholder-slate-400 text-slate-800"
            />
          </div>
        </div>

        {/* Content Table */}
        <div className="flex-1 overflow-y-auto p-4 text-xs">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold text-left">
                <th className="py-2.5 px-3">Tenaga Kesehatan</th>
                <th className="py-2.5 px-3">Nomor STR & Masa Berlaku</th>
                <th className="py-2.5 px-3">Nomor SIP & Masa Berlaku</th>
                <th className="py-2.5 px-3 text-center">Aksi Cepat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-slate-400">
                    Tidak ada tenaga kesehatan yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filtered.map(({ emp, strStat, sipStat, needsAttention }) => (
                  <tr 
                    key={emp.id}
                    className={`hover:bg-slate-50 transition-colors ${needsAttention ? 'bg-orange-50/20' : ''}`}
                  >
                    {/* Employee Profile */}
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={emp.photoUrl}
                          alt={emp.fullName}
                          className="w-9 h-9 rounded-full object-cover border border-slate-200"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}&background=2563eb&color=fff`;
                          }}
                        />
                        <div>
                          <div className="font-bold text-slate-900 text-xs">{emp.fullName}</div>
                          <div className="text-[11px] text-slate-500">{emp.jobTitle} &bull; {emp.department}</div>
                        </div>
                      </div>
                    </td>

                    {/* STR Status */}
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="font-mono font-medium text-slate-800">{emp.strNumber || '-'}</div>
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${strStat.badgeClass}`}>
                            {emp.strIsLifetime ? 'Seumur Hidup' : strStat.label}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* SIP Status */}
                    <td className="py-3 px-3">
                      <div className="space-y-1">
                        <div className="font-mono font-medium text-slate-800">{emp.sipNumber || '-'}</div>
                        <div>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold border ${sipStat.badgeClass}`}>
                            {emp.sipExpiryDate ? sipStat.label : 'Belum Terdata'}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-3 text-center">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onEditEmployee(emp)}
                          className={`px-2.5 py-1 border rounded font-medium flex items-center gap-1 text-[11px] transition-colors ${
                            isAdmin
                              ? 'bg-white border-slate-300 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700'
                              : 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800'
                          }`}
                          title={isAdmin ? "Perbarui STR / SIP" : "Hanya Admin yang dapat memperbarui STR/SIP (Klik untuk Login)"}
                        >
                          {isAdmin ? <Edit3 className="w-3 h-3 text-blue-600" /> : <Lock className="w-3 h-3 text-amber-700" />}
                          <span>{isAdmin ? 'Perbarui' : 'Perbarui (Admin)'}</span>
                        </button>
                        <button
                          onClick={() => onPrintEmployee(emp)}
                          className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                          title="Cetak Profil"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500">
          <span>
            Berdasarkan Surat Edaran Kemenkes RI Mengenai Penerbitan STR Seumur Hidup & SIP Berkala 5 Tahunan
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
