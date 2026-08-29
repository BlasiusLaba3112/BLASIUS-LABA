import React, { useState } from 'react';
import { 
  Building2, 
  Target, 
  HeartHandshake, 
  MapPin, 
  Users, 
  Baby, 
  ShieldCheck, 
  Edit, 
  Plus, 
  Trash2, 
  Printer, 
  Sparkles, 
  Clock, 
  Calendar, 
  Phone, 
  User, 
  CheckCircle2, 
  Search,
  Filter,
  Activity,
  RotateCcw
} from 'lucide-react';
import { PuskesmasProfileData, VillageTerritory, PosyanduInfo } from '../types/profileTerritory';
import { PuskesmasInfo } from '../types/employee';

interface ProfileTerritoryViewProps {
  profileData: PuskesmasProfileData;
  puskesmasInfo: PuskesmasInfo;
  onUpdateProfileData: (data: PuskesmasProfileData) => void;
  onOpenEditProfile: () => void;
  onOpenEditVillage: (village: VillageTerritory) => void;
  onOpenAddPosyandu: (villageId?: string) => void;
  onOpenEditPosyandu: (villageId: string, posyandu: PosyanduInfo) => void;
  onDeletePosyandu: (villageId: string, posyanduId: string) => void;
  onOpenPrintModal: () => void;
  onResetDefaultData: () => void;
}

export const ProfileTerritoryView: React.FC<ProfileTerritoryViewProps> = ({
  profileData,
  puskesmasInfo,
  onOpenEditProfile,
  onOpenEditVillage,
  onOpenAddPosyandu,
  onOpenEditPosyandu,
  onDeletePosyandu,
  onOpenPrintModal,
  onResetDefaultData
}) => {
  const [activeTab, setActiveTab] = useState<'visi_misi' | 'wilayah_desa' | 'posyandu'>('wilayah_desa');
  const [selectedVillageFilter, setSelectedVillageFilter] = useState<string>('ALL');
  const [posyanduCategoryFilter, setPosyanduCategoryFilter] = useState<string>('ALL');
  const [searchPosyandu, setSearchPosyandu] = useState<string>('');

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

  const allPosyanduWithVillage = profileData.villages.flatMap((v) => 
    v.posyanduList.map((p) => ({ ...p, villageId: v.id, villageName: v.name }))
  );

  const filteredPosyandu = allPosyanduWithVillage.filter((p) => {
    const matchVillage = selectedVillageFilter === 'ALL' || p.villageId === selectedVillageFilter;
    const matchCategory = posyanduCategoryFilter === 'ALL' || p.category === posyanduCategoryFilter;
    const matchSearch = 
      p.name.toLowerCase().includes(searchPosyandu.toLowerCase()) ||
      p.dusun.toLowerCase().includes(searchPosyandu.toLowerCase()) ||
      p.headOfPosyandu.toLowerCase().includes(searchPosyandu.toLowerCase()) ||
      p.villageName.toLowerCase().includes(searchPosyandu.toLowerCase());
    return matchVillage && matchCategory && matchSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Action Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Profil Wilayah Kerja 5 Desa &bull; UPT Puskesmas Boganatar</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Profil, Visi Misi & Wilayah Kerja 5 Desa
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Kecamatan Talibura, Kabupaten Sikka &bull; Fasilitas Pelayanan Kesehatan Primer untuk 5 Desa Binaan dengan 16 Posyandu Aktif.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-open-edit-profile"
              onClick={onOpenEditProfile}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Edit className="w-4 h-4 text-blue-400" />
              <span>Edit Visi & Misi</span>
            </button>

            <button
              id="btn-open-print-profile-view"
              onClick={onOpenPrintModal}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Profil & 5 Desa</span>
            </button>

            <button
              id="btn-add-posyandu-main"
              onClick={() => onOpenAddPosyandu()}
              className="px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Posyandu</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs inside Header */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('wilayah_desa')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'wilayah_desa'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Wilayah 5 Desa & Kependudukan</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-blue-900 text-blue-200 rounded-full">
              {profileData.villages.length} Desa
            </span>
          </button>

          <button
            onClick={() => setActiveTab('posyandu')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'posyandu'
                ? 'bg-pink-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Daftar Posyandu 5 Desa</span>
            <span className="px-1.5 py-0.2 text-[10px] bg-pink-900 text-pink-200 rounded-full">
              {allPosyanduWithVillage.length} Posyandu
            </span>
          </button>

          <button
            onClick={() => setActiveTab('visi_misi')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'visi_misi'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Visi, Misi & Tata Nilai</span>
          </button>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-[11px] font-semibold">Total Penduduk</span>
            <Users className="w-4 h-4 text-blue-600" />
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
          <div className="flex items-center justify-between text-emerald-800 mb-1">
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

      {/* TAB 1: WILAYAH KERJA 5 DESA & KEPENDUDUKAN */}
      {activeTab === 'wilayah_desa' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Table Matriks 5 Desa */}
          <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
            <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Matriks Data Wilayah Kerja & Kependudukan 5 Desa Binaan</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Klik tombol <strong>Edit</strong> pada desa untuk memperbarui jumlah KK, penduduk, balita, bumil, atau data posyandu.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onOpenPrintModal}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Cetak Matriks</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-100/80 text-slate-700 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-3 py-3 w-10 text-center">No</th>
                    <th className="px-3 py-3">Nama Desa & Kades</th>
                    <th className="px-3 py-3 text-center">Luas (km²)</th>
                    <th className="px-3 py-3 text-center">Jarak ke Puskesmas</th>
                    <th className="px-3 py-3 text-center">Jumlah KK</th>
                    <th className="px-3 py-3 text-center">Total Penduduk (L / P)</th>
                    <th className="px-3 py-3 text-center">Balita</th>
                    <th className="px-3 py-3 text-center">Bumil</th>
                    <th className="px-3 py-3 text-center">Lansia</th>
                    <th className="px-3 py-3 text-center">Posyandu</th>
                    <th className="px-3 py-3 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {profileData.villages.map((village, idx) => (
                    <tr key={village.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-3 py-3 text-center font-bold text-slate-500">{idx + 1}</td>
                      <td className="px-3 py-3">
                        <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                          <span>{village.name}</span>
                          <span className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-normal">
                            {village.geographicType}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          Kades: <strong className="text-slate-700">{village.headOfVillage}</strong> &bull; {village.pustuPoskesdes}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-mono text-slate-700">
                        {village.areaKm2}
                      </td>
                      <td className="px-3 py-3 text-center text-slate-700">
                        <span className="font-bold text-blue-700">{village.distanceToPuskesmasKm} km</span>
                        <span className="text-[10px] text-slate-400 block">({village.travelTimeMinutes} menit)</span>
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-slate-800">
                        {village.population.familyCount.toLocaleString('id-ID')}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <div className="font-black text-slate-900">
                          {village.population.totalPopulation.toLocaleString('id-ID')} Jiwa
                        </div>
                        <div className="text-[10px] text-slate-500">
                          L: {village.population.maleCount} | P: {village.population.femaleCount}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-pink-700">
                        {village.population.toddlerCount}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-rose-700">
                        {village.population.pregnantMotherCount}
                      </td>
                      <td className="px-3 py-3 text-center font-bold text-amber-700">
                        {village.population.elderlyCount}
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-pink-50 text-pink-700 border border-pink-200">
                          {village.posyanduList.length} Posyandu
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right">
                        <button
                          id={`btn-edit-village-${village.id}`}
                          onClick={() => onOpenEditVillage(village)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-100/90 font-bold text-slate-900 border-t-2 border-slate-300">
                  <tr>
                    <td colSpan={2} className="px-3 py-3 text-center uppercase tracking-wider text-[11px]">
                      TOTAL 5 DESA
                    </td>
                    <td className="px-3 py-3 text-center font-mono">{totalArea.toFixed(2)} km²</td>
                    <td className="px-3 py-3 text-center text-slate-500">-</td>
                    <td className="px-3 py-3 text-center">{totalKK.toLocaleString('id-ID')} KK</td>
                    <td className="px-3 py-3 text-center text-blue-900 font-black">
                      {totalJiwa.toLocaleString('id-ID')} Jiwa
                    </td>
                    <td className="px-3 py-3 text-center text-pink-800">{totalBalita}</td>
                    <td className="px-3 py-3 text-center text-rose-800">{totalBumil}</td>
                    <td className="px-3 py-3 text-center text-amber-800">{totalLansia}</td>
                    <td className="px-3 py-3 text-center text-pink-900 font-black">{allPosyanduWithVillage.length} Posyandu</td>
                    <td className="px-3 py-3 text-right"></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Cards Detail 5 Desa */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profileData.villages.map((village) => (
              <div 
                key={village.id} 
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-md uppercase">
                        {village.geographicType}
                      </span>
                      <h4 className="text-base font-bold text-slate-900 mt-1">
                        {village.name}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Kades: <strong className="text-slate-800">{village.headOfVillage}</strong>
                        {village.phoneHeadOfVillage && ` (${village.phoneHeadOfVillage})`}
                      </p>
                    </div>
                    <button
                      onClick={() => onOpenEditVillage(village)}
                      className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 rounded-lg transition-colors"
                      title="Edit Data Desa"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Village Metrics */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 bg-slate-50 rounded-xl text-center">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Luas Wilayah</span>
                      <strong className="text-xs text-slate-800">{village.areaKm2} km²</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Jarak Puskesmas</span>
                      <strong className="text-xs text-blue-700">{village.distanceToPuskesmasKm} km</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Waktu Tempuh</span>
                      <strong className="text-xs text-slate-800">{village.travelTimeMinutes} Menit</strong>
                    </div>
                  </div>

                  {/* Population Substats */}
                  <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                    <div className="flex items-center justify-between">
                      <span>Total Penduduk:</span>
                      <strong className="text-slate-900">{village.population.totalPopulation.toLocaleString('id-ID')} Jiwa ({village.population.familyCount} KK)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sasaran Balita / Bayi:</span>
                      <strong className="text-pink-700">{village.population.toddlerCount} Balita ({village.population.infantCount} Bayi)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Ibu Hamil / Menyusui:</span>
                      <strong className="text-rose-700">{village.population.pregnantMotherCount} Bumil ({village.population.nursingMotherCount} Bufas)</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Lansia (&ge; 60 thn):</span>
                      <strong className="text-amber-700">{village.population.elderlyCount} Jiwa</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Peserta BPJS / KIS:</span>
                      <strong className="text-emerald-700">{village.population.bpjsCoveredCount.toLocaleString('id-ID')} Jiwa</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-blue-50/60 rounded-xl text-xs text-blue-950">
                    <span className="text-[10px] font-bold text-blue-700 uppercase block">Pos Pelayanan & Bidan Desa:</span>
                    <p className="font-semibold mt-0.5">{village.pustuPoskesdes}</p>
                    <p className="text-[11px] text-blue-800">{village.pustuStaff}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <HeartHandshake className="w-3.5 h-3.5 text-pink-600" />
                    <span>{village.posyanduList.length} Posyandu Aktif</span>
                  </span>
                  <button
                    onClick={() => {
                      setSelectedVillageFilter(village.id);
                      setActiveTab('posyandu');
                    }}
                    className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                  >
                    Lihat Posyandu &rarr;
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: DAFTAR POSYANDU 5 DESA */}
      {activeTab === 'posyandu' && (
        <div className="space-y-5 animate-in fade-in duration-200">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchPosyandu}
                  onChange={(e) => setSearchPosyandu(e.target.value)}
                  placeholder="Cari nama posyandu, dusun, atau ketua kader..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              {/* Village Filter */}
              <div className="flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedVillageFilter}
                  onChange={(e) => setSelectedVillageFilter(e.target.value)}
                  className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
                >
                  <option value="ALL">Semua 5 Desa ({allPosyanduWithVillage.length})</option>
                  {profileData.villages.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.name} ({v.posyanduList.length})
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Filter */}
              <select
                value={posyanduCategoryFilter}
                onChange={(e) => setPosyanduCategoryFilter(e.target.value)}
                className="px-2.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                <option value="ALL">Semua Jenis Posyandu</option>
                <option value="Posyandu Integrasi ILP">Posyandu Integrasi ILP</option>
                <option value="Posyandu Balita">Posyandu Balita</option>
                <option value="Posyandu Lansia">Posyandu Lansia</option>
                <option value="Posbindu PTM">Posbindu PTM</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                id="btn-add-posyandu-sub"
                onClick={() => onOpenAddPosyandu(selectedVillageFilter !== 'ALL' ? selectedVillageFilter : undefined)}
                className="px-3.5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Posyandu</span>
              </button>
            </div>
          </div>

          {/* Posyandu Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredPosyandu.length === 0 ? (
              <div className="col-span-full p-8 text-center bg-white border border-slate-200 rounded-2xl text-slate-500 space-y-2">
                <HeartHandshake className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-semibold">Tidak ditemukan Posyandu yang sesuai dengan filter.</p>
              </div>
            ) : (
              filteredPosyandu.map((pos) => (
                <div
                  key={pos.id}
                  className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs flex flex-col justify-between hover:border-pink-300 transition-all"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 text-[10px] font-bold rounded">
                            {pos.villageName}
                          </span>
                          <span className="px-2 py-0.5 bg-pink-50 text-pink-700 text-[10px] font-bold rounded">
                            {pos.category}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {pos.name}
                        </h4>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenEditPosyandu(pos.villageId, pos)}
                          className="p-1.5 bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 rounded-lg transition-colors cursor-pointer"
                          title="Edit Posyandu"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Yakin ingin menghapus ${pos.name} dari ${pos.villageName}?`)) {
                              onDeletePosyandu(pos.villageId, pos.id);
                            }
                          }}
                          className="p-1.5 bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-700 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Posyandu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                        <span>{pos.dusun} &bull; {pos.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                        <span>Ketua: <strong>{pos.headOfPosyandu}</strong></span>
                      </div>
                      {pos.phone && (
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span className="font-mono">{pos.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-blue-900 font-semibold pt-1">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                        <span>Jadwal: {pos.schedule}</span>
                      </div>
                    </div>

                    {pos.notes && (
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                        &quot;{pos.notes}&quot;
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500">Jumlah Kader Aktif:</span>
                    <span className="font-bold text-pink-700 px-2 py-0.5 bg-pink-50 rounded-md">
                      {pos.cadreCount} Orang Kader
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* TAB 3: VISI, MISI, TATA NILAI & MOTTO */}
      {activeTab === 'visi_misi' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Visi & Motto Card */}
          <div className="bg-gradient-to-br from-blue-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
            <div className="max-w-3xl space-y-4">
              <span className="px-3 py-1 bg-blue-500/30 text-blue-300 text-xs font-bold rounded-full border border-blue-400/30 inline-flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5" />
                <span>VISI UPT PUSKESMAS BOGANATAR</span>
              </span>
              <h2 className="text-lg sm:text-2xl font-black italic tracking-wide leading-relaxed text-blue-50">
                &quot;{profileData.vision}&quot;
              </h2>
              
              <div className="pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs text-slate-400 block font-semibold">MOTTO PELAYANAN:</span>
                  <span className="text-sm font-black text-emerald-400 tracking-wide">
                    &quot;{profileData.motto}&quot;
                  </span>
                </div>
                <button
                  onClick={onOpenEditProfile}
                  className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 self-start cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Ubah Visi / Motto</span>
                </button>
              </div>
            </div>
          </div>

          {/* Misi Section */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Misi UPT Puskesmas Boganatar
                  </h3>
                  <p className="text-xs text-slate-500">
                    5 Pilar Komitmen Pelayanan Kesehatan Primer
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenEditProfile}
                className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Misi</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {profileData.mission.map((item, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl flex items-start gap-3 hover:border-emerald-300 transition-colors"
                >
                  <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                    {idx + 1}
                  </span>
                  <p className="text-xs text-slate-800 leading-relaxed font-medium">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tata Nilai Section */}
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Tata Nilai Budaya Kerja: {profileData.coreValues.acronym}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {profileData.coreValues.description}
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenEditProfile}
                className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Tata Nilai</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {profileData.coreValues.points.map((pt, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 hover:border-blue-300 transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                    {pt.letter}
                  </span>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {pt.word}
                    </h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                      {pt.meaning}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Overview & Service Hours */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-2">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>Gambaran Umum Puskesmas</span>
              </h4>
              <p className="text-xs text-slate-700 leading-relaxed text-justify">
                {profileData.overview}
              </p>
            </div>

            <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Jam Pelayanan Resmi</span>
              </h4>
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 font-medium">
                {profileData.serviceHours}
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div><strong>Alamat:</strong> {puskesmasInfo.address}</div>
                <div><strong>Kontak/WA:</strong> {puskesmasInfo.phone}</div>
                <div><strong>Kepala Puskesmas:</strong> {puskesmasInfo.headOfPuskesmas.name} ({puskesmasInfo.headOfPuskesmas.rankGrade})</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reset Data Button (Bottom Right) */}
      <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>Data wilayah kerja & profil tersimpan otomatis di perangkat Anda.</span>
        <button
          onClick={() => {
            if (window.confirm('Apakah Anda yakin ingin mengembalikan seluruh Data Profil, Visi Misi, dan 5 Desa ke setelan awal Puskesmas Boganatar?')) {
              onResetDefaultData();
            }
          }}
          className="text-slate-500 hover:text-red-600 flex items-center gap-1 hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset ke Data Standar Puskesmas</span>
        </button>
      </div>
    </div>
  );
};
