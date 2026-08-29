import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Building2, 
  MapPin, 
  Users, 
  HeartHandshake
} from 'lucide-react';
import { PuskesmasProfileData } from '../types/profileTerritory';
import { PuskesmasInfo } from '../types/employee';
import { printDocumentElement } from '../utils/printDocument';

interface PrintProfileTerritoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: PuskesmasProfileData;
  puskesmasInfo: PuskesmasInfo;
}

export const PrintProfileTerritoryModal: React.FC<PrintProfileTerritoryModalProps> = ({
  isOpen,
  onClose,
  profileData,
  puskesmasInfo
}) => {
  const printContentRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    printDocumentElement('printable-profile-territory-content', {
      title: `Profil dan Data Wilayah 5 Desa - ${puskesmasInfo.fullName}`,
      landscape: false
    });
  };

  // Calculations for totals
  const totalArea = profileData.villages.reduce((acc, v) => acc + v.areaKm2, 0);
  const totalKK = profileData.villages.reduce((acc, v) => acc + v.population.familyCount, 0);
  const totalMale = profileData.villages.reduce((acc, v) => acc + v.population.maleCount, 0);
  const totalFemale = profileData.villages.reduce((acc, v) => acc + v.population.femaleCount, 0);
  const totalJiwa = profileData.villages.reduce((acc, v) => acc + v.population.totalPopulation, 0);
  const totalBayi = profileData.villages.reduce((acc, v) => acc + v.population.infantCount, 0);
  const totalBalita = profileData.villages.reduce((acc, v) => acc + v.population.toddlerCount, 0);
  const totalRemaja = profileData.villages.reduce((acc, v) => acc + (v.population.youthCount || 0), 0);
  const totalUsiaProduktif = profileData.villages.reduce((acc, v) => acc + (v.population.productiveAgeCount || 0), 0);
  const totalPUS = profileData.villages.reduce((acc, v) => acc + (v.population.pusCount || 0), 0);
  const totalWUS = profileData.villages.reduce((acc, v) => acc + (v.population.wusCount || 0), 0);
  const totalBumil = profileData.villages.reduce((acc, v) => acc + v.population.pregnantMotherCount, 0);
  const totalBufas = profileData.villages.reduce((acc, v) => acc + v.population.nursingMotherCount, 0);
  const totalLansia = profileData.villages.reduce((acc, v) => acc + v.population.elderlyCount, 0);
  const totalBPJS = profileData.villages.reduce((acc, v) => acc + v.population.bpjsCoveredCount, 0);
  const totalPosyandu = profileData.villages.reduce((acc, v) => acc + v.posyanduList.length, 0);
  const totalKader = profileData.villages.reduce(
    (acc, v) => acc + v.posyanduList.reduce((sum, p) => sum + p.cadreCount, 0),
    0
  );

  const currentDateFormatted = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:static print:bg-white">
      <div 
        id="modal-print-profile-territory"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl max-h-[96vh] flex flex-col overflow-hidden print:max-h-none print:h-auto print:border-none print:shadow-none print:rounded-none"
      >
        {/* Modal Toolbar (Hidden during print) */}
        <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 print:hidden">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white">
                Cetak Dokumen Resmi Profil, Visi Misi & Wilayah Kerja 5 Desa
              </h2>
              <p className="text-xs text-slate-400">
                Format Standar Laporan Eksekutif UPT Puskesmas Boganatar &bull; Dinkes Kab. Sikka
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              id="btn-trigger-print-profile"
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang (Print / PDF)</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div className="p-6 sm:p-10 overflow-y-auto max-h-[85vh] print:max-h-none print:p-0 bg-white font-sans text-slate-900 leading-normal">
          <div 
            id="printable-profile-territory-content"
            ref={printContentRef} 
            className="max-w-4xl mx-auto space-y-6 print:space-y-6"
          >
            
            {/* KOP SURAT RESMI */}
            <div className="border-b-[3px] border-double border-black pb-4 relative min-h-[95px] flex items-center justify-between">
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
                <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-slate-900 leading-tight">
                  PEMERINTAH KABUPATEN SIKKA
                </h3>
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wide text-slate-900 leading-tight">
                  DINAS KESEHATAN
                </h2>
                <h1 className="text-lg sm:text-xl font-black uppercase tracking-tight text-slate-950 leading-tight mt-0.5">
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

            {/* JUDUL DOKUMEN */}
            <div className="text-center pt-2">
              <h2 className="text-base sm:text-lg font-black tracking-wide uppercase underline text-slate-900">
                PROFIL, VISI MISI, TATA NILAI DAN WILAYAH KERJA 5 DESA
              </h2>
              <p className="text-xs font-semibold text-slate-700 mt-0.5 uppercase tracking-wider">
                UPT PUSKESMAS BOGANATAR KECAMATAN TALIBURA KABUPATEN SIKKA
              </p>
            </div>

            {/* BAGIAN 1: PROFIL, VISI, MISI & TATA NILAI */}
            <div className="space-y-4">
              <div className="bg-slate-50 print:bg-slate-50/50 p-4 rounded-xl border border-slate-300">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 mb-2 pb-1 border-b border-slate-200">
                  <Building2 className="w-4 h-4 text-blue-700" />
                  <span>I. GAMBARAN UMUM & PROFIL PUSKESMAS</span>
                </h3>
                <p className="text-xs text-slate-800 text-justify leading-relaxed">
                  {profileData.overview}
                </p>
                <div className="mt-2 text-xs text-slate-700">
                  <strong>Jam Layanan:</strong> {profileData.serviceHours}
                </div>
              </div>

              {/* VISI & MISI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50/40 border border-blue-200 rounded-xl">
                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <span>A. VISI</span>
                  </h4>
                  <p className="text-xs font-bold text-slate-900 italic text-justify leading-relaxed">
                    &quot;{profileData.vision}&quot;
                  </p>

                  <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider mt-4 mb-1">
                    <span>MOTTO PELAYANAN:</span>
                  </h4>
                  <p className="text-xs font-semibold text-emerald-800">
                    &quot;{profileData.motto}&quot;
                  </p>
                </div>

                <div className="p-4 bg-emerald-50/40 border border-emerald-200 rounded-xl">
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider mb-2">
                    <span>B. MISI PUSKESMAS</span>
                  </h4>
                  <ol className="text-xs text-slate-800 space-y-1.5 list-decimal pl-4 leading-relaxed">
                    {profileData.mission.map((m, i) => (
                      <li key={i}>{m}</li>
                    ))}
                  </ol>
                </div>
              </div>

              {/* TATA NILAI */}
              <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl">
                <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider mb-2">
                  <span>C. TATA NILAI BUDAYA KERJA ({profileData.coreValues.acronym})</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
                  {profileData.coreValues.points.map((pt, idx) => (
                    <div key={idx} className="p-2 bg-white border border-slate-200 rounded-lg flex items-start gap-2">
                      <span className="w-6 h-6 rounded-md bg-blue-700 text-white font-black text-xs flex items-center justify-center flex-shrink-0">
                        {pt.letter}
                      </span>
                      <div>
                        <strong className="text-slate-900 block">{pt.word}</strong>
                        <span className="text-[11px] text-slate-600 leading-tight">{pt.meaning}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FASILITAS & UNIT PELAYANAN PUSKESMAS */}
              {profileData.facilities && profileData.facilities.length > 0 && (
                <div className="p-4 bg-slate-50 border border-slate-300 rounded-xl">
                  <h4 className="text-xs font-bold text-slate-950 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>D. FASILITAS & UNIT PELAYANAN KESEHATAN</span>
                    <span className="text-[10px] font-mono text-slate-500 font-normal">
                      Total: {profileData.facilities.length} Unit
                    </span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {profileData.facilities.map((fac, idx) => (
                      <div key={idx} className="p-2 bg-white border border-slate-200 rounded-lg space-y-1">
                        <div className="flex items-start justify-between gap-1">
                          <strong className="text-slate-900 font-bold">{idx + 1}. {fac.name}</strong>
                          <span className="text-[9px] px-1.5 py-0.2 bg-slate-100 rounded text-slate-700 font-semibold border border-slate-200">
                            {fac.category || 'Pelayanan'}
                          </span>
                        </div>
                        {fac.operationalHours && (
                          <div className="text-[10px] text-amber-900 font-medium">
                            Jam: {fac.operationalHours}
                          </div>
                        )}
                        {fac.description && (
                          <p className="text-[10px] text-slate-600 leading-tight">
                            {fac.description}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* BAGIAN 2: MATRIKS WILAYAH KERJA 5 DESA & DATA KEPENDUDUKAN */}
            <div className="space-y-3 pt-2 page-break-before">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-slate-300">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>II. WILAYAH KERJA 5 DESA & MATRIKS DATA KEPENDUDUKAN / SASARAN KESEHATAN</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border-collapse border border-slate-400">
                  <thead className="bg-slate-100 text-slate-900 uppercase text-[10px] font-bold text-center">
                    <tr>
                      <th className="border border-slate-400 px-2 py-2 w-8" rowSpan={2}>No</th>
                      <th className="border border-slate-400 px-2 py-2" rowSpan={2}>Nama Desa</th>
                      <th className="border border-slate-400 px-2 py-2" rowSpan={2}>Kepala Desa</th>
                      <th className="border border-slate-400 px-2 py-2" rowSpan={2}>Luas (km²)</th>
                      <th className="border border-slate-400 px-2 py-2" rowSpan={2}>Jarak (km)</th>
                      <th className="border border-slate-400 px-2 py-2" colSpan={4}>Data Kependudukan (Jiwa)</th>
                      <th className="border border-slate-400 px-2 py-2" colSpan={8}>Sasaran Prioritas Kesehatan</th>
                      <th className="border border-slate-400 px-2 py-2" rowSpan={2}>BPJS (Jiwa)</th>
                      <th className="border border-slate-400 px-2 py-2" rowSpan={2}>Pos Pelayanan</th>
                    </tr>
                    <tr>
                      <th className="border border-slate-400 px-1 py-1">KK</th>
                      <th className="border border-slate-400 px-1 py-1">L</th>
                      <th className="border border-slate-400 px-1 py-1">P</th>
                      <th className="border border-slate-400 px-1 py-1 font-black bg-slate-200">Total</th>
                      <th className="border border-slate-400 px-1 py-1">Bayi (0-11 bln)</th>
                      <th className="border border-slate-400 px-1 py-1">Balita (12-60 bln)</th>
                      <th className="border border-slate-400 px-1 py-1">Bumil</th>
                      <th className="border border-slate-400 px-1 py-1">Remaja</th>
                      <th className="border border-slate-400 px-1 py-1">Usia Prod.</th>
                      <th className="border border-slate-400 px-1 py-1">PUS</th>
                      <th className="border border-slate-400 px-1 py-1">WUS</th>
                      <th className="border border-slate-400 px-1 py-1">Lansia</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300">
                    {profileData.villages.map((village, idx) => (
                      <tr key={village.id} className="hover:bg-slate-50">
                        <td className="border border-slate-400 px-2 py-1.5 text-center font-bold">{idx + 1}</td>
                        <td className="border border-slate-400 px-2 py-1.5 font-bold text-slate-900">{village.name}</td>
                        <td className="border border-slate-400 px-2 py-1.5">{village.headOfVillage}</td>
                        <td className="border border-slate-400 px-2 py-1.5 text-center">{village.areaKm2}</td>
                        <td className="border border-slate-400 px-2 py-1.5 text-center">{village.distanceToPuskesmasKm}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center">{village.population.familyCount.toLocaleString('id-ID')}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center">{village.population.maleCount.toLocaleString('id-ID')}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center">{village.population.femaleCount.toLocaleString('id-ID')}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center font-bold bg-slate-100">{village.population.totalPopulation.toLocaleString('id-ID')}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center">{village.population.infantCount}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center font-semibold">{village.population.toddlerCount}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center">{village.population.pregnantMotherCount}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center">{village.population.youthCount ?? '-'}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center">{village.population.productiveAgeCount ?? '-'}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center">{village.population.pusCount ?? '-'}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center">{village.population.wusCount ?? '-'}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center">{village.population.elderlyCount}</td>
                        <td className="border border-slate-400 px-1.5 py-1.5 text-center font-semibold text-emerald-800">{village.population.bpjsCoveredCount.toLocaleString('id-ID')}</td>
                        <td className="border border-slate-400 px-2 py-1.5 text-[11px]">{village.pustuPoskesdes}</td>
                      </tr>
                    ))}
                    {/* TOTAL ROW */}
                    <tr className="bg-slate-200 font-bold text-slate-950">
                      <td className="border border-slate-400 px-2 py-2 text-center" colSpan={3}>
                        TOTAL WILAYAH KERJA 5 DESA
                      </td>
                      <td className="border border-slate-400 px-2 py-2 text-center">{totalArea.toFixed(2)}</td>
                      <td className="border border-slate-400 px-2 py-2 text-center">-</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center">{totalKK.toLocaleString('id-ID')}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center">{totalMale.toLocaleString('id-ID')}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center">{totalFemale.toLocaleString('id-ID')}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center font-black bg-slate-300">{totalJiwa.toLocaleString('id-ID')}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center">{totalBayi}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center">{totalBalita}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center">{totalBumil}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center">{totalRemaja}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center">{totalUsiaProduktif}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center">{totalPUS}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center">{totalWUS}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center">{totalLansia}</td>
                      <td className="border border-slate-400 px-1.5 py-2 text-center text-emerald-900">{totalBPJS.toLocaleString('id-ID')}</td>
                      <td className="border border-slate-400 px-2 py-2 text-center">{totalPosyandu} Posyandu</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* BAGIAN 3: DAFTAR POSYANDU PER DESA */}
            <div className="space-y-3 pt-2 page-break-before">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 pb-1 border-b border-slate-300">
                <HeartHandshake className="w-4 h-4 text-pink-700" />
                <span>III. DAFTAR & SEBARAN POSYANDU DI 5 DESA BINAAN ({totalPosyandu} Posyandu &bull; {totalKader} Kader Aktif)</span>
              </h3>

              <div className="space-y-3">
                {profileData.villages.map((village) => (
                  <div key={village.id} className="border border-slate-300 rounded-lg overflow-hidden">
                    <div className="bg-slate-100 px-3 py-1.5 font-bold text-xs text-slate-900 flex items-center justify-between border-b border-slate-300">
                      <span>{village.name} ({village.posyanduList.length} Posyandu)</span>
                      <span className="text-[11px] font-normal text-slate-600">
                        Penanggung Jawab: {village.pustuStaff}
                      </span>
                    </div>
                    <table className="w-full text-[11px] text-left border-collapse">
                      <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="px-2.5 py-1.5 w-8 text-center">No</th>
                          <th className="px-2.5 py-1.5">Nama Posyandu</th>
                          <th className="px-2.5 py-1.5">Kategori</th>
                          <th className="px-2.5 py-1.5">Dusun / Lokasi</th>
                          <th className="px-2.5 py-1.5">Ketua Kader</th>
                          <th className="px-2.5 py-1.5 text-center">Kader</th>
                          <th className="px-2.5 py-1.5">Jadwal Buka</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {village.posyanduList.map((pos, pIdx) => (
                          <tr key={pos.id} className="hover:bg-slate-50/50">
                            <td className="px-2.5 py-1 text-center font-medium">{pIdx + 1}</td>
                            <td className="px-2.5 py-1 font-bold text-slate-900">{pos.name}</td>
                            <td className="px-2.5 py-1">
                              <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] font-medium text-slate-700">
                                {pos.category}
                              </span>
                            </td>
                            <td className="px-2.5 py-1">{pos.dusun} - {pos.address}</td>
                            <td className="px-2.5 py-1">{pos.headOfPosyandu} ({pos.phone || '-'})</td>
                            <td className="px-2.5 py-1 text-center font-bold">{pos.cadreCount} Orang</td>
                            <td className="px-2.5 py-1 font-medium text-blue-900">{pos.schedule}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>

            {/* LEMBAR PENGESAHAN & TANDA TANGAN */}
            <div className="pt-6 flex justify-end page-break-inside-avoid">
              <div className="w-80 text-center text-xs space-y-1">
                <p className="text-slate-800">
                  Kringa, {currentDateFormatted}
                </p>
                <p className="font-bold text-slate-900">
                  Kepala UPT Puskesmas Boganatar
                </p>
                <div className="h-20 flex items-center justify-center">
                  <div className="border border-dashed border-slate-300 rounded px-4 py-1 text-[10px] text-slate-400">
                    [ Tanda Tangan & Stempel Resmi ]
                  </div>
                </div>
                <p className="font-bold text-slate-950 underline tracking-wide">
                  {puskesmasInfo.headOfPuskesmas.name}
                </p>
                <p className="text-slate-800 text-[11px]">
                  {puskesmasInfo.headOfPuskesmas.rankGrade || 'Pembina TK.1 /III d'}
                </p>
                <p className="text-slate-700 text-[11px] font-mono">
                  NIP. {puskesmasInfo.headOfPuskesmas.nip}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Footer info in Modal */}
        <div className="px-6 py-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 print:hidden">
          <span>Siap dicetak pada ukuran kertas A4 / Folio Landscape</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
