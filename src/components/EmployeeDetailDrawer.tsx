import React from 'react';
import { 
  X, 
  Printer, 
  Edit3, 
  Trash2, 
  Building, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  GraduationCap, 
  FileText, 
  ShieldCheck, 
  ShieldAlert, 
  Award,
  Clock,
  Download,
  CheckCircle2,
  ExternalLink,
  Lock,
  Plus,
  Eye,
  Upload
} from 'lucide-react';
import { Employee, PuskesmasInfo, DigitalDocument } from '../types/employee';
import { formatDateIndonesian, calculateAge, calculateTenure, getCredentialStatus } from '../utils/helpers';

interface EmployeeDetailDrawerProps {
  employee: Employee | null;
  isOpen: boolean;
  isAdmin?: boolean;
  onClose: () => void;
  onEdit: (emp: Employee) => void;
  onPrint: (emp: Employee) => void;
  onDelete: (emp: Employee) => void;
  onUploadDocument?: (emp: Employee) => void;
  onViewDocument?: (doc: DigitalDocument, emp: Employee) => void;
  onDeleteDocument?: (empId: string, docId: string) => void;
}

export const EmployeeDetailDrawer: React.FC<EmployeeDetailDrawerProps> = ({
  employee,
  isOpen,
  isAdmin = false,
  onClose,
  onEdit,
  onPrint,
  onDelete,
  onUploadDocument,
  onViewDocument,
  onDeleteDocument
}) => {
  if (!isOpen || !employee) return null;

  const age = calculateAge(employee.birthDate);
  const tenure = calculateTenure(employee.appointmentTMT);
  const totalTenure = calculateTenure(employee.firstAppointmentTMT);
  const strStatus = getCredentialStatus(employee.strExpiryDate, employee.strIsLifetime, employee.staffCategory === 'Nakes');
  const sipStatus = getCredentialStatus(employee.sipExpiryDate, false, employee.staffCategory === 'Nakes');

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end print:hidden">
      <div 
        id="drawer-employee-detail"
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Detail Profil & Dokumen Pegawai</h2>
              <p className="text-xs text-slate-400">SIMPEG UPT Puskesmas Boganatar</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs text-slate-700">
          {/* Profile Card Summary */}
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="w-24 h-32 rounded-xl overflow-hidden border-2 border-blue-600 shadow-2xs flex-shrink-0 bg-slate-200">
              <img
                src={employee.photoUrl}
                alt={employee.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.fullName)}&background=2563eb&color=fff`;
                }}
              />
            </div>

            <div className="flex-1 space-y-1.5 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  employee.employmentStatus === 'PNS' ? 'bg-green-100 text-green-800' :
                  employee.employmentStatus === 'PPPK' ? 'bg-blue-100 text-blue-800' : 'bg-slate-200 text-slate-800'
                }`}>
                  {employee.employmentStatus}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800">
                  {employee.staffCategory === 'Nakes' ? 'Tenaga Medis (Nakes)' : 'Non-Nakes'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900">{employee.fullName}</h3>
              <p className="font-medium text-blue-700">{employee.jobTitle}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-[11px] text-slate-500 font-mono pt-1">
                <span>{employee.nipType}: <strong className="text-slate-800">{employee.nip}</strong></span>
                <span>&bull;</span>
                <span>NIK: {employee.nik || '-'}</span>
              </div>
            </div>
          </div>

          {/* Quick Action Bar inside drawer */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onPrint(employee)}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Biodata Resmi (A4)</span>
            </button>
            <button
              onClick={() => onEdit(employee)}
              className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 border rounded-lg font-semibold shadow-2xs transition-colors ${
                isAdmin
                  ? 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700'
                  : 'bg-amber-50 border-amber-200 hover:bg-amber-100 text-amber-800'
              }`}
              title={isAdmin ? "Edit Data Pegawai" : "Hanya Admin yang dapat mengedit (Klik untuk Login)"}
            >
              {isAdmin ? <Edit3 className="w-4 h-4 text-blue-600" /> : <Lock className="w-4 h-4 text-amber-600" />}
              <span>{isAdmin ? 'Edit Data' : 'Edit (Khusus Admin)'}</span>
            </button>
            {isAdmin && (
              <button
                onClick={() => onDelete(employee)}
                className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg border border-slate-200 transition-colors"
                title="Hapus Pegawai (Khusus Admin)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Section: STR & SIP Status Badge (For Nakes) */}
          {employee.staffCategory === 'Nakes' && (
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Status Legalitas Profesi (STR & SIP)</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* STR Status */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Nomor STR</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${strStatus.badgeClass}`}>
                      {employee.strIsLifetime ? 'Seumur Hidup' : strStatus.label}
                    </span>
                  </div>
                  <p className="font-mono text-slate-900 font-semibold text-[11px]">{employee.strNumber || '-'}</p>
                  <p className="text-[10px] text-slate-500">
                    Masa Berlaku: {employee.strIsLifetime ? 'Seumur Hidup (UU Baru)' : (formatDateIndonesian(employee.strExpiryDate) || '-')}
                  </p>
                </div>

                {/* SIP Status */}
                <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">Nomor SIP</span>
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${sipStatus.badgeClass}`}>
                      {employee.sipExpiryDate ? sipStatus.label : 'Belum Terdata'}
                    </span>
                  </div>
                  <p className="font-mono text-slate-900 font-semibold text-[11px]">{employee.sipNumber || '-'}</p>
                  <p className="text-[10px] text-slate-500">
                    Masa Berlaku: {employee.sipExpiryDate ? formatDateIndonesian(employee.sipExpiryDate) : '-'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Section: Identitas Pribadi */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wide">
              Informasi Pribadi & Kontak
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Tempat & Tanggal Lahir</span>
                <span className="font-semibold text-slate-800">
                  {employee.birthPlace}, {formatDateIndonesian(employee.birthDate)} ({age} Thn)
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Jenis Kelamin / Agama</span>
                <span className="font-semibold text-slate-800">
                  {employee.gender === 'L' ? 'Laki-laki' : 'Perempuan'} &bull; {employee.religion}
                </span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Status Perkawinan</span>
                <span className="font-semibold text-slate-800">{employee.maritalStatus}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Nomor WhatsApp / HP</span>
                <span className="font-mono font-semibold text-slate-800">{employee.phone || '-'}</span>
              </div>
              <div className="col-span-2 p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Alamat Domisili</span>
                <span className="font-semibold text-slate-800">{employee.address} ({employee.village})</span>
              </div>
            </div>
          </div>

          {/* Section: Kepegawaian & Jabatan */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wide">
              Data Kepegawaian & Penempatan
            </h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Pangkat / Golongan Ruang</span>
                <span className="font-semibold text-slate-800">{employee.rankGrade || '-'}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Unit Kerja Penempatan</span>
                <span className="font-semibold text-blue-900">{employee.department}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">TMT SK Pengangkatan</span>
                <span className="font-semibold text-slate-800">{formatDateIndonesian(employee.appointmentTMT)}</span>
              </div>
              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 block">Masa Kerja (Tenure)</span>
                <span className="font-semibold text-slate-800">{tenure}</span>
              </div>
            </div>
          </div>

          {/* Section: Riwayat Pendidikan */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-900 border-b border-slate-200 pb-1 text-xs uppercase tracking-wide">
              Pendidikan Terakhir
            </h4>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{employee.educationLevel} - {employee.major}</span>
                <span className="font-mono text-slate-500 font-semibold">Lulus: {employee.graduationYear}</span>
              </div>
              <p className="text-slate-600">{employee.institution}</p>
              {employee.ijazahNumber && (
                <div className="pt-1 mt-1 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">No. Ijazah / STTB:</span>
                  <span className="font-mono font-semibold text-slate-800">{employee.ijazahNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* Section: Berkas Digital Terlampir */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-1.5 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
                  Arsip Dokumen Digital ({employee.documents?.length || 0})
                </h4>
              </div>

              {onUploadDocument && (
                <button
                  type="button"
                  onClick={() => onUploadDocument(employee)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Upload Berkas PDF</span>
                </button>
              )}
            </div>

            {(!employee.documents || employee.documents.length === 0) ? (
              <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl space-y-2">
                <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-slate-500 font-medium text-xs">
                  Belum ada lampiran berkas digital (SK, STR, SIP, Ijazah) untuk pegawai ini.
                </p>
                {onUploadDocument && (
                  <button
                    type="button"
                    onClick={() => onUploadDocument(employee)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Berkas PDF Sekarang</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {employee.documents.map(doc => (
                  <div key={doc.id} className="p-3 bg-slate-50 hover:bg-blue-50/30 rounded-xl border border-slate-200 transition-colors flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {doc.type}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 text-xs truncate">{doc.title}</p>
                        <p className="text-[10px] text-slate-500 font-mono truncate">
                          {doc.fileName} &bull; {doc.fileSize} &bull; Diunggah: {doc.uploadDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button 
                        type="button"
                        onClick={() => {
                          if (onViewDocument) {
                            onViewDocument(doc, employee);
                          }
                        }}
                        className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[11px] font-bold flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                        title="Lihat Berkas Dokumen"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Berkas</span>
                      </button>
                      {isAdmin && onDeleteDocument && (
                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Apakah Anda yakin ingin menghapus berkas "${doc.title}"?`)) {
                              onDeleteDocument(employee.id, doc.id);
                            }
                          }}
                          className="p-1.5 bg-white hover:bg-red-50 text-slate-400 hover:text-red-600 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                          title="Hapus Berkas"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg font-semibold text-xs transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
