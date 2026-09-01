import React, { useRef } from 'react';
import { Printer, X, Download, Target, CheckCircle2, ShieldCheck } from 'lucide-react';
import { SPMIndicator } from '../types/spm';
import { PuskesmasInfo } from '../types/employee';
import { formatDateIndonesian } from '../utils/helpers';
import { calculateSPMSummary } from '../data/initialSPMData';
import { printDocumentElement } from '../utils/printDocument';

interface PrintSPMModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicators: SPMIndicator[];
  puskesmasInfo: PuskesmasInfo;
}

export const PrintSPMModal: React.FC<PrintSPMModalProps> = ({
  isOpen,
  onClose,
  indicators,
  puskesmasInfo,
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const summary = calculateSPMSummary(indicators);
  const currentDate = formatDateIndonesian(new Date().toISOString().split('T')[0]);

  const handlePrint = () => {
    printDocumentElement('spm-print-document', {
      title: `Laporan Capaian 12 SPM Kesehatan - ${puskesmasInfo.fullName}`,
      landscape: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150 print:m-0 print:p-0 print:w-full print:max-w-none print:shadow-none print:rounded-none">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <Target className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white leading-tight">
                Cetak Laporan Resmi 12 Standar Pelayanan Minimal (SPM) Kesehatan
              </h2>
              <p className="text-xs text-slate-300">
                Format Resmi Dokumen Pelaporan Capaian Wilayah 5 Desa &bull; {puskesmasInfo.fullName}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100 print:p-0 print:bg-white">
          <div 
            ref={printRef}
            id="spm-print-document"
            className="max-w-[210mm] mx-auto bg-white p-6 sm:p-10 shadow-lg print:shadow-none print:p-6 print:m-0 font-sans text-slate-900 border border-slate-200 print:border-none"
          >
            {/* KOP SURAT RESMI */}
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

              {/* TEKS KOP SURAT RESMI (TENGAH) */}
              <div className="w-full text-center px-16 sm:px-24">
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-widest font-sans text-slate-900 leading-tight">
                  PEMERINTAH KABUPATEN SIKKA
                </h3>
                <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide font-sans text-slate-900 leading-tight">
                  DINAS KESEHATAN
                </h2>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider font-sans text-slate-950 leading-tight mt-0.5">
                  UPT PUSKESMAS BOGANATAR
                </h1>
                <p className="text-[11px] font-sans text-slate-700 mt-1">
                  Jalan Raya Maumere – Larantuka, KM 65 KMKode Pos : 86183, Tlp ; 082341777140
                </p>
                <p className="text-[11px] font-sans text-slate-700 mt-0.5">
                  Pos Elektonik : boganatar@gmail.com, Mobile :-
                </p>
              </div>
            </div>

            {/* DOKUMEN HEADER & TITLE */}
            <div className="text-center mb-6">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900 underline underline-offset-4">
                LAPORAN CAPAIAN 12 STANDAR PELAYANAN MINIMAL (SPM) KESEHATAN
              </h2>
              <p className="text-xs text-slate-700 font-semibold mt-1">
                Wilayah Kerja 5 Desa Binaan &bull; Kecamatan Talibura, Kabupaten Sikka &bull; Tahun 2026
              </p>
            </div>

            {/* RINGKASAN CAPAIAN (EXECUTIVE SUMMARY) */}
            <div className="grid grid-cols-4 gap-2 mb-6 text-center text-xs">
              <div className="border border-slate-300 p-2 rounded bg-slate-50">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Total Indikator</div>
                <div className="text-base font-black text-slate-900">{summary.totalIndicators} Indikator</div>
              </div>
              <div className="border border-slate-300 p-2 rounded bg-slate-50">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Rata-Rata Capaian</div>
                <div className="text-base font-black text-blue-700">{summary.averagePercentage}%</div>
              </div>
              <div className="border border-slate-300 p-2 rounded bg-slate-50">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Tercapai (≥100%)</div>
                <div className="text-base font-black text-emerald-700">{summary.achievedCount} Program</div>
              </div>
              <div className="border border-slate-300 p-2 rounded bg-slate-50">
                <div className="text-[10px] text-slate-500 font-bold uppercase">On Track / Baik</div>
                <div className="text-base font-black text-indigo-700">{summary.onTrackCount} Program</div>
              </div>
            </div>

            {/* TABEL MATRIKS 12 INDIKATOR SPM */}
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-left text-[10px] border-collapse border border-slate-400">
                <thead>
                  <tr className="bg-slate-200 text-slate-900 font-bold text-center border-b border-slate-400">
                    <th className="border border-slate-400 p-1.5 w-6">No</th>
                    <th className="border border-slate-400 p-1.5 text-left">Indikator Standar Pelayanan Minimal (SPM)</th>
                    <th className="border border-slate-400 p-1.5 w-16">Sasaran (Riil)</th>
                    <th className="border border-slate-400 p-1.5 w-16">Realisasi (Terlayani)</th>
                    <th className="border border-slate-400 p-1.5 w-12">Target</th>
                    <th className="border border-slate-400 p-1.5 w-14">Capaian (%)</th>
                    <th className="border border-slate-400 p-1.5 w-16">Status</th>
                    <th className="border border-slate-400 p-1.5 text-left w-32">Penanggung Jawab</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-300">
                  {indicators.map((ind) => (
                    <tr key={ind.id} className="hover:bg-slate-50">
                      <td className="border border-slate-400 p-1.5 text-center font-bold">{ind.number}</td>
                      <td className="border border-slate-400 p-1.5">
                        <div className="font-bold text-slate-900">{ind.shortTitle}</div>
                        <div className="text-[9px] text-slate-600 line-clamp-1">{ind.category}</div>
                      </td>
                      <td className="border border-slate-400 p-1.5 text-right font-medium">{ind.targetPopulation.toLocaleString('id-ID')}</td>
                      <td className="border border-slate-400 p-1.5 text-right font-bold text-slate-900">{ind.achievedCount.toLocaleString('id-ID')}</td>
                      <td className="border border-slate-400 p-1.5 text-center font-bold">100%</td>
                      <td className="border border-slate-400 p-1.5 text-right font-black text-slate-900">
                        {ind.percentage}%
                      </td>
                      <td className="border border-slate-400 p-1.5 text-center">
                        <span className={`px-1 py-0.5 rounded text-[8.5px] font-bold ${
                          ind.percentage >= 100 
                            ? 'bg-emerald-100 text-emerald-900' 
                            : ind.percentage >= 80 
                            ? 'bg-blue-100 text-blue-900' 
                            : 'bg-amber-100 text-amber-900'
                        }`}>
                          {ind.status}
                        </span>
                      </td>
                      <td className="border border-slate-400 p-1.5 text-[9px]">
                        <div className="font-semibold text-slate-900">{ind.picEmployeeName}</div>
                        <div className="text-slate-500">{ind.picPosition}</div>
                      </td>
                    </tr>
                  ))}
                  {/* Total Row */}
                  <tr className="bg-slate-100 font-black text-slate-900">
                    <td colSpan={2} className="border border-slate-400 p-2 text-center uppercase">
                      Rata-Rata Capaian SPM & Total Sasaran
                    </td>
                    <td className="border border-slate-400 p-2 text-right">
                      {summary.totalTargetAll.toLocaleString('id-ID')}
                    </td>
                    <td className="border border-slate-400 p-2 text-right">
                      {summary.totalAchievedAll.toLocaleString('id-ID')}
                    </td>
                    <td className="border border-slate-400 p-2 text-center">100%</td>
                    <td className="border border-slate-400 p-2 text-right text-blue-800">
                      {summary.averagePercentage}%
                    </td>
                    <td className="border border-slate-400 p-2 text-center text-emerald-800">
                      ON TRACK
                    </td>
                    <td className="border border-slate-400 p-2 text-[9px] text-slate-600">
                      Koordinator Terpadu UKM
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* TABEL RINCIAN PER DESA */}
            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2 border-b border-slate-300 pb-1">
                Matriks Capaian 12 SPM per 5 Desa Binaan
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[9px] border-collapse border border-slate-400">
                  <thead>
                    <tr className="bg-slate-100 text-slate-900 font-bold text-center border-b border-slate-400">
                      <th className="border border-slate-400 p-1 text-left">Indikator</th>
                      <th className="border border-slate-400 p-1 w-16">Ds. Kringa</th>
                      <th className="border border-slate-400 p-1 w-16">Ds. Timutawa</th>
                      <th className="border border-slate-400 p-1 w-16">Ds. Hikong</th>
                      <th className="border border-slate-400 p-1 w-16">Ds. Udek Duen</th>
                      <th className="border border-slate-400 p-1 w-16">Ds. Ojang</th>
                      <th className="border border-slate-400 p-1 w-16 font-black bg-slate-200">Total Puskesmas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {indicators.map((ind) => (
                      <tr key={`matrix-${ind.id}`}>
                        <td className="border border-slate-400 p-1 font-semibold text-slate-900">
                          {ind.number}. {ind.shortTitle}
                        </td>
                        {ind.villageBreakdown.map((vb) => (
                          <td key={vb.villageId} className="border border-slate-400 p-1 text-center">
                            <span className="font-bold">{vb.achievedCount}</span>/{vb.targetCount} ({vb.percentage}%)
                          </td>
                        ))}
                        <td className="border border-slate-400 p-1 text-center font-black bg-slate-50 text-blue-900">
                          {ind.percentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* LEMBAR PENGESAHAN / TANDA TANGAN RESMI */}
            <div className="mt-8 pt-4 border-t border-slate-300 text-xs font-sans">
              <div className="flex justify-between items-start">
                <div className="text-center w-64">
                  <p className="text-[11px] text-slate-700">Mengetahui,</p>
                  <p className="text-[11px] font-bold text-slate-900 uppercase">
                    Penanggung Jawab UKM & Koordinator SPM
                  </p>
                  <div className="h-20 flex items-center justify-center">
                    <span className="text-[10px] text-slate-300 italic">[Tanda Tangan & Cap]</span>
                  </div>
                  <p className="font-bold text-slate-900 underline text-xs">
                    Bernadus Boli, S.Kep, Ns
                  </p>
                  <p className="text-[10px] text-slate-600">NIP. 19840218 200904 1 003</p>
                </div>

                <div className="text-center w-64">
                  <p className="text-[11px] text-slate-700">
                    Kringa, {currentDate}
                  </p>
                  <p className="text-[11px] font-bold text-slate-900 uppercase">
                    Kepala UPT Puskesmas Boganatar
                  </p>
                  <div className="h-20 flex items-center justify-center">
                    <span className="text-[10px] text-slate-300 italic">[Tanda Tangan & Cap Puskesmas]</span>
                  </div>
                  <p className="font-bold text-slate-900 underline text-xs">
                    {puskesmasInfo.headOfPuskesmas.name}
                  </p>
                  <p className="text-[10px] text-slate-800">
                    {puskesmasInfo.headOfPuskesmas.rankGrade || 'Pembina TK.1 /III d'}
                  </p>
                  <p className="text-[10px] text-slate-600">
                    NIP. {puskesmasInfo.headOfPuskesmas.nip}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0 print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Tutup
          </button>
          <button
            onClick={handlePrint}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-xs cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Dokumen SPM</span>
          </button>
        </div>

      </div>
    </div>
  );
};
