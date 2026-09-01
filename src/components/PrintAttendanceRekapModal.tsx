/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Printer, X, FileSpreadsheet } from 'lucide-react';
import { EmployeeMonthlyAttendance } from '../types/attendance';
import { PuskesmasInfo } from '../types/employee';
import { printDocumentElement } from '../utils/printDocument';

interface PrintAttendanceRekapModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceList: EmployeeMonthlyAttendance[];
  monthName: string;
  year: number;
  puskesmasInfo: PuskesmasInfo;
}

export const PrintAttendanceRekapModal: React.FC<PrintAttendanceRekapModalProps> = ({
  isOpen,
  onClose,
  attendanceList,
  monthName,
  year,
  puskesmasInfo
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    printDocumentElement('printable-attendance-rekap', {
      title: `Rekapitulasi Kehadiran Pegawai - Bulan ${monthName} ${year} - ${puskesmasInfo.fullName}`,
      landscape: true
    });
  };

  // Compute total aggregates
  const totalEmployees = attendanceList.length;
  const avgPercentage = totalEmployees > 0
    ? Math.round(attendanceList.reduce((acc, curr) => acc + curr.summary.attendancePercentage, 0) / totalEmployees)
    : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 print:p-0 print:static print:bg-white print:overflow-visible">
      <div 
        id="modal-print-attendance-rekap"
        className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-5xl max-h-[96vh] overflow-y-auto flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none print:overflow-visible"
      >
        {/* Floating Toolbar */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shadow-md print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <FileSpreadsheet className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white">
                Cetak Rekapitulasi Presensi Kehadiran Seluruh Pegawai
              </span>
              <p className="text-[11px] text-slate-400">
                Bulan {monthName} {year} &bull; Total {totalEmployees} Personel &bull; Format Landscape A4
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-2xs transition-all cursor-pointer"
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

        {/* Printable Area */}
        <div 
          id="printable-attendance-rekap"
          className="p-8 sm:p-12 text-slate-900 bg-white font-sans print:p-4 print:m-0"
        >
          {/* KOP SURAT RESMI */}
          <div className="border-b-4 border-double border-slate-900 pb-3 mb-4 relative min-h-[95px] flex items-center justify-between">
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

          <div className="text-center mb-4">
            <h2 className="text-base font-bold uppercase underline text-slate-900">
              REKAPITULASI DAFTAR HADIR DAN PRESENSI PEGAWAI
            </h2>
            <p className="text-xs text-slate-700 mt-0.5">
              BULAN {monthName.toUpperCase()} TAHUN {year} &bull; Rata-rata Kehadiran: <strong className="text-emerald-700">{avgPercentage}%</strong>
            </p>
          </div>

          {/* Table */}
          <table className="w-full border-collapse border border-slate-400 text-[11px] print:text-[9.5px]">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400 text-slate-900 font-bold text-center">
                <th className="border border-slate-400 p-2 w-8">No</th>
                <th className="border border-slate-400 p-2 text-left">Nama Pegawai / NIP</th>
                <th className="border border-slate-400 p-2">Status / Gol</th>
                <th className="border border-slate-400 p-2 text-left">Jabatan</th>
                <th className="border border-slate-400 p-2 w-10">H</th>
                <th className="border border-slate-400 p-2 w-10">TK BOK</th>
                <th className="border border-slate-400 p-2 w-10">TK DIN</th>
                <th className="border border-slate-400 p-2 w-10">S</th>
                <th className="border border-slate-400 p-2 w-10">I</th>
                <th className="border border-slate-400 p-2 w-10">C</th>
                <th className="border border-slate-400 p-2 w-10">TK</th>
                <th className="border border-slate-400 p-2 w-16">Persentase</th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((item, idx) => (
                <tr key={item.id} className="border-b border-slate-300">
                  <td className="border border-slate-400 p-1.5 text-center font-medium">{idx + 1}</td>
                  <td className="border border-slate-400 p-1.5">
                    <div className="font-bold text-slate-900">{item.employeeName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">NIP: {item.nip}</div>
                  </td>
                  <td className="border border-slate-400 p-1.5 text-center">
                    <div className="font-semibold">{item.employmentStatus}</div>
                    <div className="text-[10px] text-slate-500">{item.rankGrade || '-'}</div>
                  </td>
                  <td className="border border-slate-400 p-1.5">{item.jobTitle}</td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono font-bold text-emerald-700">
                    {item.summary.hCount}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono text-cyan-700">
                    {item.summary.tkBokCount}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono text-blue-700">
                    {item.summary.tkDinkesCount}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono text-amber-700">
                    {item.summary.sCount}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono text-purple-700">
                    {item.summary.iCount}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono text-indigo-700">
                    {item.summary.cCount}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono font-bold text-rose-700">
                    {item.summary.tkCount}
                  </td>
                  <td className="border border-slate-400 p-1.5 text-center font-mono font-black text-slate-900">
                    {item.summary.attendancePercentage}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Signature */}
          <div className="mt-8 flex justify-end">
            <div className="text-center w-72 text-xs">
              <div>Kringa, 01 {monthName} {year}</div>
              <div className="font-semibold mt-0.5">Kepala UPT Puskesmas Boganatar</div>
              <div className="h-16 flex items-center justify-center"></div>
              <div className="font-bold underline uppercase">Christiana Lensi,S.KM</div>
              <div>Penata TK 1, III/d</div>
              <div className="font-mono">NIP.19750403 200112 2 003</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
