import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Hospital, 
  Trash2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

interface EditOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  overview: string;
  onSave: (updatedOverview: string) => void;
  onDelete: () => void;
}

const DEFAULT_OVERVIEW_TEXT = 'UPT Puskesmas Boganatar merupakan fasilitas pelayanan kesehatan tingkat pertama (FKTP) di bawah naungan Dinas Kesehatan Kabupaten Sikka, terletak di jalur strategis Trans Flores Maumere - Larantuka, Kecamatan Talibura. Puskesmas Boganatar mengampu 5 (lima) desa binaan dengan cakupan pelayanan promotif, preventif, kuratif, dan rehabilitatif serta Unit Gawat Darurat (UGD) dan Rawat Inap.';

export const EditOverviewModal: React.FC<EditOverviewModalProps> = ({
  isOpen,
  onClose,
  overview,
  onSave,
  onDelete
}) => {
  const [text, setText] = useState(overview || '');

  useEffect(() => {
    setText(overview || '');
  }, [overview, isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(text.trim());
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus seluruh teks Gambaran Umum Puskesmas ini?')) {
      onDelete();
      onClose();
    }
  };

  const handleResetDefault = () => {
    setText(DEFAULT_OVERVIEW_TEXT);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden">
      <div 
        id="modal-edit-overview"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Hospital className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Edit Gambaran Umum Puskesmas
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                UPT Puskesmas Boganatar &bull; Informasi Institusi
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
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-slate-800">
                Deskripsi Gambaran Umum & Informasi Institusi
              </label>
              <button
                type="button"
                onClick={handleResetDefault}
                className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Gunakan Teks Rekomendasi</span>
              </button>
            </div>
            <textarea
              rows={6}
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Tuliskan gambaran umum, latar belakang berdirinya puskesmas, fungsi strategis dan wilayah binaan..."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none leading-relaxed text-slate-800"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{text.length} karakter</span>
              <span>Mendukung teks multi-paragraf</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div>
              {overview && (
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Hapus Gambaran Umum</span>
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
                id="btn-save-overview"
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Gambaran Umum</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
