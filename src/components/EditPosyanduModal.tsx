import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  HeartHandshake, 
  MapPin, 
  User, 
  Phone, 
  Calendar, 
  Building2,
  Trash2,
  Edit,
  Plus,
  ListFilter,
  Users,
  Lock,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { PosyanduInfo, VillageTerritory } from '../types/profileTerritory';

interface EditPosyanduModalProps {
  isOpen: boolean;
  onClose: () => void;
  posyandu: PosyanduInfo | null;
  selectedVillageId: string;
  villages: VillageTerritory[];
  isAdmin?: boolean;
  onSave: (villageId: string, posyanduData: PosyanduInfo) => void;
  onDelete?: (villageId: string, posyanduId: string) => void;
}

export const EditPosyanduModal: React.FC<EditPosyanduModalProps> = ({
  isOpen,
  onClose,
  posyandu,
  selectedVillageId,
  villages,
  isAdmin = true,
  onSave,
  onDelete
}) => {
  const [villageId, setVillageId] = useState<string>(selectedVillageId || (villages[0]?.id ?? ''));
  const [activeTab, setActiveTab] = useState<'form' | 'list'>('form');
  const [isEditMode, setIsEditMode] = useState<boolean>(Boolean(posyandu));
  const [confirmDeleteTarget, setConfirmDeleteTarget] = useState<PosyanduInfo | null>(null);
  
  const [formData, setFormData] = useState<PosyanduInfo>({
    id: `pos-${Date.now()}`,
    name: '',
    category: 'Posyandu Integrasi ILP',
    dusun: '',
    address: '',
    cadreCount: 5,
    headOfPosyandu: '',
    phone: '',
    schedule: 'Setiap tanggal 10',
    notes: ''
  });

  // Current selected village object
  const currentVillage = villages.find(v => v.id === villageId) || villages[0];

  useEffect(() => {
    if (posyandu) {
      setFormData(JSON.parse(JSON.stringify(posyandu)));
      setIsEditMode(true);
      setActiveTab('form');
    } else {
      setFormData({
        id: `pos-${Date.now()}`,
        name: '',
        category: 'Posyandu Integrasi ILP',
        dusun: '',
        address: '',
        cadreCount: 5,
        headOfPosyandu: '',
        phone: '',
        schedule: 'Setiap tanggal 10',
        notes: ''
      });
      setIsEditMode(false);
    }
    if (selectedVillageId) {
      setVillageId(selectedVillageId);
    }
  }, [posyandu, selectedVillageId, isOpen]);

  if (!isOpen) return null;

  const handleSelectPosyanduToEdit = (pos: PosyanduInfo) => {
    setFormData(JSON.parse(JSON.stringify(pos)));
    setIsEditMode(true);
    setActiveTab('form');
  };

  const handleResetToNew = () => {
    setFormData({
      id: `pos-${Date.now()}`,
      name: '',
      category: 'Posyandu Integrasi ILP',
      dusun: '',
      address: '',
      cadreCount: 5,
      headOfPosyandu: '',
      phone: '',
      schedule: 'Setiap tanggal 10',
      notes: ''
    });
    setIsEditMode(false);
    setActiveTab('form');
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(villageId, formData);
    onClose();
  };

  const handleDeleteCurrent = () => {
    if (!onDelete) return;
    if (!formData.id || !formData.name) return;
    setConfirmDeleteTarget(formData);
  };

  const handleDeleteSpecific = (targetPos: PosyanduInfo) => {
    if (!onDelete) return;
    setConfirmDeleteTarget(targetPos);
  };

  const handleExecuteDelete = () => {
    if (!onDelete || !confirmDeleteTarget) return;
    const target = confirmDeleteTarget;
    onDelete(villageId, target.id);
    setConfirmDeleteTarget(null);
    if (formData.id === target.id) {
      if (activeTab === 'form') {
        onClose();
      } else {
        handleResetToNew();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden">
      <div 
        id="modal-edit-posyandu"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-pink-600/20 border border-pink-500/30 flex items-center justify-center text-pink-400">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">
                  {isEditMode ? 'Edit & Kelola Posyandu' : 'Tambah Posyandu Baru'}
                </h2>
                {isEditMode ? (
                  <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded text-[10px] font-bold">
                    Mode Edit
                  </span>
                ) : (
                  <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded text-[10px] font-bold">
                    Tambah Baru
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Desa Binaan: <strong className="text-slate-200">{currentVillage?.name}</strong> • Wilayah UPT Puskesmas Boganatar
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

        {/* Tab Navigation: Form Input / Edit vs Daftar Posyandu */}
        <div className="px-6 pt-3 pb-2 bg-slate-50 border-b border-slate-200 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('form')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'form'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {isEditMode ? <Edit className="w-3.5 h-3.5 text-blue-600" /> : <Plus className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{isEditMode ? 'Form Edit Data' : 'Form Tambah Baru'}</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === 'list'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ListFilter className="w-3.5 h-3.5 text-pink-600" />
              <span>Daftar Posyandu ({currentVillage?.posyanduList?.length || 0})</span>
            </button>
          </div>

          {/* Quick toggle button */}
          {isEditMode ? (
            <button
              type="button"
              onClick={handleResetToNew}
              className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
              title="Buat input posyandu baru"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Buat Baru</span>
            </button>
          ) : (
            currentVillage?.posyanduList && currentVillage.posyanduList.length > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('list')}
                className="text-xs text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 hover:underline cursor-pointer"
              >
                <span>Lihat / Edit yang sudah ada &rarr;</span>
              </button>
            )
          )}
        </div>

        {/* Modal Body */}
        {activeTab === 'form' ? (
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* Quick Posyandu Selector (Allows switching directly between editing any existing posyandu or creating new) */}
            <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                  <span>Pilih Posyandu untuk Diedit atau Tambah Baru:</span>
                </span>
                {isEditMode && (
                  <button
                    type="button"
                    onClick={handleResetToNew}
                    className="text-emerald-700 font-bold hover:underline cursor-pointer"
                  >
                    + Ganti ke Tambah Baru
                  </button>
                )}
              </div>
              <select
                value={isEditMode ? formData.id : '__NEW__'}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '__NEW__') {
                    handleResetToNew();
                  } else {
                    const found = currentVillage?.posyanduList?.find(p => p.id === val);
                    if (found) {
                      handleSelectPosyanduToEdit(found);
                    }
                  }
                }}
                className="w-full px-3 py-2 text-xs font-bold bg-white border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="__NEW__">➕ [Tambah Posyandu Baru di {currentVillage?.name}]</option>
                <optgroup label={`Posyandu Terdaftar di ${currentVillage?.name} (${currentVillage?.posyanduList?.length || 0}):`}>
                  {currentVillage?.posyanduList?.map((p) => (
                    <option key={p.id} value={p.id}>
                      ✏️ Edit: {p.name} ({p.dusun || 'Dusun'} - {p.category})
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Village Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Pilih Desa Wilayah Kerja</span>
              </label>
              <select
                value={villageId}
                onChange={(e) => {
                  setVillageId(e.target.value);
                  // if switching village and in edit mode with a posyandu from previous village, keep it or reset
                }}
                className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              >
                {villages.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.posyanduList?.length || 0} Posyandu Binaan)
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nama Posyandu <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Contoh: Posyandu Mawar I"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jenis / Kategori Posyandu
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                >
                  <option value="Posyandu Integrasi ILP">Posyandu Integrasi ILP</option>
                  <option value="Posyandu Balita">Posyandu Balita</option>
                  <option value="Posyandu Lansia">Posyandu Lansia</option>
                  <option value="Posyandu Remaja">Posyandu Remaja</option>
                  <option value="Posbindu PTM">Posbindu PTM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Jumlah Kader Aktif
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={formData.cadreCount}
                  onChange={(e) => setFormData({ ...formData, cadreCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>Dusun / Lingkungan <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={formData.dusun}
                  onChange={(e) => setFormData({ ...formData, dusun: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  placeholder="Contoh: Dusun Kringa Barat"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Lokasi / Alamat Spesifik <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  placeholder="RT 002 / RW 001"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-600" />
                  <span>Ketua Kader Posyandu <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={formData.headOfPosyandu}
                  onChange={(e) => setFormData({ ...formData, headOfPosyandu: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  placeholder="Nama Ketua Posyandu"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  <span>No. Kontak / WA</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  placeholder="0812..."
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Jadwal Buka / Pelayanan Rutin <span className="text-red-500">*</span></span>
                </label>
                <input
                  type="text"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  placeholder="Contoh: Setiap tanggal 10 atau Rabu Minggu ke-2"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan / Layanan Tambahan
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ''}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
                  placeholder="Catatan PMT, imunisasi, sasaran balita/lansia binaan..."
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-2">
              <div>
                {isEditMode && onDelete && (
                  <button
                    type="button"
                    onClick={handleDeleteCurrent}
                    className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Hapus Posyandu ini dari database"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                    <span>Hapus Posyandu</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="btn-save-posyandu"
                  type="submit"
                  className="px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>{isEditMode ? 'Perbarui Data Posyandu' : 'Simpan Posyandu Baru'}</span>
                </button>
              </div>
            </div>
          </form>
        ) : (
          /* List & Management Tab */
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between bg-pink-50 p-3 rounded-xl border border-pink-100">
              <div>
                <h3 className="text-xs font-bold text-pink-900">
                  Daftar Posyandu di {currentVillage?.name}
                </h3>
                <p className="text-[11px] text-pink-700 mt-0.5">
                  Total {currentVillage?.posyanduList?.length || 0} Posyandu aktif binaan UPT Puskesmas Boganatar.
                </p>
              </div>
              <button
                type="button"
                onClick={handleResetToNew}
                className="px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Tambah Baru</span>
              </button>
            </div>

            {(!currentVillage?.posyanduList || currentVillage.posyanduList.length === 0) ? (
              <div className="text-center py-10 border-2 border-dashed border-slate-200 rounded-xl">
                <HeartHandshake className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">Belum ada Posyandu terdaftar di desa ini</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Klik tombol Tambah Baru di atas untuk mendaftarkan posyandu.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {currentVillage.posyanduList.map((pos, idx) => (
                  <div
                    key={pos.id || idx}
                    className="p-3.5 bg-white border border-slate-200 hover:border-pink-300 rounded-xl transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-xs text-slate-900">{pos.name}</span>
                        <span className="px-2 py-0.5 bg-pink-100 text-pink-800 rounded text-[10px] font-bold">
                          {pos.category}
                        </span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" />
                          {pos.cadreCount} Kader
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 flex items-center gap-3 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-red-500" />
                          {pos.dusun} ({pos.address})
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-blue-500" />
                          Ketua: <strong className="text-slate-800">{pos.headOfPosyandu}</strong>
                        </span>
                        <span className="flex items-center gap-1 font-medium text-indigo-600">
                          <Calendar className="w-3 h-3" />
                          {pos.schedule}
                        </span>
                      </div>
                    </div>

                    {/* Action buttons: Edit & Hapus */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center flex-shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 w-full sm:w-auto justify-end">
                      <button
                        type="button"
                        onClick={() => handleSelectPosyanduToEdit(pos)}
                        className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        title={`Edit Data ${pos.name}`}
                      >
                        <Edit className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      {onDelete && (
                        <button
                          type="button"
                          onClick={() => handleDeleteSpecific(pos)}
                          className="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                          title={`Hapus ${pos.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="pt-4 border-t border-slate-200 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        )}

        {/* DIALOG PERSETUJUAN HAPUS POSYANDU (YA / TIDAK) */}
        {confirmDeleteTarget && (
          <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4 print:hidden animate-in fade-in duration-150">
            <div 
              id="modal-confirm-delete-posyandu-dialog"
              className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
            >
              <div className="p-5 bg-red-50 border-b border-red-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-100 border border-red-200 flex items-center justify-center text-red-600 flex-shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-red-950">Konfirmasi Persetujuan Hapus</h3>
                  <p className="text-xs text-red-700 font-medium">Penghapusan data Posyandu</p>
                </div>
              </div>

              <div className="p-5 space-y-3.5">
                <p className="text-xs text-slate-700 leading-relaxed">
                  Apakah Anda yakin ingin <strong>menghapus Posyandu</strong> berikut dari desa binaan?
                </p>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-1.5 border-b border-slate-200">
                    <span className="text-slate-500 font-medium">Nama Posyandu:</span>
                    <span className="font-bold text-slate-900">{confirmDeleteTarget.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Desa Binaan:</span>
                    <span className="font-bold text-blue-700">{currentVillage?.name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Kategori:</span>
                    <span className="font-semibold text-pink-700">{confirmDeleteTarget.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Dusun & Lokasi:</span>
                    <span className="text-slate-700">{confirmDeleteTarget.dusun}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 font-medium">Ketua:</span>
                    <span className="text-slate-800 font-semibold">{confirmDeleteTarget.headOfPosyandu}</span>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2 text-xs text-amber-800">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>
                    Data yang dihapus tidak dapat dipulihkan kembali dan akan otomatis diperbarui di database.
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfirmDeleteTarget(null)}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Tidak, Batalkan
                </button>
                <button
                  type="button"
                  onClick={handleExecuteDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Ya, Setujui & Hapus</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
