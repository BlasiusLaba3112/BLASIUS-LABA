import React from 'react';
import { 
  X, 
  Download, 
  Printer, 
  FileText, 
  ExternalLink, 
  ShieldCheck, 
  Calendar, 
  HardDrive,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import { DigitalDocument, Employee } from '../types/employee';

interface DocumentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: DigitalDocument | null;
  employee?: Employee | null;
}

export const DocumentViewerModal: React.FC<DocumentViewerModalProps> = ({
  isOpen,
  onClose,
  document: doc,
  employee
}) => {
  if (!isOpen || !doc) return null;

  const isPdf = doc.fileName.toLowerCase().endsWith('.pdf') || (doc.fileData && doc.fileData.startsWith('data:application/pdf'));
  const isImage = doc.fileData && (doc.fileData.startsWith('data:image/') || doc.fileName.match(/\.(jpeg|jpg|png|webp|gif)$/i));

  const handleDownload = () => {
    if (doc.fileData) {
      const link = window.document.createElement('a');
      link.href = doc.fileData;
      link.download = doc.fileName || `${doc.title}.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    } else {
      // Create a printable blob preview if real base64 is not present (mock seed data)
      const mockContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>${doc.title} - ${employee?.fullName || 'SIMPEG Puskesmas Boganatar'}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; color: #1e293b; }
            .header { border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 5px; }
            .subtitle { font-size: 13px; color: #64748b; }
            .content-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 20px; background: #f8fafc; margin-top: 20px; }
            .row { display: flex; margin-bottom: 10px; font-size: 14px; }
            .label { width: 180px; font-weight: 600; color: #475569; }
            .val { font-weight: bold; color: #0f172a; }
            .footer { margin-top: 40px; text-align: right; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">PEMERINTAH KABUPATEN SIKKA - DINAS KESEHATAN</div>
            <div class="title">UPT PUSKESMAS BOGANATAR KECAMATAN TALIBURA</div>
            <div class="subtitle">ARSIP DOKUMEN DIGITAL KEPEGAWAIAN (SIMPEG)</div>
          </div>
          <div class="content-box">
            <h3 style="margin-top:0; color: #0369a1;">${doc.title} (${doc.type})</h3>
            <div class="row"><div class="label">Nama Pegawai:</div><div class="val">${employee?.fullName || '-'}</div></div>
            <div class="row"><div class="label">NIP / NIK:</div><div class="val">${employee?.nip || '-'}</div></div>
            <div class="row"><div class="label">Jabatan:</div><div class="val">${employee?.jobTitle || '-'}</div></div>
            <div class="row"><div class="label">Unit Kerja:</div><div class="val">${employee?.department || '-'}</div></div>
            <div class="row"><div class="label">Nama Berkas:</div><div class="val">${doc.fileName}</div></div>
            <div class="row"><div class="label">Ukuran Dokumen:</div><div class="val">${doc.fileSize}</div></div>
            <div class="row"><div class="label">Tanggal Unggah:</div><div class="val">${doc.uploadDate}</div></div>
          </div>
          <div class="footer">
            <p>Terverifikasi dalam Sistem Informasi Kepegawaian (SIMPEG)<br/>UPT Puskesmas Boganatar</p>
          </div>
        </body>
        </html>
      `;
      const blob = new Blob([mockContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      if (!win) {
        alert('Izinkan pop-up peramban untuk melihat arsip dokumen.');
      }
    }
  };

  const handlePrint = () => {
    if (doc.fileData && isPdf) {
      const iframe = window.document.getElementById('pdf-preview-frame') as HTMLIFrameElement;
      if (iframe && iframe.contentWindow) {
        try {
          iframe.contentWindow.focus();
          iframe.contentWindow.print();
          return;
        } catch {
          // Fallback to window print
        }
      }
    }
    handleDownload();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:hidden animate-in fade-in duration-150">
      <div 
        id="modal-viewer-berkas-pdf"
        className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white truncate">
                  {doc.title}
                </h3>
                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-300 border border-blue-400/30 rounded text-[10px] font-bold flex-shrink-0">
                  {doc.type}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate mt-0.5">
                {employee?.fullName ? `${employee.fullName} (NIP: ${employee.nip}) • ` : ''}{doc.fileName} ({doc.fileSize})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handleDownload}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Unduh Berkas"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span className="hidden sm:inline">Unduh</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Cetak Berkas"
            >
              <Printer className="w-3.5 h-3.5 text-slate-300" />
              <span className="hidden sm:inline">Cetak</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-red-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Document Info Bar */}
        <div className="px-5 py-2 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600 flex-wrap gap-2 flex-shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Diunggah: <strong>{doc.uploadDate}</strong>
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="w-3.5 h-3.5 text-slate-400" />
              Ukuran: <strong>{doc.fileSize}</strong>
            </span>
            <span className="flex items-center gap-1 font-mono text-[11px]">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
              Format: <strong>{isPdf ? 'PDF Dokumen' : (isImage ? 'Gambar Digital' : 'Dokumen Terarsip')}</strong>
            </span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">
            SIMPEG UPT Puskesmas Boganatar
          </div>
        </div>

        {/* Modal Main Viewer Content */}
        <div className="flex-1 overflow-y-auto bg-slate-900/5 min-h-[420px] max-h-[70vh] flex items-center justify-center p-3 sm:p-4">
          {doc.fileData ? (
            isPdf ? (
              <div className="w-full h-full min-h-[500px] flex flex-col bg-white rounded-xl shadow-inner border border-slate-200 overflow-hidden">
                <iframe
                  id="pdf-preview-frame"
                  src={doc.fileData}
                  className="w-full h-full min-h-[500px] border-0"
                  title={doc.title}
                />
              </div>
            ) : isImage ? (
              <div className="w-full flex items-center justify-center bg-slate-800/10 rounded-xl p-4 min-h-[350px]">
                <img
                  src={doc.fileData}
                  alt={doc.title}
                  className="max-h-[550px] max-w-full object-contain rounded-lg shadow-md border border-slate-200 bg-white"
                />
              </div>
            ) : (
              <div className="w-full h-full min-h-[400px] bg-white rounded-xl p-6 border border-slate-200 flex flex-col items-center justify-center text-center space-y-3">
                <FileText className="w-16 h-16 text-blue-600" />
                <h4 className="text-base font-bold text-slate-900">{doc.title}</h4>
                <p className="text-xs text-slate-500 max-w-md">
                  Berkas berformat {doc.fileName.split('.').pop()?.toUpperCase() || 'Digital'}. Anda dapat mengunduh atau mencetak berkas ini langsung ke perangkat Anda.
                </p>
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Unduh Dokumen ({doc.fileName})</span>
                </button>
              </div>
            )
          ) : (
            /* Simulation / Seed Certificate View for default records */
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 space-y-6">
              <div className="border-b-2 border-slate-900 pb-4 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-slate-800 font-bold text-xs uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  <span>Pemerintah Kabupaten Sikka &bull; Dinas Kesehatan</span>
                </div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  UPT PUSKESMAS BOGANATAR KECAMATAN TALIBURA
                </h2>
                <p className="text-[11px] text-slate-600">
                  Jl. Trans Flores Maumere - Larantuka, Desa Kringa, Kec. Talibura, Kab. Sikka, NTT (Kode: P5310040202)
                </p>
              </div>

              <div className="text-center space-y-1">
                <span className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 rounded-full text-xs font-bold inline-block">
                  DOKUMEN ELEKTRONIK KEPEGAWAIAN (SIMPEG)
                </span>
                <h3 className="text-lg font-bold text-slate-900 pt-2">{doc.title}</h3>
                <p className="text-xs font-mono text-slate-500">Nomor Arsip Digital: {doc.id} / BOGANATAR / {new Date().getFullYear()}</p>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Nama Pegawai:</span>
                  <span className="col-span-2 font-bold text-slate-900">{employee?.fullName || 'Pegawai Terdata'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">NIP / NIK:</span>
                  <span className="col-span-2 font-mono font-bold text-slate-800">{employee?.nip || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Status & Golongan:</span>
                  <span className="col-span-2 font-semibold text-slate-800">{employee?.employmentStatus || 'PNS'} • {employee?.rankGrade || '-'}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Jabatan & Unit Kerja:</span>
                  <span className="col-span-2 font-semibold text-slate-800">{employee?.jobTitle || '-'} ({employee?.department || '-'})</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1 border-b border-slate-200">
                  <span className="text-slate-500 font-medium">Nama Berkas Lampiran:</span>
                  <span className="col-span-2 font-mono font-bold text-blue-700">{doc.fileName}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 py-1">
                  <span className="text-slate-500 font-medium">Tanggal Pengesahan/Unggah:</span>
                  <span className="col-span-2 text-slate-700">{doc.uploadDate}</span>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <span>
                  Dokumen ini telah tercatat secara resmi dalam basis data SIMPEG UPT Puskesmas Boganatar. Anda dapat mengunggah berkas PDF baru kapan saja melalui formulir edit pegawai.
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-200 text-xs">
                <div className="text-[11px] text-slate-400">
                  Diperiksa secara sistematis &bull; SIMPEG v2.4
                </div>
                <div className="text-right">
                  <p className="text-[11px] text-slate-500">Kringa, {doc.uploadDate}</p>
                  <p className="font-bold text-slate-800 mt-1">Kepala UPT Puskesmas Boganatar</p>
                  <p className="font-semibold text-blue-900 mt-4 underline">Cristiana Lensi, S.KM</p>
                  <p className="text-[10px] font-mono text-slate-500">NIP. 19750403 200112 2 003</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          <div className="text-xs text-slate-500">
            Berkas: <span className="font-mono font-semibold text-slate-700">{doc.fileName}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Unduh PDF</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
