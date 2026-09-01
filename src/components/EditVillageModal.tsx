import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  MapPin, 
  Users, 
  Baby, 
  ShieldCheck, 
  Navigation,
  UserCheck,
  Heart,
  Lock
} from 'lucide-react';
import { VillageTerritory } from '../types/profileTerritory';

interface EditVillageModalProps {
  isOpen: boolean;
  onClose: () => void;
  village: VillageTerritory | null;
  isAdmin?: boolean;
  onSave: (updatedVillage: VillageTerritory) => void;
}

export const EditVillageModal: React.FC<EditVillageModalProps> = ({
  isOpen,
  onClose,
  village,
  isAdmin = false,
  onSave
}) => {
  const [formData, setFormData] = useState<VillageTerritory | null>(null);

  useEffect(() => {
    if (village) {
      setFormData(JSON.parse(JSON.stringify(village)));
    }
  }, [village]);

  if (!isOpen || !formData) return null;

  const handlePopulationChange = (field: keyof typeof formData.population, value: number) => {
    const updatedPop = {
      ...formData.population,
      [field]: value
    };
    
    // Auto calculate total population if male or female changes
    if (field === 'maleCount' || field === 'femaleCount') {
      const male = field === 'maleCount' ? value : updatedPop.maleCount;
      const female = field === 'femaleCount' ? value : updatedPop.femaleCount;
      updatedPop.totalPopulation = (Number(male) || 0) + (Number(female) || 0);
    }

    setFormData({
      ...formData,
      population: updatedPop
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Akses Ditolak: Hanya Administrator yang berwenang menyimpan perubahan data desa.');
      return;
    }
    if (formData) {
      onSave(formData);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden">
      <div 
        id="modal-edit-village"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Edit Data Desa & Kependudukan: {formData.name}</span>
                {!isAdmin && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-bold rounded-full inline-flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Hanya Lihat (Terkunci)</span>
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Wilayah Kerja UPT Puskesmas Boganatar &bull; Kec. Talibura
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

        {/* Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {!isAdmin && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
              <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Mode Terkunci (Pratinjau / Hanya Lihat)</strong>
                <span>Anda masuk sebagai pengguna umum. Hanya akun <strong>Administrator</strong> yang memiliki hak akses untuk mengubah dan menyimpan data kependudukan desa.</span>
              </div>
            </div>
          )}

          {/* Section 1: Profil Geografis & Aparat Desa */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Navigation className="w-4 h-4 text-blue-600" />
              <span>1. Informasi Umum & Geografis Desa</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Desa
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Kepala Desa
                </label>
                <input
                  type="text"
                  value={formData.headOfVillage}
                  onChange={(e) => setFormData({ ...formData, headOfVillage: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  No. Kontak / HP Kepala Desa
                </label>
                <input
                  type="text"
                  value={formData.phoneHeadOfVillage || ''}
                  onChange={(e) => setFormData({ ...formData, phoneHeadOfVillage: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  placeholder="0812..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Karakteristik Topografi
                </label>
                <select
                  value={formData.geographicType}
                  onChange={(e) => setFormData({ ...formData, geographicType: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="Dataran Rendah">Dataran Rendah</option>
                  <option value="Pesisir / Pantai">Pesisir / Pantai</option>
                  <option value="Perbukitan / Pegunungan">Perbukitan / Pegunungan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Luas Wilayah (km²)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.areaKm2}
                  onChange={(e) => setFormData({ ...formData, areaKm2: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jarak ke Puskesmas (km) & Waktu Tempuh (menit)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={formData.distanceToPuskesmasKm}
                    onChange={(e) => setFormData({ ...formData, distanceToPuskesmasKm: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                    placeholder="Jarak (km)"
                  />
                  <input
                    type="number"
                    value={formData.travelTimeMinutes}
                    onChange={(e) => setFormData({ ...formData, travelTimeMinutes: parseInt(e.target.value) || 0 })}
                    className="w-full px-2.5 py-2 text-xs bg-white border border-slate-300 rounded-lg"
                    placeholder="Waktu (menit)"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Pos Pelayanan (Pustu / Poskesdes)
                </label>
                <input
                  type="text"
                  value={formData.pustuPoskesdes}
                  onChange={(e) => setFormData({ ...formData, pustuPoskesdes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: Pustu Nangahale"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Petugas Penanggung Jawab Pustu / Poskesdes
                </label>
                <input
                  type="text"
                  value={formData.pustuStaff}
                  onChange={(e) => setFormData({ ...formData, pustuStaff: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Nama Bidan / Perawat Desa"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Data Kependudukan & Sasaran Kesehatan */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-slate-200">
              <Users className="w-4 h-4 text-emerald-600" />
              <span>2. Data Kependudukan & Sasaran Program Kesehatan</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-[11px] font-bold text-slate-600 mb-1">
                  Jumlah KK (Keluarga)
                </label>
                <input
                  type="number"
                  value={formData.population.familyCount}
                  onChange={(e) => handlePopulationChange('familyCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold text-slate-900 bg-white border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                <label className="block text-[11px] font-bold text-blue-900 mb-1">
                  Laki-Laki (Jiwa)
                </label>
                <input
                  type="number"
                  value={formData.population.maleCount}
                  onChange={(e) => handlePopulationChange('maleCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold text-blue-900 bg-white border border-blue-300 rounded-lg"
                  required
                />
              </div>

              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                <label className="block text-[11px] font-bold text-rose-900 mb-1">
                  Perempuan (Jiwa)
                </label>
                <input
                  type="number"
                  value={formData.population.femaleCount}
                  onChange={(e) => handlePopulationChange('femaleCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs font-bold text-rose-900 bg-white border border-rose-300 rounded-lg"
                  required
                />
              </div>

              <div className="col-span-2 sm:col-span-3 p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-300">Total Jumlah Penduduk (L+P):</span>
                <span className="text-base font-black text-emerald-400">
                  {formData.population.totalPopulation.toLocaleString('id-ID')} Jiwa
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Baby className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Bayi 0-11 bulan</span>
                </label>
                <input
                  type="number"
                  value={formData.population.infantCount}
                  onChange={(e) => handlePopulationChange('infantCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Baby className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Balita 12 - 60 Bulan</span>
                </label>
                <input
                  type="number"
                  value={formData.population.toddlerCount}
                  onChange={(e) => handlePopulationChange('toddlerCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-sky-600" />
                  <span>Remaja</span>
                </label>
                <input
                  type="number"
                  value={formData.population.youthCount ?? 0}
                  onChange={(e) => handlePopulationChange('youthCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>Usia Produktif</span>
                </label>
                <input
                  type="number"
                  value={formData.population.productiveAgeCount ?? 0}
                  onChange={(e) => handlePopulationChange('productiveAgeCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-600" />
                  <span>Pasangan Usia Subur (PUS)</span>
                </label>
                <input
                  type="number"
                  value={formData.population.pusCount ?? 0}
                  onChange={(e) => handlePopulationChange('pusCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-[11px] font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-pink-600" />
                  <span>Wanita Usia Subur (WUS)</span>
                </label>
                <input
                  type="number"
                  value={formData.population.wusCount ?? 0}
                  onChange={(e) => handlePopulationChange('wusCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Ibu Hamil (Bumil)
                </label>
                <input
                  type="number"
                  value={formData.population.pregnantMotherCount}
                  onChange={(e) => handlePopulationChange('pregnantMotherCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Ibu Menyusui (Bufas)
                </label>
                <input
                  type="number"
                  value={formData.population.nursingMotherCount}
                  onChange={(e) => handlePopulationChange('nursingMotherCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Lansia (&ge; 60 thn)
                </label>
                <input
                  type="number"
                  value={formData.population.elderlyCount}
                  onChange={(e) => handlePopulationChange('elderlyCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                />
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <label className="block text-[11px] font-bold text-emerald-900 mb-1 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Peserta BPJS / KIS</span>
                </label>
                <input
                  type="number"
                  value={formData.population.bpjsCoveredCount}
                  onChange={(e) => handlePopulationChange('bpjsCoveredCount', parseInt(e.target.value) || 0)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg font-bold text-emerald-900"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Catatan Khusus Wilayah Desa
            </label>
            <textarea
              rows={2}
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Catatan potensi, kendala akses, dsb..."
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            {isAdmin ? (
              <button
                id="btn-save-village-data"
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Data Desa</span>
              </button>
            ) : (
              <button
                id="btn-save-village-data"
                type="button"
                disabled
                className="px-4 py-2 bg-slate-200 text-slate-500 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-not-allowed border border-slate-300"
                title="Hanya Administrator yang dapat menyimpan perubahan"
              >
                <Lock className="w-4 h-4 text-slate-400" />
                <span>Terkunci (Khusus Admin)</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
