import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { Employee } from '../types/employee';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  employee: Employee | null;
  onClose: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  employee,
  onClose,
  onConfirm
}) => {
  if (!isOpen || !employee) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 print:hidden">
      <div 
        id="modal-delete-confirm"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-bold text-slate-900 mb-1">
            Konfirmasi Hapus Data Pegawai
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Apakah Anda yakin ingin menghapus data pegawai ini secara permanen dari sistem SIMPEG Puskesmas Boganatar?
          </p>

          {/* Employee Preview Card */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 text-left flex items-center gap-3 mb-4">
            <img
              src={employee.photoUrl}
              alt={employee.fullName}
              className="w-12 h-12 rounded-full object-cover border border-slate-300 flex-shrink-0"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.fullName)}&background=2563eb&color=fff`;
              }}
            />
            <div className="min-w-0">
              <h4 className="font-bold text-slate-900 text-sm truncate">{employee.fullName}</h4>
              <p className="text-xs text-slate-600 truncate">{employee.jobTitle}</p>
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                {employee.nipType}: {employee.nip} &bull; {employee.employmentStatus}
              </p>
            </div>
          </div>

          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-left text-[11px] text-red-800">
            <strong>Peringatan:</strong> Seluruh riwayat jabatan, riwayat pendidikan, serta arsip berkas digital yang tersimpan pada profil pegawai ini akan dihapus.
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end gap-2">
          <button
            type="button"
            id="btn-cancel-delete"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            type="button"
            id="btn-confirm-delete"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs transition-all transform active:scale-95"
          >
            <Trash2 className="w-4 h-4" />
            <span>Ya, Hapus Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
