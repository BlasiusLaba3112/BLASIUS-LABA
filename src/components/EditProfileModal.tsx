import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Building2, 
  Target, 
  HeartHandshake, 
  Sparkles,
  Clock,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { PuskesmasProfileData, FacilityUnit } from '../types/profileTerritory';
import { DEFAULT_FACILITIES } from '../data/initialProfileTerritoryData';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: PuskesmasProfileData;
  onSave: (updatedData: PuskesmasProfileData) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profileData,
  onSave
}) => {
  const [formData, setFormData] = useState<PuskesmasProfileData>(() => {
    const cloned = JSON.parse(JSON.stringify(profileData));
    if (!cloned.facilities || cloned.facilities.length === 0) {
      cloned.facilities = DEFAULT_FACILITIES;
    }
    return cloned;
  });
  const [activeSubTab, setActiveSubTab] = useState<'visi_misi' | 'tata_nilai' | 'deskripsi' | 'fasilitas'>('visi_misi');

  if (!isOpen) return null;

  const handleMissionChange = (index: number, value: string) => {
    const updated = [...formData.mission];
    updated[index] = value;
    setFormData({ ...formData, mission: updated });
  };

  const handleAddMission = () => {
    setFormData({ ...formData, mission: [...formData.mission, ''] });
  };

  const handleRemoveMission = (index: number) => {
    const updated = formData.mission.filter((_, i) => i !== index);
    setFormData({ ...formData, mission: updated });
  };

  const handleCoreValuePointChange = (index: number, field: 'word' | 'meaning', value: string) => {
    const updatedPoints = [...formData.coreValues.points];
    updatedPoints[index] = { ...updatedPoints[index], [field]: value };
    setFormData({
      ...formData,
      coreValues: {
        ...formData.coreValues,
        points: updatedPoints
      }
    });
  };

  const handleFacilityChange = (index: number, field: keyof FacilityUnit, value: any) => {
    const currentFacilities = formData.facilities ? [...formData.facilities] : [...DEFAULT_FACILITIES];
    currentFacilities[index] = {
      ...currentFacilities[index],
      [field]: value
    };
    setFormData({
      ...formData,
      facilities: currentFacilities
    });
  };

  const handleAddFacility = () => {
    const newFacility: FacilityUnit = {
      id: `fac-${Date.now()}`,
      name: '',
      category: 'Rawat Jalan',
      operationalHours: 'Senin - Sabtu (08.00 - 14.00 WITA)',
      description: '',
      status: 'Aktif'
    };
    const currentFacilities = formData.facilities ? [...formData.facilities] : [...DEFAULT_FACILITIES];
    setFormData({
      ...formData,
      facilities: [...currentFacilities, newFacility]
    });
  };

  const handleRemoveFacility = (index: number) => {
    const currentFacilities = formData.facilities ? [...formData.facilities] : [...DEFAULT_FACILITIES];
    const updated = currentFacilities.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      facilities: updated
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden">
      <div 
        id="modal-edit-profile"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Edit Profil, Visi, Misi & Fasilitas
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                UPT Puskesmas Boganatar &bull; Dinas Kesehatan Kabupaten Sikka
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

        {/* Sub-tabs Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 flex gap-2 pt-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveSubTab('visi_misi')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'visi_misi'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Visi, Misi & Motto
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('tata_nilai')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'tata_nilai'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Tata Nilai ({formData.coreValues.acronym})
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('deskripsi')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
              activeSubTab === 'deskripsi'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Gambaran Umum & Wilayah
          </button>
          <button
            type="button"
            onClick={() => setActiveSubTab('fasilitas')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1 ${
              activeSubTab === 'fasilitas'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Fasilitas & Unit ({formData.facilities?.length || DEFAULT_FACILITIES.length})</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* TAB 1: VISI, MISI, MOTTO */}
          {activeSubTab === 'visi_misi' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Target className="w-4 h-4 text-blue-600" />
                  <span>Visi Puskesmas Boganatar</span>
                </label>
                <textarea
                  rows={3}
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  placeholder="Masukkan rumusan Visi Puskesmas..."
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Misi Puskesmas (Butir Poin)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddMission}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Tambah Poin Misi</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {formData.mission.map((item, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <span className="w-6 h-8 flex items-center justify-center text-xs font-bold text-slate-500 bg-slate-100 rounded-md border border-slate-200 flex-shrink-0">
                        {index + 1}
                      </span>
                      <textarea
                        rows={2}
                        value={item}
                        onChange={(e) => handleMissionChange(index, e.target.value)}
                        className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                        placeholder={`Poin misi ke-${index + 1}...`}
                        required
                      />
                      {formData.mission.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMission(index)}
                          className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                          title="Hapus poin misi ini"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <HeartHandshake className="w-4 h-4 text-rose-600" />
                  <span>Motto Pelayanan</span>
                </label>
                <input
                  type="text"
                  value={formData.motto}
                  onChange={(e) => setFormData({ ...formData, motto: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: Melayani dengan Kasih, Cepat, Tepat, dan Ramah (KASIH)"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 2: TATA NILAI */}
          {activeSubTab === 'tata_nilai' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Singkatan / Akronim Tata Nilai
                  </label>
                  <input
                    type="text"
                    value={formData.coreValues.acronym}
                    onChange={(e) => setFormData({
                      ...formData,
                      coreValues: { ...formData.coreValues, acronym: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Deskripsi Singkat Tata Nilai
                  </label>
                  <input
                    type="text"
                    value={formData.coreValues.description}
                    onChange={(e) => setFormData({
                      ...formData,
                      coreValues: { ...formData.coreValues, description: e.target.value }
                    })}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="block text-xs font-bold text-slate-800">
                  Rincian Makna Setiap Huruf Tata Nilai:
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {formData.coreValues.points.map((pt, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0">
                        {pt.letter}
                      </div>
                      <div className="w-full sm:w-36 flex-shrink-0">
                        <input
                          type="text"
                          value={pt.word}
                          onChange={(e) => handleCoreValuePointChange(idx, 'word', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Kata Kunci"
                          required
                        />
                      </div>
                      <div className="flex-1 w-full">
                        <input
                          type="text"
                          value={pt.meaning}
                          onChange={(e) => handleCoreValuePointChange(idx, 'meaning', e.target.value)}
                          className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          placeholder="Penjelasan / Makna Tata Nilai"
                          required
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: DESKRIPSI & JAM LAYANAN */}
          {activeSubTab === 'deskripsi' && (
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Gambaran Umum Puskesmas</span>
                  </label>
                  {formData.overview && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, overview: '' })}
                      className="text-[11px] text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Hapus Teks Gambaran Umum</span>
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={formData.overview}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  placeholder="Deskripsi singkat sejarah, lokasi, dan fasilitas UPT Puskesmas Boganatar..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Karakteristik & Gambaran Wilayah Kerja 5 Desa
                </label>
                <textarea
                  rows={3}
                  value={formData.workingAreaDescription}
                  onChange={(e) => setFormData({ ...formData, workingAreaDescription: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none leading-relaxed"
                  placeholder="Deskripsi batas wilayah, aksesibilitas geografis..."
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Jam Pelayanan Puskesmas</span>
                </label>
                <input
                  type="text"
                  value={formData.serviceHours}
                  onChange={(e) => setFormData({ ...formData, serviceHours: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: Rawat Jalan: Senin - Sabtu (08.00 - 14.00 WITA) | UGD: 24 Jam"
                  required
                />
              </div>
            </div>
          )}

          {/* TAB 4: FASILITAS & UNIT PELAYANAN */}
          {activeSubTab === 'fasilitas' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-emerald-600" />
                    <span>Daftar Fasilitas & Unit Pelayanan</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Kelola nama ruang pelayanan, poli, jam buka, dan keterangan
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleAddFacility}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Fasilitas</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.facilities || DEFAULT_FACILITIES).map((fac, idx) => (
                  <div 
                    key={fac.id || idx} 
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold flex items-center justify-center flex-shrink-0">
                          {idx + 1}
                        </span>
                        <input
                          type="text"
                          required
                          value={fac.name}
                          onChange={(e) => handleFacilityChange(idx, 'name', e.target.value)}
                          placeholder="Nama Fasilitas / Unit Pelayanan..."
                          className="flex-1 px-2.5 py-1 text-xs font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveFacility(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                        title="Hapus fasilitas ini"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Kategori</label>
                        <select
                          value={fac.category || 'Rawat Jalan'}
                          onChange={(e) => handleFacilityChange(idx, 'category', e.target.value)}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Kegawatdaruratan">Kegawatdaruratan</option>
                          <option value="Rawat Inap">Rawat Inap</option>
                          <option value="Rawat Jalan">Rawat Jalan</option>
                          <option value="Kesehatan Ibu & Anak">Kesehatan Ibu & Anak</option>
                          <option value="Penunjang Medis">Penunjang Medis</option>
                          <option value="Konseling & Promkes">Konseling & Promkes</option>
                          <option value="Tata Usaha / Umum">Tata Usaha / Umum</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Jam Layanan</label>
                        <input
                          type="text"
                          value={fac.operationalHours || ''}
                          onChange={(e) => handleFacilityChange(idx, 'operationalHours', e.target.value)}
                          placeholder="24 Jam / 08.00-14.00"
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">Status</label>
                        <select
                          value={fac.status || 'Aktif'}
                          onChange={(e) => handleFacilityChange(idx, 'status', e.target.value as any)}
                          className="w-full px-2 py-1 text-xs bg-white border border-slate-300 rounded-md focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="Aktif">Aktif</option>
                          <option value="Siaga">Siaga 24 Jam</option>
                          <option value="Tersedia">Tersedia</option>
                          <option value="Pemeliharaan">Pemeliharaan</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={fac.description || ''}
                        onChange={(e) => handleFacilityChange(idx, 'description', e.target.value)}
                        placeholder="Deskripsi singkat pelayanan..."
                        className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-md focus:ring-1 focus:ring-blue-500 text-slate-700"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              id="btn-save-edit-profile"
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Profil</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

