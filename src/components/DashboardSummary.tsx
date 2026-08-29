import React from 'react';
import { 
  Users, 
  Stethoscope, 
  Award, 
  ShieldCheck,
  Clock,
  FileText,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';
import { Employee } from '../types/employee';
import { getCredentialStatus } from '../utils/helpers';

interface DashboardSummaryProps {
  employees: Employee[];
  activeFilterStatus: string;
  activeFilterCategory: string;
  onSelectStatusFilter: (status: string) => void;
  onSelectCategoryFilter: (category: string) => void;
  onOpenMonitoring: () => void;
}

export const DashboardSummary: React.FC<DashboardSummaryProps> = ({
  employees,
  activeFilterStatus,
  activeFilterCategory,
  onSelectStatusFilter,
  onSelectCategoryFilter,
  onOpenMonitoring,
}) => {
  const total = employees.length;
  const pnsCount = employees.filter(e => e.employmentStatus === 'PNS').length;
  const pppkCount = employees.filter(e => e.employmentStatus === 'PPPK').length;
  const pppkPwCount = employees.filter(e => e.employmentStatus === 'PPPK Paruh Waktu').length;
  const honorCount = employees.filter(e => ['Honorer Daerah', 'THL', 'Magang / Sukarela'].includes(e.employmentStatus)).length;
  
  const nakesCount = employees.filter(e => e.staffCategory === 'Nakes').length;
  const nonNakesCount = employees.filter(e => e.staffCategory === 'Non-Nakes').length;

  // STR / SIP warning calculation (Expiring within 90 days or expired)
  const expiringCredentials = employees.filter(e => {
    if (e.staffCategory !== 'Nakes') return false;
    const strStatus = getCredentialStatus(e.strExpiryDate, e.strIsLifetime, true);
    const sipStatus = getCredentialStatus(e.sipExpiryDate, false, true);
    return strStatus.status === 'warning' || strStatus.status === 'expired' || 
           sipStatus.status === 'warning' || sipStatus.status === 'expired';
  });

  return (
    <div id="dashboard-summary-cards" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-3 mb-6 print:hidden">
      {/* Card 1: Total Pegawai */}
      <div 
        id="card-total-employees"
        onClick={() => { onSelectStatusFilter('ALL'); onSelectCategoryFilter('ALL'); }}
        className={`bg-white p-3.5 rounded-xl shadow-xs border transition-all cursor-pointer hover:shadow-md ${
          activeFilterStatus === 'ALL' && activeFilterCategory === 'ALL'
            ? 'border-blue-500 ring-2 ring-blue-100 bg-blue-50/10'
            : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Total Pegawai
          </p>
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <p className="text-xl font-bold text-slate-800">{total}</p>
          <span className="text-[11px] text-slate-500">Orang</span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
          <span>Semua Staf</span>
          <span className="font-semibold text-blue-600">100%</span>
        </div>
      </div>

      {/* Card 2: PNS (Pegawai Negeri Sipil) */}
      <div 
        id="card-asn-employees"
        onClick={() => { onSelectStatusFilter('PNS'); onSelectCategoryFilter('ALL'); }}
        className={`bg-white p-3.5 rounded-xl shadow-xs border transition-all cursor-pointer hover:shadow-md ${
          activeFilterStatus === 'PNS'
            ? 'border-emerald-500 ring-2 ring-emerald-100 bg-emerald-50/20'
            : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
            PNS
          </p>
          <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <p className="text-xl font-bold text-emerald-900">{pnsCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">
            ({Math.round((pnsCount / (total || 1)) * 100)}%)
          </span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
          <span>Tetap ASN</span>
          <span className="font-semibold text-emerald-700">PNS Aktif</span>
        </div>
      </div>

      {/* Card 3: PPPK (Penuh Waktu) */}
      <div 
        id="card-pppk-employees"
        onClick={() => { onSelectStatusFilter('PPPK'); onSelectCategoryFilter('ALL'); }}
        className={`bg-white p-3.5 rounded-xl shadow-xs border transition-all cursor-pointer hover:shadow-md ${
          activeFilterStatus === 'PPPK'
            ? 'border-teal-500 ring-2 ring-teal-100 bg-teal-50/20'
            : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-teal-700 font-bold uppercase tracking-wider">
            PPPK
          </p>
          <div className="w-7 h-7 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <p className="text-xl font-bold text-teal-900">{pppkCount}</p>
          <span className="text-[11px] text-teal-600 font-medium">
            ({Math.round((pppkCount / (total || 1)) * 100)}%)
          </span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
          <span>Penuh Waktu</span>
          <span className="font-semibold text-teal-700">ASN P3K</span>
        </div>
      </div>

      {/* Card 4: PPPK Paruh Waktu */}
      <div 
        id="card-pppk-pw-employees"
        onClick={() => { onSelectStatusFilter('PPPK Paruh Waktu'); onSelectCategoryFilter('ALL'); }}
        className={`bg-white p-3.5 rounded-xl shadow-xs border transition-all cursor-pointer hover:shadow-md ${
          activeFilterStatus === 'PPPK Paruh Waktu'
            ? 'border-purple-500 ring-2 ring-purple-100 bg-purple-50/20'
            : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-purple-700 font-bold uppercase tracking-wider">
            PPPK Paruh Waktu
          </p>
          <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
            <Clock className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <p className="text-xl font-bold text-purple-900">{pppkPwCount}</p>
          <span className="text-[11px] text-purple-600 font-medium">
            ({Math.round((pppkPwCount / (total || 1)) * 100)}%)
          </span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
          <span>Paruh Waktu (PW)</span>
          <span className="font-semibold text-purple-700">P3K PW</span>
        </div>
      </div>

      {/* Card 5: Honorer / THL / Non-ASN */}
      <div 
        id="card-honor-employees"
        onClick={() => { onSelectStatusFilter('HONOR'); onSelectCategoryFilter('ALL'); }}
        className={`bg-white p-3.5 rounded-xl shadow-xs border transition-all cursor-pointer hover:shadow-md ${
          activeFilterStatus === 'HONOR' || activeFilterStatus === 'Honorer Daerah' || activeFilterStatus === 'THL'
            ? 'border-amber-500 ring-2 ring-amber-100 bg-amber-50/20'
            : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-amber-700 font-bold uppercase tracking-wider">
            Honor / THL
          </p>
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <p className="text-xl font-bold text-amber-900">{honorCount}</p>
          <span className="text-[11px] text-amber-600 font-medium">
            ({Math.round((honorCount / (total || 1)) * 100)}%)
          </span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
          <span>Kontrak & THL</span>
          <span className="font-semibold text-amber-700">Non-ASN</span>
        </div>
      </div>

      {/* Card 6: Tenaga Kesehatan (Nakes) */}
      <div 
        id="card-nakes-employees"
        onClick={() => { onSelectCategoryFilter('Nakes'); onSelectStatusFilter('ALL'); }}
        className={`bg-white p-3.5 rounded-xl shadow-xs border transition-all cursor-pointer hover:shadow-md ${
          activeFilterCategory === 'Nakes'
            ? 'border-indigo-500 ring-2 ring-indigo-100 bg-indigo-50/20'
            : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-indigo-700 font-bold uppercase tracking-wider">
            Tenaga Medis
          </p>
          <div className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Stethoscope className="w-3.5 h-3.5" />
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <p className="text-xl font-bold text-indigo-900">{nakesCount}</p>
          <span className="text-[11px] text-indigo-600 font-medium">
            ({Math.round((nakesCount / (total || 1)) * 100)}%)
          </span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
          <span>Non-Nakes: {nonNakesCount}</span>
          <span className="font-semibold text-indigo-700">Nakes</span>
        </div>
      </div>

      {/* Card 7: Status Legalitas STR/SIP */}
      <div 
        id="card-str-warning"
        onClick={onOpenMonitoring}
        className={`bg-white p-3.5 rounded-xl shadow-xs border transition-all cursor-pointer hover:shadow-md ${
          expiringCredentials.length > 0
            ? 'border-orange-300 ring-1 ring-orange-200 bg-orange-50/20'
            : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            STR / SIP
          </p>
          <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
            expiringCredentials.length > 0 ? 'bg-orange-100 text-orange-600' : 'bg-emerald-50 text-emerald-600'
          }`}>
            {expiringCredentials.length > 0 ? (
              <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
            ) : (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            )}
          </div>
        </div>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <p className={`text-xl font-bold ${expiringCredentials.length > 0 ? 'text-orange-600' : 'text-slate-800'}`}>
            {expiringCredentials.length}
          </p>
          <span className="text-[11px] text-slate-500">
            {expiringCredentials.length > 0 ? 'Warning' : 'Aktif'}
          </span>
        </div>
        <div className="mt-2 text-[10px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-1.5">
          <span className="text-orange-700 font-medium">Monitoring &rarr;</span>
          <span className="font-semibold text-slate-600">Legalitas</span>
        </div>
      </div>
    </div>
  );
};
