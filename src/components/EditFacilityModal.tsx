import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Activity, 
  Clock, 
  FileText, 
  Tag, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';
import { FacilityUnit } from '../types/profileTerritory';

interface EditFacilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  facilityToEdit: FacilityUnit | null;
  onSave: (facility: FacilityUnit) => void;
}

const CATEGORY_OPTIONS = [
  'Kegawatdaruratan',
  'Rawat Inap',
  'Rawat Jalan',
  'Kesehatan Ibu & Anak',
  'Penunjang Medis',
  'Konseling & Promkes',
  'Tata Usaha & Pelayanan Umum',
  'Layanan Khusus'
];

const OPERATIONAL_HOUR_SUGGESTIONS = [
  '24 Jam Non-Stop',
  'Senin - Sabtu (08.00 - 14.00 WITA)',
  'Senin - Jumat (08.00 - 14.00 WITA)',
  'Senin - Kamis (08.00 - 14.00), Jumat (08.00 - 11.00), Sabtu (08.00 - 13.00)',
  'Sesuai Jadwal Jaga / On-Call'
];

export const EditFacilityModal: React.FC<EditFacilityModalProps> = ({
  isOpen,
  onClose,
  facilityToEdit,
  onSave
}) => {
  const [formData, setFormData] = useState<FacilityUnit>({
    id: '',
    name: '',
    category: 'Rawat Jalan',
    operationalHours: 'Senin - Sabtu (08.00 - 14.00 WITA)',
    description: '',
    status: 'Aktif'
  });

  useEffect(() => {
    if (facilityToEdit) {
      setFormData({
        id: facilityToEdit.id,
        name: facilityToEdit.name || '',
        category: facilityToEdit.category || 'Rawat Jalan',
        operationalHours: facilityToEdit.operationalHours || 'Senin - Sabtu (08.00 - 14.00 WITA)',
        description: facilityToEdit.description || '',
        status: facilityToEdit.status || 'Aktif'
      });
    } else {
      setFormData({
        id: `fac-${Date.now()}`,
        name: '',
        category: 'Rawat Jalan',
        operationalHours: 'Senin - Sabtu (08.00 - 14.00 WITA)',
        description: '',
        status: 'Aktif'
      });
    }
  }, [facilityToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    onSave({
      ...formData,
      id: formData.id || `fac-${Date.now()}`,
      name: formData.name.trim(),
      category: formData.category.trim() || 'Rawat Jalan',
      operationalHours: formData.operationalHours?.trim() || 'Senin - Sabtu (08.00 - 14.00 WITA)',
      description: formData.description?.trim() || ''
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden">
      <div 
        id="modal-edit-facility"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {facilityToEdit ? 'Edit Fasilitas & Unit Pelayanan' : 'Tambah Fasilitas & Unit Pelayanan'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                UPT Puskesmas Boganatar &bull; Layanan Kesehatan
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nama Fasilitas */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Nama Fasilitas / Unit Pelayanan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Contoh: Unit Gawat Darurat (UGD) 24 Jam / Poli Gigi & Mulut"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none font-medium"
            />
          </div>

          {/* Kategori & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-slate-500" />
                <span>Kategori Unit</span>
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Status Pelayanan</span>
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              >
                <option value="Aktif">Aktif (Beroperasi Penuh)</option>
                <option value="Siaga">Siaga 24 Jam</option>
                <option value="Tersedia">Tersedia</option>
                <option value="Pemeliharaan">Dalam Pemeliharaan / Renovasi</option>
              </select>
            </div>
          </div>

          {/* Jam Operasional */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span>Jam Operasional & Pelayanan</span>
            </label>
            <input
              type="text"
              value={formData.operationalHours}
              onChange={(e) => setFormData({ ...formData, operationalHours: e.target.value })}
              placeholder="Contoh: 24 Jam Non-Stop atau Senin - Sabtu (08.00 - 14.00 WITA)"
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {OPERATIONAL_HOUR_SUGGESTIONS.slice(0, 3).map((sug, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, operationalHours: sug })}
                  className="text-[10px] px-2 py-0.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded cursor-pointer transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Deskripsi & Cakupan Tindakan */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Deskripsi Singkat & Tindakan Pelayanan</span>
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Penjelasan ringkas jenis tindakan, dokter/perawat penanggung jawab, atau fasilitas yang tersedia..."
              className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed"
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
            <button
              id="btn-save-facility-item"
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Fasilitas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
