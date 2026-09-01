import React, { useState, useMemo } from 'react';
import { 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Search, 
  Filter, 
  Edit3, 
  Printer, 
  Download, 
  Building2, 
  Users, 
  BarChart3, 
  Layers, 
  Calendar,
  Sparkles,
  Info,
  RotateCcw,
  ArrowUpRight,
  TrendingUp,
  Activity,
  CheckCircle,
  AlertCircle,
  Lock
} from 'lucide-react';
import { SPMIndicator, SPMCategory, SPMStatus } from '../types/spm';
import { PuskesmasInfo, Employee } from '../types/employee';
import { calculateSPMSummary } from '../data/initialSPMData';

interface SPMViewProps {
  indicators: SPMIndicator[];
  puskesmasInfo: PuskesmasInfo;
  employees: Employee[];
  isAdmin?: boolean;
  onEditIndicator: (indicator: SPMIndicator) => void;
  onOpenPrintModal: () => void;
  onResetDefaultData: () => void;
}

export const SPMView: React.FC<SPMViewProps> = ({
  indicators,
  puskesmasInfo,
  employees,
  isAdmin = false,
  onEditIndicator,
  onOpenPrintModal,
  onResetDefaultData,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'matrix' | 'analytics'>('cards');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState<string>('ALL');

  const summary = useMemo(() => calculateSPMSummary(indicators), [indicators]);

  const filteredIndicators = useMemo(() => {
    return indicators.filter((item) => {
      // Search
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.shortTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.picEmployeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.number.toString().includes(searchQuery);

      // Category
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;

      // Status
      const matchesStatus = selectedStatus === 'ALL' || item.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [indicators, searchQuery, selectedCategory, selectedStatus]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = [
      'No',
      'Indikator SPM',
      'Kategori',
      'Target Sasaran Riil',
      'Realisasi Terlayani',
      'Target Standar (%)',
      'Capaian (%)',
      'Status',
      'Penanggung Jawab',
      'Jabatan PIC',
      'Desa Kringa Target',
      'Desa Kringa Capaian',
      'Desa Timutawa Target',
      'Desa Timutawa Capaian',
      'Desa Hikong Target',
      'Desa Hikong Capaian',
      'Desa Udekduen Target',
      'Desa Udekduen Capaian',
      'Desa Ojang Target',
      'Desa Ojang Capaian'
    ];

    const rows = indicators.map((ind) => {
      const v = ind.villageBreakdown;
      const getV = (idx: number) => v[idx] || { targetCount: 0, achievedCount: 0 };
      return [
        ind.number,
        `"${ind.name.replace(/"/g, '""')}"`,
        `"${ind.category}"`,
        ind.targetPopulation,
        ind.achievedCount,
        '100%',
        `${ind.percentage}%`,
        ind.status,
        `"${ind.picEmployeeName}"`,
        `"${ind.picPosition}"`,
        getV(0).targetCount,
        getV(0).achievedCount,
        getV(1).targetCount,
        getV(1).achievedCount,
        getV(2).targetCount,
        getV(2).achievedCount,
        getV(3).targetCount,
        getV(3).achievedCount,
        getV(4).targetCount,
        getV(4).achievedCount,
      ];
    });

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `12_SPM_Kesehatan_Puskesmas_Boganatar_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories: SPMCategory[] = [
    'Kesehatan Ibu & Anak (KIA)',
    'Anak Usia Pendidikan & Remaja',
    'Usia Produktif & Lansia',
    'Penyakit Tidak Menular (PTM)',
    'Kesehatan Jiwa',
    'Penyakit Menular (TB & HIV)'
  ];

  return (
    <div className="space-y-6">
      {/* 1. HERO BANNER */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-semibold">
              <Target className="w-3.5 h-3.5 text-blue-400" />
              <span>Standar Pelayanan Minimal (SPM) Bidang Kesehatan &bull; Permenkes No. 4/2019</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Monitoring 12 Standar Pelayanan Minimal (SPM)
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Cakupan pelayanan kesehatan primer esensial bagi seluruh warga di 5 Desa Binaan UPT Puskesmas Boganatar (Kecamatan Talibura, Kabupaten Sikka) dengan target standar pelayanan 100%.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={onOpenPrintModal}
              className="px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-blue-500/25 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Laporan 12 SPM</span>
            </button>
            <button
              onClick={handleExportCSV}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Ekspor CSV</span>
            </button>
            <button
              onClick={onResetDefaultData}
              title="Reset ke Data Simulasi Standar"
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl border border-slate-700 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. STATS & KPI SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Indicators */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Indikator SPM</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">12</span>
            <span className="text-xs text-slate-500 font-medium">Program Wajib</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">100% Sesuai Permenkes 4/2019</p>
        </div>

        {/* Average Score */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Rata-Rata Capaian</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-emerald-600">{summary.averagePercentage}%</span>
            <span className="text-xs text-slate-500 font-medium">/ 100%</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-1.5 rounded-full" 
              style={{ width: `${Math.min(100, summary.averagePercentage)}%` }} 
            />
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Distribusi Status</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5 flex-wrap">
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold text-xs">
              {summary.achievedCount} Tercapai
            </span>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-bold text-xs">
              {summary.onTrackCount} On Track
            </span>
            {summary.attentionCount > 0 && (
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-bold text-xs">
                {summary.attentionCount} Perhatian
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Evaluasi Rutin Bulanan</p>
        </div>

        {/* Total Population Served */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Warga Terlayani</span>
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">
              {summary.totalAchievedAll.toLocaleString('id-ID')}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              / {summary.totalTargetAll.toLocaleString('id-ID')}
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Akumulasi Seluruh Sasaran</p>
        </div>
      </div>

      {/* 3. FILTER & VIEW SELECTOR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* View Mode Tabs */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab('cards')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'cards'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Kartu Indikator (12 SPM)</span>
            </button>

            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'matrix'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Matriks Capaian 5 Desa</span>
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Grafik Capaian & Triwulan</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari indikator, nama PJ..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="font-semibold text-slate-500 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            <span>Kategori:</span>
          </span>
          <button
            onClick={() => setSelectedCategory('ALL')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
              selectedCategory === 'ALL'
                ? 'bg-slate-900 text-white font-bold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua Kategori
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 4. MAIN CONTENT TABS */}
      {activeTab === 'cards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredIndicators.map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-black text-xs">
                      #{item.number}
                    </span>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                        {item.category}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug">
                        {item.shortTitle}
                      </h3>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${
                    item.status === 'Tercapai'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'On Track'
                      ? 'bg-blue-100 text-blue-800'
                      : item.status === 'Perhatian'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {item.status}
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-2">
                  {item.standardDescription}
                </p>

                {/* Progress Bar & Numerical Metrics */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-2 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-600 font-medium">
                      Sasaran: <strong className="text-slate-900 font-bold">{item.targetPopulation.toLocaleString('id-ID')} {item.unitMeasure}</strong>
                    </span>
                    <span className="text-slate-900 font-black">
                      {item.percentage}% <span className="text-slate-400 font-normal">/ 100%</span>
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        item.percentage >= 100 
                          ? 'bg-emerald-500' 
                          : item.percentage >= 80 
                          ? 'bg-blue-600' 
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, item.percentage)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                    <span>Realisasi: <strong className="text-slate-800 font-semibold">{item.achievedCount.toLocaleString('id-ID')}</strong> terlayani</span>
                    <span>Target Nasional: 100%</span>
                  </div>
                </div>

                {/* Village Breakdown Preview */}
                <div className="space-y-1 mb-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Capaian per 5 Desa:
                  </span>
                  <div className="grid grid-cols-5 gap-1 text-center">
                    {item.villageBreakdown.map((vb) => (
                      <div key={vb.villageId} className="bg-slate-100/70 p-1.5 rounded-lg border border-slate-200">
                        <div className="text-[9px] font-semibold text-slate-600 truncate">{vb.villageName.replace('Desa ', '')}</div>
                        <div className={`text-[10px] font-black ${
                          vb.percentage >= 100 ? 'text-emerald-700' : vb.percentage >= 80 ? 'text-blue-700' : 'text-amber-700'
                        }`}>
                          {vb.percentage}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Key Activities */}
                {item.keyActivities && item.keyActivities.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Inovasi & Kegiatan Unggulan:
                    </span>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {item.keyActivities.slice(0, 2).map((act, i) => (
                        <li key={i} className="flex items-start gap-1.5 line-clamp-1">
                          <span className="text-blue-500 mt-0.5">&bull;</span>
                          <span className="text-[11px]">{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer: PIC & Edit Button */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <div className="text-[11px] truncate">
                  <span className="text-slate-400">PJ: </span>
                  <strong className="text-slate-800 font-semibold">{item.picEmployeeName}</strong>
                </div>
                <button
                  onClick={() => onEditIndicator(item)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer flex-shrink-0 ${
                    isAdmin 
                      ? 'bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700' 
                      : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                  title={isAdmin ? "Update Data SPM" : "Hanya Admin yang dapat mengupdate SPM (Klik untuk Login)"}
                >
                  {isAdmin ? <Edit3 className="w-3.5 h-3.5" /> : <Lock className="w-3 h-3 text-amber-700" />}
                  <span>{isAdmin ? 'Update Data' : 'Update (Admin)'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MATRIX TABLE VIEW */}
      {activeTab === 'matrix' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-blue-600" />
              <span>Matriks Lengkap Capaian 12 SPM Berdasarkan 5 Desa Binaan</span>
            </h3>
            <span className="text-xs text-slate-500">
              Desa Kringa, Timutawa, Hikong, Udek Duen, Ojang
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-3 w-10 text-center">No</th>
                  <th className="p-3 min-w-[220px]">Indikator Standar Pelayanan Minimal</th>
                  <th className="p-3 text-center min-w-[100px]">Desa Kringa</th>
                  <th className="p-3 text-center min-w-[100px]">Desa Timutawa</th>
                  <th className="p-3 text-center min-w-[100px]">Desa Hikong</th>
                  <th className="p-3 text-center min-w-[100px]">Desa Udek Duen</th>
                  <th className="p-3 text-center min-w-[100px]">Desa Ojang</th>
                  <th className="p-3 text-center bg-blue-50 text-blue-900 min-w-[120px]">Total Puskesmas</th>
                  <th className="p-3 text-center min-w-[80px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredIndicators.map((ind) => (
                  <tr key={ind.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 text-center font-bold text-slate-500">
                      {ind.number}
                    </td>
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{ind.shortTitle}</div>
                      <div className="text-[11px] text-slate-500">PJ: {ind.picEmployeeName}</div>
                    </td>
                    {ind.villageBreakdown.map((vb) => (
                      <td key={vb.villageId} className="p-3 text-center">
                        <div className="font-bold text-slate-800">{vb.percentage}%</div>
                        <div className="text-[10px] text-slate-500">
                          {vb.achievedCount} / {vb.targetCount}
                        </div>
                      </td>
                    ))}
                    <td className="p-3 text-center bg-blue-50/50">
                      <div className="font-black text-sm text-blue-700">{ind.percentage}%</div>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        ind.percentage >= 100 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {ind.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onEditIndicator(ind)}
                        className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                          isAdmin 
                            ? 'text-slate-500 hover:text-blue-600 hover:bg-slate-200' 
                            : 'text-amber-700 hover:bg-amber-100'
                        }`}
                        title={isAdmin ? "Edit Capaian SPM" : "Hanya Admin yang dapat mengedit (Klik untuk Login)"}
                      >
                        {isAdmin ? <Edit3 className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5" />}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ANALYTICS & TRIWULAN VIEW */}
      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Bars for All 12 Indicators */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-600" />
                <span>Peringkat Capaian 12 Indikator SPM vs Standar 100%</span>
              </h3>
              <span className="text-xs text-emerald-600 font-bold">Target Standar: 100%</span>
            </div>

            <div className="space-y-3.5">
              {indicators.map((ind) => (
                <div key={ind.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800 truncate max-w-[280px] sm:max-w-md">
                      #{ind.number}. {ind.shortTitle}
                    </span>
                    <span className="font-black text-slate-900 ml-2">{ind.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className={`h-2.5 rounded-full transition-all duration-300 ${
                        ind.percentage >= 100 
                          ? 'bg-emerald-500' 
                          : ind.percentage >= 80 
                          ? 'bg-blue-600' 
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${Math.min(100, ind.percentage)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Triwulan Progress Overview & Inovasi */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span>Strategi Pencapaian 100%</span>
              </h3>
              
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl space-y-1">
                  <strong className="text-blue-900 block font-bold">1. Integrasi Layanan Primer (ILP)</strong>
                  <p className="text-blue-800 leading-relaxed text-[11px]">
                    Pelayanan kesehatan terstandar berbasis siklus hidup dari tingkat Puskesmas, 5 Pustu, dan 16 Posyandu Aktif.
                  </p>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                  <strong className="text-emerald-900 block font-bold">2. Kunjungan Rumah PIS-PK & Perkesmas</strong>
                  <p className="text-emerald-800 leading-relaxed text-[11px]">
                    Sweeping jemput bola bagi bumil risti, balita belum imunisasi, penderita hipertensi/DM, dan home care ODGJ berat.
                  </p>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-1">
                  <strong className="text-purple-900 block font-bold">3. Inovasi & Kemitraan Lintas Sektor</strong>
                  <p className="text-purple-800 leading-relaxed text-[11px]">
                    Kolaborasi rutin dengan Kepala Desa, Tokoh Adat, Kader Posyandu, dan Pastor/Tokoh Agama di Talibura.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 text-white p-5 rounded-2xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-400">
                Landasan Regulasi SPM
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Standar Pelayanan Minimal (SPM) Kesehatan merupakan ketentuan mengenai jenis dan mutu pelayanan dasar yang berhak diperoleh setiap warga negara secara minimal.
              </p>
              <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                Permenkes RI No. 4 Tahun 2019 tentang Standar Teknis Pemenuhan Mutu Pelayanan Dasar pada Standar Pelayanan Minimal Bidang Kesehatan.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
