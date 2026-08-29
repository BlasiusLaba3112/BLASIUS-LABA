import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Plus, 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Calendar, 
  Users, 
  Edit, 
  Trash2, 
  Printer, 
  AlertCircle, 
  Baby, 
  Activity, 
  ShieldCheck,
  Lock,
  Building2,
  Sparkles
} from 'lucide-react';
import { PuskesmasProfileData, PosyanduInfo } from '../types/profileTerritory';
import { PuskesmasInfo } from '../types/employee';

interface PosyanduViewProps {
  profileData: PuskesmasProfileData;
  puskesmasInfo: PuskesmasInfo;
  isAdmin?: boolean;
  onOpenAddPosyandu: (villageId?: string) => void;
  onOpenEditPosyandu: (villageId: string, posyandu: PosyanduInfo) => void;
  onDeletePosyandu: (villageId: string, posyanduId: string) => void;
  onOpenPrintModal: () => void;
}

export const PosyanduView: React.FC<PosyanduViewProps> = ({
  profileData,
  puskesmasInfo,
  isAdmin = false,
  onOpenAddPosyandu,
  onOpenEditPosyandu,
  onDeletePosyandu,
  onOpenPrintModal
}) => {
  const [selectedVillageFilter, setSelectedVillageFilter] = useState<string>('ALL');
  const [posyanduCategoryFilter, setPosyanduCategoryFilter] = useState<string>('ALL');
  const [searchPosyandu, setSearchPosyandu] = useState<string>('');
  
  // State for Delete Confirmation Modal (Persetujuan Ya / Tidak)
  const [posyanduToDelete, setPosyanduToDelete] = useState<{
    villageId: string;
    villageName: string;
    posyandu: PosyanduInfo;
  } | null>(null);

  // Flatten posyandu list with their village
  const allPosyanduWithVillage = profileData.villages.flatMap((v) => 
    v.posyanduList.map((p) => ({ ...p, villageId: v.id, villageName: v.name }))
  );

  // Filtered Posyandu
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

  // Calculate stats
  const totalPosyandu = allPosyanduWithVillage.length;
  const totalKader = allPosyanduWithVillage.reduce((sum, p) => sum + (p.cadreCount || 0), 0);
  const totalILP = allPosyanduWithVillage.filter(p => p.category === 'Posyandu Integrasi ILP').length;
  const totalBalita = allPosyanduWithVillage.filter(p => p.category === 'Posyandu Balita').length;
  const totalLansia = allPosyanduWithVillage.filter(p => p.category === 'Posyandu Lansia').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Action Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-pink-500/20 border border-pink-400/30 rounded-full text-pink-300 text-xs font-semibold">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Layanan Kesehatan Berbasis Masyarakat &bull; UPT Puskesmas Boganatar</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Data 16 Posyandu & Kader Wilayah
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pemantauan posyandu balita, lansia, remaja, posbindu, integrasi ILP, jadwal operasional, dan data kader.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-add-posyandu-main"
              onClick={() => onOpenAddPosyandu()}
              className={`px-3.5 py-2 border rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isAdmin 
                  ? 'bg-pink-600 hover:bg-pink-700 text-white border-pink-500' 
                  : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border-amber-800/60'
              }`}
              title={isAdmin ? "Tambah Posyandu Baru" : "Hanya Admin yang dapat menambah posyandu (Klik untuk Login)"}
            >
              {isAdmin ? <Plus className="w-4 h-4" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isAdmin ? '+ Tambah Posyandu' : 'Tambah (Khusus Admin)'}</span>
            </button>

            <button
              id="btn-print-posyandu-main"
              onClick={onOpenPrintModal}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4 text-pink-400" />
              <span>Cetak Rekap Wilayah</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-pink-600">
            <span className="text-xs font-semibold text-slate-600">Total Posyandu</span>
            <HeartHandshake className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            {totalPosyandu} <span className="text-xs font-medium text-slate-500">Unit</span>
          </p>
          <span className="text-[10px] text-slate-500">Tersebar di 5 Desa</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-blue-600">
            <span className="text-xs font-semibold text-slate-600">Total Kader</span>
            <Users className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-blue-700 mt-1">
            {totalKader} <span className="text-xs font-medium text-slate-500">Orang</span>
          </p>
          <span className="text-[10px] text-blue-600">Kader Aktif Posyandu</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-600">
            <span className="text-xs font-semibold text-slate-600">Integrasi ILP</span>
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-emerald-700 mt-1">
            {totalILP} <span className="text-xs font-medium text-slate-500">Unit</span>
          </p>
          <span className="text-[10px] text-emerald-600">Siklus Hidup Terintegrasi</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-amber-600">
            <span className="text-xs font-semibold text-slate-600">Balita & Lansia</span>
            <Baby className="w-4 h-4" />
          </div>
          <p className="text-xl sm:text-2xl font-black text-amber-700 mt-1">
            {totalBalita + totalLansia} <span className="text-xs font-medium text-slate-500">Unit</span>
          </p>
          <span className="text-[10px] text-amber-700">{totalBalita} Balita &bull; {totalLansia} Lansia</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchPosyandu}
              onChange={(e) => setSearchPosyandu(e.target.value)}
              placeholder="Cari posyandu berdasarkan nama, dusun, ketua kader, atau desa..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all"
            />
            {searchPosyandu && (
              <button 
                onClick={() => setSearchPosyandu('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                &times;
              </button>
            )}
          </div>

          {/* Filters Group */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Desa Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedVillageFilter}
                onChange={(e) => setSelectedVillageFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Desa (5 Desa)</option>
                {profileData.villages.map((v) => (
                  <option key={v.id} value={v.id}>{v.name}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-200 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={posyanduCategoryFilter}
                onChange={(e) => setPosyanduCategoryFilter(e.target.value)}
                className="bg-transparent font-medium text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="ALL">Semua Kategori</option>
                <option value="Posyandu Integrasi ILP">Posyandu Integrasi ILP</option>
                <option value="Posyandu Balita">Posyandu Balita</option>
                <option value="Posyandu Lansia">Posyandu Lansia</option>
                <option value="Posyandu Remaja">Posyandu Remaja</option>
                <option value="Posbindu PTM">Posbindu PTM</option>
              </select>
            </div>
          </div>
        </div>

        {/* Filter Summary */}
        <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2 border-t border-slate-100">
          <span>
            Menampilkan <strong className="text-slate-800 font-bold">{filteredPosyandu.length}</strong> dari <strong>{allPosyanduWithVillage.length}</strong> posyandu
          </span>
          {(selectedVillageFilter !== 'ALL' || posyanduCategoryFilter !== 'ALL' || searchPosyandu) && (
            <button
              onClick={() => {
                setSelectedVillageFilter('ALL');
                setPosyanduCategoryFilter('ALL');
                setSearchPosyandu('');
              }}
              className="text-pink-600 hover:text-pink-800 font-semibold cursor-pointer"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Posyandu Card Grid */}
      {filteredPosyandu.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">Tidak ada posyandu yang sesuai</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter desa dan kategori posyandu.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPosyandu.map((pos) => {
            const getCategoryBadgeClass = (cat: string) => {
              switch (cat) {
                case 'Posyandu Integrasi ILP':
                  return 'bg-emerald-50 text-emerald-700 border-emerald-200';
                case 'Posyandu Balita':
                  return 'bg-blue-50 text-blue-700 border-blue-200';
                case 'Posyandu Lansia':
                  return 'bg-amber-50 text-amber-700 border-amber-200';
                case 'Posyandu Remaja':
                  return 'bg-purple-50 text-purple-700 border-purple-200';
                default:
                  return 'bg-slate-50 text-slate-700 border-slate-200';
              }
            };

            return (
              <div 
                key={pos.id} 
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md hover:border-pink-300 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  {/* Top: Category Badge & Actions */}
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border ${getCategoryBadgeClass(pos.category)}`}>
                      {pos.category}
                    </span>

                    {/* Actions for Admin */}
                    {isAdmin && (
                      <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onOpenEditPosyandu(pos.villageId, pos)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                          title="Edit Data Posyandu"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPosyanduToDelete({
                            villageId: pos.villageId,
                            villageName: pos.villageName,
                            posyandu: pos
                          })}
                          className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Posyandu"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Posyandu Name & Location */}
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 group-hover:text-pink-700 transition-colors">
                      {pos.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
                      <span className="font-semibold text-slate-800">{pos.villageName}</span>
                      <span className="text-slate-400">&bull;</span>
                      <span className="text-slate-600">{pos.dusun}</span>
                    </div>
                  </div>

                  {/* Posyandu Details & Cadres */}
                  <div className="p-3 bg-slate-50/80 rounded-xl space-y-2 text-xs border border-slate-100">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        Jadwal Buka:
                      </span>
                      <strong className="text-slate-900 font-medium">{pos.schedule}</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                        Jumlah Kader:
                      </span>
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md font-bold text-[11px]">
                        {pos.cadreCount} Kader
                      </span>
                    </div>

                    <div className="pt-1.5 border-t border-slate-200/60">
                      <div className="text-slate-500 text-[11px]">Ketua Kader Posyandu:</div>
                      <div className="font-bold text-slate-800 text-xs flex items-center justify-between mt-0.5">
                        <span>{pos.headOfPosyandu}</span>
                        {pos.phone && (
                          <a 
                            href={`tel:${pos.phone}`}
                            className="inline-flex items-center gap-1 text-[11px] text-emerald-600 hover:text-emerald-700 font-mono"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{pos.phone}</span>
                          </a>
                        )}
                      </div>
                    </div>

                    {pos.notes && (
                      <p className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-200/40">
                        &quot;{pos.notes}&quot;
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer: Quick village badge */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                  <span>Wilayah Binaan UPT Boganatar</span>
                  <span className="font-mono text-slate-400">ID: {pos.id}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {posyanduToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  Konfirmasi Hapus Posyandu
                </h4>
                <p className="text-xs text-slate-500">
                  Tindakan ini akan menghapus data posyandu secara permanen.
                </p>
              </div>
            </div>

            <div className="p-3.5 bg-red-50/70 border border-red-200 rounded-xl text-xs space-y-1.5 text-red-950">
              <div>
                <strong>Nama Posyandu:</strong> {posyanduToDelete.posyandu.name}
              </div>
              <div>
                <strong>Desa:</strong> {posyanduToDelete.villageName} ({posyanduToDelete.posyandu.dusun})
              </div>
              <div>
                <strong>Kategori:</strong> {posyanduToDelete.posyandu.category}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPosyanduToDelete(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeletePosyandu(posyanduToDelete.villageId, posyanduToDelete.posyandu.id);
                  setPosyanduToDelete(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs"
              >
                Ya, Hapus Posyandu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
