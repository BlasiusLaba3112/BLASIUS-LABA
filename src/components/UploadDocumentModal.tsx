import React, { useState, useRef } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Save, 
  AlertCircle, 
  Check, 
  FileType, 
  FileCheck,
  Eye,
  Lock,
  Plus
} from 'lucide-react';
import { DigitalDocument, Employee } from '../types/employee';

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
  isAdmin?: boolean;
  onSaveDocument: (employeeId: string, newDocument: DigitalDocument) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  employee,
  isAdmin = true,
  onSaveDocument
}) => {
  const [docType, setDocType] = useState<DigitalDocument['type']>('SK');
  const [docTitle, setDocTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileData, setFileData] = useState<string>('');
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen || !employee) return null;

  const handleFileChange = (selectedFile: File) => {
    setErrorMsg('');
    if (!selectedFile) return;

    // Check size (max 10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setErrorMsg('Ukuran file terlalu besar! Maksimal ukuran file adalah 10MB.');
      return;
    }

    // Format size
    const sizeInKb = selectedFile.size / 1024;
    const formattedSize = sizeInKb > 1024 
      ? `${(sizeInKb / 1024).toFixed(1)} MB` 
      : `${Math.round(sizeInKb)} KB`;

    setFile(selectedFile);
    setFileName(selectedFile.name);
    setFileSize(formattedSize);

    // Auto-generate title if empty
    if (!docTitle) {
      const baseName = selectedFile.name.replace(/\.[^/.]+$/, "");
      setDocTitle(baseName.replace(/_/g, ' '));
    }

    // Read as Base64 Data URL
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      if (typeof e.target?.result === 'string') {
        setFileData(e.target.result);
      }
      setIsProcessing(false);
    };
    reader.onerror = () => {
      setErrorMsg('Gagal membaca file. Silakan coba file lain.');
      setIsProcessing(false);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docTitle.trim()) {
      setErrorMsg('Judul dokumen wajib diisi.');
      return;
    }

    if (!fileName) {
      setErrorMsg('Silakan pilih atau unggah file PDF / dokumen terlebih dahulu.');
      return;
    }

    const newDoc: DigitalDocument = {
      id: `doc-${Date.now()}`,
      type: docType,
      title: docTitle.trim(),
      fileName: fileName,
      fileSize: fileSize || '1.0 MB',
      uploadDate: new Date().toISOString().split('T')[0],
      fileData: fileData || undefined
    };

    onSaveDocument(employee.id, newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden animate-in fade-in duration-150">
      <div 
        id="modal-upload-berkas-pdf"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Upload Berkas PDF Pegawai
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Pegawai: <strong className="text-slate-200">{employee.fullName}</strong> (NIP: {employee.nip})
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
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Document Category / Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Kategori Jenis Dokumen <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['SK', 'STR', 'SIP', 'Ijazah', 'KTP', 'Lainnya'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    setDocType(type);
                    if (!docTitle || docTitle.startsWith('Dokumen') || docTitle.includes('SK') || docTitle.includes('STR') || docTitle.includes('SIP')) {
                      const defaults: Record<string, string> = {
                        SK: `SK Terakhir ${employee.jobTitle || 'Pegawai'}`,
                        STR: `STR Tenaga Kesehatan ${employee.fullName.split(',')[0]}`,
                        SIP: `Surat Izin Praktik (SIP) UPT Puskesmas Boganatar`,
                        Ijazah: `Ijazah & Transkrip Nilai ${employee.educationLevel}`,
                        KTP: `KTP & Kartu Keluarga Pegawai`,
                        Lainnya: `Sertifikat / Dokumen Pendukung`
                      };
                      setDocTitle(defaults[type]);
                    }
                  }}
                  className={`py-2 px-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer text-center ${
                    docType === type
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Document Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Nama / Judul Berkas Dokumen <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="Contoh: SK Kenaikan Pangkat III/c, STR Seumur Hidup, Ijazah S-1"
              className="w-full px-3.5 py-2.5 text-xs font-semibold bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            />
          </div>

          {/* Upload Drag & Drop Area */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Pilih Berkas PDF / Scan Dokumen <span className="text-red-500">*</span>
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,application/pdf,image/png,image/jpeg,image/jpg"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  handleFileChange(e.target.files[0]);
                }
              }}
              className="hidden"
            />

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-5 border-2 border-dashed rounded-2xl text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isDragging
                  ? 'border-blue-500 bg-blue-50/80 scale-[0.99]'
                  : fileName
                  ? 'border-emerald-300 bg-emerald-50/40'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50 hover:bg-blue-50/20'
              }`}
            >
              {fileName ? (
                <>
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-slate-900 truncate max-w-xs">{fileName}</p>
                    <p className="text-[11px] text-emerald-700 font-medium">
                      Ukuran: {fileSize} &bull; Siap Diupload
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="mt-1 text-[11px] text-blue-600 hover:text-blue-800 font-bold hover:underline"
                  >
                    Ganti File Berkas Lain &rarr;
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-2xs">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800">
                      Klik untuk memilih file PDF atau seret & lepas file ke sini
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Mendukung format <strong>.PDF</strong>, .PNG, .JPG (Maksimal 10 MB)
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Quick preset suggestion buttons */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
            <span className="text-[11px] font-bold text-slate-600 block">Template Berkas Cepat:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setDocType('SK');
                  setDocTitle(`SK Kenaikan Pangkat ${employee.rankGrade || 'Terakhir'}`);
                  if (!fileName) {
                    setFileName(`SK_Pangkat_${employee.fullName.split(' ')[0]}.pdf`);
                    setFileSize('1.2 MB');
                  }
                }}
                className="px-2 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
              >
                + SK Pangkat
              </button>
              <button
                type="button"
                onClick={() => {
                  setDocType('STR');
                  setDocTitle(`STR Legalitas Profesi (Seumur Hidup)`);
                  if (!fileName) {
                    setFileName(`STR_${employee.fullName.split(' ')[0]}.pdf`);
                    setFileSize('950 KB');
                  }
                }}
                className="px-2 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
              >
                + STR Nakes
              </button>
              <button
                type="button"
                onClick={() => {
                  setDocType('SIP');
                  setDocTitle(`SIP Surat Izin Praktik Puskesmas`);
                  if (!fileName) {
                    setFileName(`SIP_${employee.fullName.split(' ')[0]}.pdf`);
                    setFileSize('1.1 MB');
                  }
                }}
                className="px-2 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
              >
                + SIP Izin Praktik
              </button>
              <button
                type="button"
                onClick={() => {
                  setDocType('Ijazah');
                  setDocTitle(`Ijazah & Transkrip ${employee.educationLevel}`);
                  if (!fileName) {
                    setFileName(`Ijazah_${employee.fullName.split(' ')[0]}.pdf`);
                    setFileSize('2.4 MB');
                  }
                }}
                className="px-2 py-1 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 rounded text-[11px] font-medium transition-colors cursor-pointer"
              >
                + Ijazah Kuliah
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
            >
              Batal
            </button>
            <button
              id="btn-submit-upload-document"
              type="submit"
              disabled={isProcessing}
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan & Upload Berkas</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
