/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Printer, X, Download, Calendar, FileEdit, CheckSquare } from 'lucide-react';
import { EmployeeMonthlyAttendance } from '../types/attendance';
import { printDocumentElement } from '../utils/printDocument';

interface PrintAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  attendanceData: EmployeeMonthlyAttendance | null;
}

export const PrintAttendanceModal: React.FC<PrintAttendanceModalProps> = ({
  isOpen,
  onClose,
  attendanceData
}) => {
  const [isManualBlankMode, setIsManualBlankMode] = useState(false);

  if (!isOpen || !attendanceData) return null;

  const handlePrint = () => {
    printDocumentElement('printable-attendance-form', {
      title: `Daftar Hadir - ${attendanceData.employeeName} - ${attendanceData.monthName} ${attendanceData.year}${isManualBlankMode ? ' - Format Manual' : ''}`,
      landscape: false
    });
  };

  const {
    employeeName,
    nip,
    employmentStatus,
    rankGrade,
    jobTitle,
    monthName,
    year,
    dailyRecords,
    summary,
    signedLocation,
    signedDate,
    headName,
    headRank,
    headNip
  } = attendanceData;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 print:p-0 print:static print:bg-white print:overflow-visible">
      <div 
        id="modal-print-attendance"
        className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[96vh] overflow-y-auto flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none print:overflow-visible"
      >
        {/* Floating Action Toolbar */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white block">
                Cetak Lembar Daftar Hadir Pegawai (Format Resmi PDF)
              </span>
              <p className="text-[11px] text-slate-400">
                {employeeName} &bull; Bulan {monthName} {year} &bull; Pas 1 Lembar A4 Portrait
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Toggle Mode: Terisi Digital vs Blanko Manual */}
            <div className="bg-slate-800 p-1 rounded-xl flex items-center gap-1 border border-slate-700 text-xs">
              <button
                type="button"
                onClick={() => setIsManualBlankMode(false)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  !isManualBlankMode ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" />
                <span>Terisi Digital</span>
              </button>
              <button
                type="button"
                onClick={() => setIsManualBlankMode(true)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isManualBlankMode ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
                title="Kosongkan seluruh isian tabel agar siap diisi dan ditulis tangan manual"
              >
                <FileEdit className="w-3.5 h-3.5" />
                <span>Blanko Manual (Tulis Tangan)</span>
              </button>
            </div>

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang </span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              title="Tutup"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Official Sheet matching the PDF layout 100% */}
        <div 
          id="printable-attendance-form"
          className="p-6 sm:p-10 text-black bg-white font-sans text-xs leading-tight print:p-2 print:m-0 print:w-full print:text-[10px]"
          style={{ fontFamily: '"Arial", "Helvetica", sans-serif' }}
        >
          {/* 1. KOP SURAT RESMI */}
          <div className="relative border-b-2 border-black pb-2 mb-2 min-h-[85px] flex items-center">
            {/* Logo Sikka */}
            <div className="absolute left-1 top-0 bottom-0 flex items-center justify-center">
              <img 
                src="/images/logo_kop.png" 
                alt="Logo Pemkab Sikka" 
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://iili.io/Cmfrfbj.png";
                }}
              />
            </div>

            {/* Teks Kop */}
            <div className="w-full text-center px-16">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black leading-tight">
                PEMERINTAH KABUPATEN SIKKA
              </h3>
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wide text-black leading-tight">
                DINAS KESEHATAN
              </h2>
              <h1 className="text-sm sm:text-base font-black uppercase tracking-wider text-black leading-tight mt-0.5">
                UPT PUSKESMAS BOGANATAR
              </h1>
              <p className="text-[10px] text-black mt-0.5">
                Jalan Raya Maumere – Larantuka, KM 65 KMKode Pos : 86183, Tlp ; 082341777140
              </p>
              <p className="text-[10px] text-black mt-0.5">
                Pos Elektonik : boganatar@gmail.com, Mobile :-
              </p>
            </div>
          </div>

          {/* 2. JUDUL DOKUMEN */}
          <div className="text-center my-1.5">
            <h2 className="text-xs sm:text-sm font-bold uppercase text-black tracking-wide">
              DAFTAR HADIR PEGAWAI
            </h2>
            <h3 className="text-xs sm:text-sm font-bold uppercase text-black">
              BULAN {monthName.toUpperCase()}
            </h3>
          </div>

          {/* 3. IDENTITAS PEGAWAI (BOX 2 KOLOM) */}
          <div className="border border-black p-2 mb-2 text-[11px] print:text-[9.5px]">
            <div className="grid grid-cols-2 gap-x-6 gap-y-0.5">
              {/* Kolom Kiri */}
              <div className="space-y-0.5">
                <div className="flex">
                  <span className="w-28 font-medium">Nama Pegawai</span>
                  <span className="mr-1">:</span>
                  <span className="font-bold uppercase">{employeeName || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-28 font-medium">NIP</span>
                  <span className="mr-1">:</span>
                  <span className="font-mono">{nip || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-28 font-medium">Jabatan</span>
                  <span className="mr-1">:</span>
                  <span>{jobTitle || '-'}</span>
                </div>
              </div>

              {/* Kolom Kanan */}
              <div className="space-y-0.5">
                <div className="flex">
                  <span className="w-32 font-medium">Status Pegawai</span>
                  <span className="mr-1">:</span>
                  <span className="font-semibold">{employmentStatus || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-medium">Pangkat/Golongan</span>
                  <span className="mr-1">:</span>
                  <span>{rankGrade || '-'}</span>
                </div>
                <div className="flex">
                  <span className="w-32 font-medium">Bulan/tahun</span>
                  <span className="mr-1">:</span>
                  <span>{monthName} / {year}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. TABEL PRESENSI KEHADIRAN (1 s.d. 31) */}
          <table className="w-full border-collapse border border-black text-[10px] print:text-[8.5px] text-center">
            <thead>
              <tr className="bg-slate-50 text-black font-bold">
                <th rowSpan={2} className="border border-black p-1 w-12 uppercase">
                  TANGGAL
                </th>
                <th colSpan={2} className="border border-black p-1 uppercase">
                  JAM
                </th>
                <th colSpan={7} className="border border-black p-1 uppercase">
                  PRESENSI KEHADIRAN
                </th>
                <th rowSpan={2} className="border border-black p-1 w-24 uppercase">
                  PARAF
                </th>
              </tr>
              <tr className="bg-slate-50 text-black font-bold text-[9px] print:text-[8px]">
                <th className="border border-black p-1 w-14 font-semibold text-center">
                  Masuk<br /><span className="text-[8px] font-normal">08.00</span>
                </th>
                <th className="border border-black p-1 w-14 font-semibold text-center">
                  Keluar<br /><span className="text-[8px] font-normal">14.00</span>
                </th>
                <th className="border border-black p-1 w-9">H</th>
                <th className="border border-black p-1 w-12">TK BOK</th>
                <th className="border border-black p-1 w-14">TK DINKES</th>
                <th className="border border-black p-1 w-9">S</th>
                <th className="border border-black p-1 w-9">I</th>
                <th className="border border-black p-1 w-9">C</th>
                <th className="border border-black p-1 w-9">TK</th>
              </tr>
            </thead>
            <tbody>
              {dailyRecords.map((record) => {
                const isSunday = record.isSunday;
                const status = record.status;

                return (
                  <tr 
                    key={record.day} 
                    className={`h-[18px] print:h-[15.5px] ${isSunday ? 'bg-slate-100/70 text-slate-500' : ''}`}
                  >
                    <td className="border border-black p-0 font-bold text-center">
                      {record.day}
                    </td>
                    <td className="border border-black p-0 font-mono text-[9px] print:text-[8px] text-center">
                      {isManualBlankMode ? '' : (record.checkInTime || '')}
                    </td>
                    <td className="border border-black p-0 font-mono text-[9px] print:text-[8px] text-center">
                      {isManualBlankMode ? '' : (record.checkOutTime || '')}
                    </td>
                    {/* H */}
                    <td className="border border-black p-0 font-bold text-center">
                      {!isManualBlankMode && status === 'H' ? '✓' : ''}
                    </td>
                    {/* TK BOK */}
                    <td className="border border-black p-0 font-bold text-center">
                      {!isManualBlankMode && status === 'TK_BOK' ? '✓' : ''}
                    </td>
                    {/* TK DINKES */}
                    <td className="border border-black p-0 font-bold text-center">
                      {!isManualBlankMode && status === 'TK_DINKES' ? '✓' : ''}
                    </td>
                    {/* S */}
                    <td className="border border-black p-0 font-bold text-center">
                      {!isManualBlankMode && status === 'S' ? '✓' : ''}
                    </td>
                    {/* I */}
                    <td className="border border-black p-0 font-bold text-center">
                      {!isManualBlankMode && status === 'I' ? '✓' : ''}
                    </td>
                    {/* C */}
                    <td className="border border-black p-0 font-bold text-center">
                      {!isManualBlankMode && status === 'C' ? '✓' : ''}
                    </td>
                    {/* TK */}
                    <td className="border border-black p-0 font-bold text-center">
                      {!isManualBlankMode && status === 'TK' ? '✓' : ''}
                    </td>
                    {/* PARAF */}
                    <td className="border border-black p-0 text-center text-[9px] font-mono">
                      {!isManualBlankMode && (status === 'H' || status === 'TK_BOK' || status === 'TK_DINKES') ? (
                        <span className="text-black font-serif italic text-[10px]">✓</span>
                      ) : (
                        ''
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* 5. NB / CATATAN KAKI */}
          <div className="mt-1 text-[9px] print:text-[8px] font-bold text-black uppercase">
            NB.DI CENTANG PADA KOTAK PRESENSI KEHADIRAN
          </div>

          {/* 6. TABEL REKAPITULASI KEHADIRAN */}
          <div className="mt-1.5">
            <table className="w-full border-collapse border border-black text-[9.5px] print:text-[8.5px] text-center">
              <thead>
                <tr className="bg-slate-50 font-bold">
                  <th className="border border-black p-1 w-32 uppercase">
                    REKAPITULASI KEHADIRAN
                  </th>
                  <th className="border border-black p-1 w-12">H</th>
                  <th className="border border-black p-1 w-12">TL</th>
                  <th className="border border-black p-1 w-12">S</th>
                  <th className="border border-black p-1 w-12">I</th>
                  <th className="border border-black p-1 w-12">C</th>
                  <th className="border border-black p-1 w-12">TK</th>
                  <th className="border border-black p-1 w-36 uppercase">
                    PERSENTASI KEHADIRAN
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="font-bold h-6 print:h-5">
                  <td className="border border-black p-1 text-slate-500 font-normal">
                    Total
                  </td>
                  <td className="border border-black p-1 font-mono">{isManualBlankMode ? '' : summary.hCount}</td>
                  <td className="border border-black p-1 font-mono">{isManualBlankMode ? '' : summary.tlCount}</td>
                  <td className="border border-black p-1 font-mono">{isManualBlankMode ? '' : summary.sCount}</td>
                  <td className="border border-black p-1 font-mono">{isManualBlankMode ? '' : summary.iCount}</td>
                  <td className="border border-black p-1 font-mono">{isManualBlankMode ? '' : summary.cCount}</td>
                  <td className="border border-black p-1 font-mono">{isManualBlankMode ? '' : summary.tkCount}</td>
                  <td className="border border-black p-1 font-mono text-sm print:text-xs">
                    {isManualBlankMode ? '' : `${summary.attendancePercentage}%`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* 7. PENGESAHAN KEPALA PUSKESMAS (KANAN BAWAH) */}
          <div className="mt-4 flex justify-end print:mt-3">
            <div className="text-center w-72 text-[10.5px] print:text-[9px]">
              <div>
                {signedLocation || 'Kringa'}, {signedDate || `01 ${monthName} ${year}`}
              </div>
              <div className="font-semibold mt-0.5">
                Kepala UPT Puskesmas Boganatar
              </div>

              {/* Tanda Tangan / Cap Spacing */}
              <div className="h-16 flex items-center justify-center">
                {/* Space for signature */}
              </div>

              <div className="font-bold underline text-black uppercase">
                {headName || 'Christiana Lensi,S.KM'}
              </div>
              <div>{headRank || 'Penata TK 1, III/d'}</div>
              <div className="font-mono">{headNip || 'NIP.19750403 200112 2 003'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
