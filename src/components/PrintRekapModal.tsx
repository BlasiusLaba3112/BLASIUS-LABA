import React from 'react';
import { Printer, X } from 'lucide-react';
import { Employee, PuskesmasInfo } from '../types/employee';
import { formatDateIndonesian } from '../utils/helpers';
import { printDocumentElement } from '../utils/printDocument';

interface PrintRekapModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  puskesmasInfo: PuskesmasInfo;
}

export const PrintRekapModal: React.FC<PrintRekapModalProps> = ({
  isOpen,
  onClose,
  employees,
  puskesmasInfo
}) => {
  if (!isOpen) return null;

  const todayIndo = formatDateIndonesian(new Date().toISOString().split('T')[0]);

  const handlePrint = () => {
    printDocumentElement('printable-rekap-content', {
      title: `Rekapitulasi Daftar Pegawai - ${puskesmasInfo.fullName}`,
      landscape: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 print:p-0 print:static print:bg-white print:overflow-visible">
      <div 
        id="modal-print-rekap"
        className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl max-h-[96vh] overflow-y-auto flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none print:overflow-visible"
      >
        {/* Floating Toolbar */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shadow-md print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white">Cetak Rekapitulasi Daftar Pegawai UPT Puskesmas Boganatar</span>
              <p className="text-[11px] text-slate-400">Daftar Roster Personel Lengkap &bull; Cetak A4 Landscape</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Pilih Printer</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div 
          id="printable-rekap-content"
          className="p-8 sm:p-12 text-slate-900 bg-white font-sans print:p-6 print:m-0"
        >
          {/* KOP SURAT */}
          <div className="border-b-4 border-double border-slate-900 pb-3 mb-6 relative min-h-[95px] flex items-center justify-between">
            {/* LOGO KOP SURAT (KIRI) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center pl-1">
              <img 
                src="/images/logo_kop.png" 
                alt="Logo Kop Surat" 
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://iili.io/Cmfrfbj.png";
                }}
              />
            </div>

            {/* TEKS KOP SURAT (TENGAH) */}
            <div className="w-full text-center px-16 sm:px-24">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-widest text-slate-900 leading-tight">
                PEMERINTAH KABUPATEN SIKKA
              </h3>
              <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide text-slate-900 leading-tight">
                DINAS KESEHATAN
              </h2>
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider text-slate-900 leading-tight mt-0.5">
                UPT PUSKESMAS BOGANATAR
              </h1>
              <p className="text-[11px] text-slate-700 mt-1">
                Jalan Raya Maumere – Larantuka, KM 65 KMKode Pos : 86183, Tlp ; 082341777140
              </p>
              <p className="text-[11px] text-slate-700 mt-0.5">
                Pos Elektonik : boganatar@gmail.com, Mobile :-
              </p>
            </div>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-base font-bold uppercase underline text-slate-900">
              REKAPITULASI DAFTAR PEGAWAI DAN TENAGA KESEHATAN
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              Posisi Kepegawaian Per {todayIndo} &bull; Total Personel: {employees.length} Orang
            </p>
          </div>

          {/* Table */}
          <table className="w-full border-collapse border border-slate-400 text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400 text-slate-900 font-bold text-center">
                <th className="border border-slate-400 p-2 w-8">No</th>
                <th className="border border-slate-400 p-2 text-left">Nama Lengkap & NIP</th>
                <th className="border border-slate-400 p-2">Status / Gol</th>
                <th className="border border-slate-400 p-2 text-left">Jabatan & Unit Kerja</th>
                <th className="border border-slate-400 p-2 text-left">Pendidikan Terakhir</th>
                <th className="border border-slate-400 p-2">STR / SIP</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp, i) => (
                <tr key={emp.id} className="border-b border-slate-300">
                  <td className="border border-slate-400 p-2 text-center font-medium">{i + 1}</td>
                  <td className="border border-slate-400 p-2">
                    <div className="font-bold text-slate-900">{emp.fullName}</div>
                    <div className="text-[10px] text-slate-600 font-mono">{emp.nipType}: {emp.nip}</div>
                  </td>
                  <td className="border border-slate-400 p-2 text-center">
                    <span className="font-bold">{emp.employmentStatus}</span>
                    <div className="text-[10px] text-slate-600">{emp.rankGrade || '-'}</div>
                  </td>
                  <td className="border border-slate-400 p-2">
                    <div className="font-semibold text-slate-900">{emp.jobTitle}</div>
                    <div className="text-[11px] text-slate-700">{emp.department}</div>
                  </td>
                  <td className="border border-slate-400 p-2">
                    <div className="font-medium">{emp.educationLevel} {emp.major}</div>
                    <div className="text-[10px] text-slate-500">{emp.institution} ({emp.graduationYear})</div>
                  </td>
                  <td className="border border-slate-400 p-2 text-[10px] font-mono">
                    {emp.staffCategory === 'Nakes' ? (
                      <div>
                        <div>STR: {emp.strIsLifetime ? 'Seumur Hidup' : (emp.strExpiryDate || '-')}</div>
                        <div>SIP: {emp.sipExpiryDate || '-'}</div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Non-Nakes</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signature */}
          <div className="mt-8 pt-4 flex justify-end font-sans text-xs break-inside-avoid">
            <div className="w-64 text-center">
              <p className="text-slate-700">Kringa, {todayIndo}</p>
              <p className="text-slate-700 font-semibold mb-0.5">Mengetahui,</p>
              <p className="text-slate-900 font-bold text-xs mb-16">{puskesmasInfo.headOfPuskesmas.position}</p>

              <div className="border-b border-slate-800 font-bold text-slate-900 pb-0.5">
                {puskesmasInfo.headOfPuskesmas.name}
              </div>
              <p className="text-[11px] text-slate-800 mt-0.5">
                {puskesmasInfo.headOfPuskesmas.rankGrade || 'Pembina TK.1 /III d'}
              </p>
              <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                NIP. {puskesmasInfo.headOfPuskesmas.nip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
