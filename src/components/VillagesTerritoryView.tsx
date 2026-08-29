import React from 'react';
import { 
  MapPin, 
  Users, 
  Baby, 
  ShieldCheck, 
  Edit, 
  Printer, 
  Phone, 
  User, 
  Activity, 
  RotateCcw, 
  Building2, 
  HeartHandshake,
  Lock,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { PuskesmasProfileData, VillageTerritory } from '../types/profileTerritory';
import { PuskesmasInfo } from '../types/employee';

interface VillagesTerritoryViewProps {
  profileData: PuskesmasProfileData;
  puskesmasInfo: PuskesmasInfo;
  isAdmin?: boolean;
  onOpenEditVillage: (village: VillageTerritory) => void;
  onOpenPrintModal: () => void;
  onNavigateToPosyandu?: () => void;
  onResetDefaultData: () => void;
}

export const VillagesTerritoryView: React.FC<VillagesTerritoryViewProps> = ({
  profileData,
  puskesmasInfo,
  isAdmin = false,
  onOpenEditVillage,
  onOpenPrintModal,
  onNavigateToPosyandu,
  onResetDefaultData
}) => {
  // Aggregations
  const totalArea = profileData.villages.reduce((acc, v) => acc + v.areaKm2, 0);
  const totalKK = profileData.villages.reduce((acc, v) => acc + v.population.familyCount, 0);
  const totalMale = profileData.villages.reduce((acc, v) => acc + v.population.maleCount, 0);
  const totalFemale = profileData.villages.reduce((acc, v) => acc + v.population.femaleCount, 0);
  const totalJiwa = profileData.villages.reduce((acc, v) => acc + v.population.totalPopulation, 0);
  const totalBalita = profileData.villages.reduce((acc, v) => acc + v.population.toddlerCount, 0);
  const totalBumil = profileData.villages.reduce((acc, v) => acc + v.population.pregnantMotherCount, 0);
  const totalLansia = profileData.villages.reduce((acc, v) => acc + v.population.elderlyCount, 0);
  const totalBPJS = profileData.villages.reduce((acc, v) => acc + v.population.bpjsCoveredCount, 0);
  const bpjsPercentage = totalJiwa > 0 ? ((totalBPJS / totalJiwa) * 100).toFixed(1) : '0';

  const totalPosyanduCount = profileData.villages.reduce((acc, v) => acc + v.posyanduList.length, 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Actions Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-teal-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-teal-500/20 border border-teal-400/30 rounded-full text-teal-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" />
              <span>Wilayah Kerja 5 Desa Binaan &bull; UPT Puskesmas Boganatar</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Data Wilayah 5 Desa Binaan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kecamatan Talibura, Kabupaten Sikka &bull; Pemetaan Demografi, Sasaran Kesehatan Masyarakat, Luas Wilayah & Tenaga Pembina Desa.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {onNavigateToPosyandu && (
              <button
                onClick={onNavigateToPosyandu}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <HeartHandshake className="w-4 h-4 text-pink-400" />
                <span>Buka Modul Posyandu ({totalPosyanduCount})</span>
              </button>
            )}

            <button
              id="btn-print-5desa-view"
              onClick={onOpenPrintModal}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Data 5 Desa</span>
            </button>
          </div>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Total Penduduk</span>
            <Users className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-lg font-black text-slate-900">
            {totalJiwa.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            L: {totalMale.toLocaleString('id-ID')} | P: {totalFemale.toLocaleString('id-ID')}
          </div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Kepala Keluarga</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-lg font-black text-slate-900">
            {totalKK.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Di 5 Desa Binaan
          </div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Sasaran Balita</span>
            <Baby className="w-4 h-4 text-pink-600" />
          </div>
          <div className="text-lg font-black text-slate-900">
            {totalBalita.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Usia 0 - 5 Tahun
          </div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Ibu Hamil</span>
            <Activity className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-lg font-black text-slate-900">
            {totalBumil}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Sasaran ANC Rutin
          </div>
        </div>

        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Sasaran Lansia</span>
            <Users className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-lg font-black text-slate-900">
            {totalLansia.toLocaleString('id-ID')}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">
            Usia &ge; 60 Tahun
          </div>
        </div>

        <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-emerald-800 mb-1">
            <span className="text-[11px] font-bold">Cakupan BPJS</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-lg font-black text-emerald-950">
            {bpjsPercentage}%
          </div>
          <div className="text-[10px] text-emerald-700 mt-0.5 font-medium">
            {totalBPJS.toLocaleString('id-ID')} Jiwa Terdaftar
          </div>
        </div>
      </div>

      {/* Main Matriks Table for 5 Desa */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Matriks Demografi & Wilayah 5 Desa Binaan</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rincian kependudukan, sasaran pelayanan kesehatan, luas wilayah, dan fasilitas Pustu/Poskesdes
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-teal-100 text-teal-800 rounded-lg self-start sm:self-auto">
            Total Wilayah: {totalArea.toFixed(2)} km²
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="bg-slate-100/80 text-slate-700 border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold">
                <th className="py-3 px-3.5 w-10 text-center">No</th>
                <th className="py-3 px-3.5 min-w-[150px]">Nama Desa</th>
                <th className="py-3 px-3 text-center">Jumlah KK</th>
                <th className="py-3 px-3 text-center">Laki-Laki</th>
                <th className="py-3 px-3 text-center">Perempuan</th>
                <th className="py-3 px-3.5 text-center font-black text-slate-900 bg-slate-200/50">Total Jiwa</th>
                <th className="py-3 px-3 text-center text-pink-700">Balita</th>
                <th className="py-3 px-3 text-center text-rose-700">Bumil</th>
                <th className="py-3 px-3 text-center text-amber-700">Lansia</th>
                <th className="py-3 px-3 text-center text-emerald-800">BPJS (%)</th>
                <th className="py-3 px-3.5 min-w-[140px]">Pustu / Poskesdes & PJ</th>
                <th className="py-3 px-3.5 text-center w-20">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {profileData.villages.map((v, idx) => {
                const pct = v.population.totalPopulation > 0 
                  ? ((v.population.bpjsCoveredCount / v.population.totalPopulation) * 100).toFixed(1)
                  : '0';

                return (
                  <tr key={v.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3.5 text-center font-bold text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-bold text-slate-900 text-xs">{v.name}</div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <span>Kades: {v.headOfVillage}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {v.areaKm2} km² &bull; {v.distanceToPuskesmasKm} km ({v.travelTimeMinutes} mnt)
                      </div>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-800">
                      {v.population.familyCount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600">
                      {v.population.maleCount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600">
                      {v.population.femaleCount.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3.5 text-center font-black text-slate-900 bg-slate-50 text-xs">
                      {v.population.totalPopulation.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-pink-700">
                      {v.population.toddlerCount}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-rose-700">
                      {v.population.pregnantMotherCount}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-amber-700">
                      {v.population.elderlyCount}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-emerald-700">
                      {pct}%
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="font-semibold text-slate-800 text-[11px]">{v.pustuPoskesdes}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">PJ: {v.pustuStaff}</div>
                    </td>
                    <td className="py-3 px-3.5 text-center">
                      <button
                        onClick={() => onOpenEditVillage(v)}
                        className={`p-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                          isAdmin 
                            ? 'text-teal-700 hover:text-teal-900 hover:bg-teal-50' 
                            : 'text-amber-700 hover:text-amber-900 hover:bg-amber-50'
                        }`}
                        title={isAdmin ? `Edit data ${v.name}` : `Hanya Admin yang dapat mengedit (Klik untuk Login)`}
                      >
                        {isAdmin ? <Edit className="w-4 h-4 mx-auto" /> : <Lock className="w-3.5 h-3.5 mx-auto text-amber-500" />}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold text-slate-900 text-xs border-t-2 border-slate-300">
                <td colSpan={2} className="py-3 px-3.5 text-right uppercase tracking-wide">
                  Total 5 Desa:
                </td>
                <td className="py-3 px-3 text-center">{totalKK.toLocaleString('id-ID')}</td>
                <td className="py-3 px-3 text-center">{totalMale.toLocaleString('id-ID')}</td>
                <td className="py-3 px-3 text-center">{totalFemale.toLocaleString('id-ID')}</td>
                <td className="py-3 px-3.5 text-center text-teal-800 bg-teal-50/60 font-black">{totalJiwa.toLocaleString('id-ID')}</td>
                <td className="py-3 px-3 text-center text-pink-800">{totalBalita}</td>
                <td className="py-3 px-3 text-center text-rose-800">{totalBumil}</td>
                <td className="py-3 px-3 text-center text-amber-800">{totalLansia}</td>
                <td className="py-3 px-3 text-center text-emerald-800">{bpjsPercentage}%</td>
                <td colSpan={2} className="py-3 px-3.5 text-slate-500 text-[11px]">
                  5 Pustu / Poskesdes Terdaftar
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Village Cards Detailed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profileData.villages.map((v) => (
          <div key={v.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 transition-all flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-base font-bold text-slate-900">{v.name}</h4>
                  <p className="text-xs text-slate-500">Kec. Talibura, Kab. Sikka</p>
                </div>
                <span className="px-2 py-0.5 bg-teal-50 text-teal-700 text-[10px] font-bold rounded-md border border-teal-200">
                  {v.geographicType}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5 border border-slate-100">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Kepala Desa:</span>
                  <strong className="text-slate-800">{v.headOfVillage}</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Pustu / Poskesdes:</span>
                  <span className="text-slate-800 font-medium">{v.pustuPoskesdes}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Penanggung Jawab:</span>
                  <span className="text-teal-700 font-semibold">{v.pustuStaff}</span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">Posyandu di Desa:</span>
                  <span className="px-2 py-0.5 bg-pink-100 text-pink-800 font-bold rounded text-[11px]">
                    {v.posyanduList.length} Posyandu
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Jarak: {v.distanceToPuskesmasKm} km ({v.travelTimeMinutes} mnt)
              </span>
              <button
                onClick={() => onOpenEditVillage(v)}
                className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Data Desa</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reset Data Standar (Khusus Admin) */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>Data wilayah 5 desa tersimpan aman di sistem dan disinkronkan secara cloud.</span>
        {isAdmin && (
          <button
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin mengembalikan Data Wilayah 5 Desa ke setelan awal Puskesmas Boganatar?')) {
                onResetDefaultData();
              }
            }}
            className="text-slate-500 hover:text-red-600 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Desa ke Standar</span>
          </button>
        )}
      </div>
    </div>
  );
};
