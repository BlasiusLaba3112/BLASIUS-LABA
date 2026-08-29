import React, { useRef } from 'react';
import { 
  X, 
  Printer, 
  Building2, 
  User, 
  Layers, 
  Calendar, 
  MapPin, 
  Phone,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { OrganizationStructureData } from '../types/profileTerritory';
import { PuskesmasInfo } from '../types/employee';
import { DEFAULT_ORGANIZATION_STRUCTURE } from '../data/initialProfileTerritoryData';

interface PrintOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  structureData?: OrganizationStructureData;
  puskesmasInfo: PuskesmasInfo;
}

export const PrintOrganizationModal: React.FC<PrintOrganizationModalProps> = ({
  isOpen,
  onClose,
  structureData,
  puskesmasInfo
}) => {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const data = structureData || DEFAULT_ORGANIZATION_STRUCTURE;

  const handlePrint = () => {
    window.print();
  };

  // Color mapping helper for cluster cards
  const getClusterBorder = (code: string) => {
    switch (code) {
      case 'KLASTER_1': return 'border-blue-500 bg-blue-50/30';
      case 'KLASTER_2': return 'border-rose-500 bg-rose-50/30';
      case 'KLASTER_3': return 'border-amber-500 bg-amber-50/30';
      case 'KLASTER_4': return 'border-emerald-500 bg-emerald-50/30';
      default: return 'border-indigo-500 bg-indigo-50/30';
    }
  };

  const getClusterBadge = (code: string) => {
    switch (code) {
      case 'KLASTER_1': return 'bg-blue-600 text-white';
      case 'KLASTER_2': return 'bg-rose-600 text-white';
      case 'KLASTER_3': return 'bg-amber-600 text-white';
      case 'KLASTER_4': return 'bg-emerald-600 text-white';
      default: return 'bg-indigo-600 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-6xl overflow-hidden flex flex-col max-h-[95vh] print:max-h-none print:shadow-none print:border-none print:rounded-none">
        {/* Modal Controls (Hidden in Print) */}
        <div className="bg-slate-900 text-white px-5 py-3.5 flex items-center justify-between border-b border-slate-800 shrink-0 print:hidden">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-white">
                Pratinjau Cetak Bagan Struktur Organisasi Puskesmas
              </h3>
              <p className="text-[11px] text-slate-400">
                Format Landscape A4 / F4 untuk papan pengumuman & arsip dokumen akreditasi
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/30"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div 
          ref={printRef}
          id="printable-organization-chart"
          className="flex-1 overflow-y-auto p-6 sm:p-8 bg-white text-slate-900 print:p-0 print:overflow-visible print:text-black font-sans text-xs"
        >
          {/* Formal Letterhead (KOP SURAT) */}
          <div className="border-b-[3px] border-double border-slate-900 pb-3 mb-5 flex items-center justify-between relative">
            <div className="w-20 h-20 shrink-0 flex items-center justify-center">
              <img 
                src="https://iili.io/CmDvGdQ.png" 
                alt="Logo Sikka"
                className="w-16 h-16 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  if (!target.dataset.triedJpg) {
                    target.dataset.triedJpg = 'true';
                    target.src = 'https://iili.io/CmDvGdQ.jpg';
                  } else if (!target.dataset.triedWiki) {
                    target.dataset.triedWiki = 'true';
                    target.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Lambang_Kabupaten_Sikka.png/480px-Lambang_Kabupaten_Sikka.png';
                  }
                }}
              />
            </div>
            <div className="flex-1 px-3 text-center space-y-0.5">
              <h4 className="text-xs sm:text-sm font-bold tracking-wider text-slate-900 uppercase">
                PEMERINTAH KABUPATEN SIKKA
              </h4>
              <h4 className="text-xs sm:text-sm font-bold tracking-wider text-slate-900 uppercase">
                DINAS KESEHATAN
              </h4>
              <h2 className="text-sm sm:text-base font-black tracking-wide text-slate-950 uppercase pt-0.5">
                UPT PUSKESMAS BOGANATAR
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-700 leading-tight pt-1">
                Jalan Raya Maumere – Larantuka KM. 65. Kode Pos: 86183. Tlp : 082341777140
              </p>
              <p className="text-[10px] sm:text-[11px] text-slate-700 leading-tight">
                Pos Elektronik : boganatarpkm@gmail.com , Web : -
              </p>
            </div>
            <div className="w-20 h-20 shrink-0" />
          </div>

          {/* Title Header */}
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-sm sm:text-base font-black tracking-wide uppercase text-slate-900 underline decoration-slate-400 underline-offset-4">
              {data.title}
            </h1>
            <p className="text-[11px] font-bold text-blue-800 uppercase">
              {data.subtitle || 'Manajemen Klaster Integrasi Layanan Primer (ILP)'} &bull; TAHUN {data.year}
            </p>
          </div>

          {/* Top Leader Box (Kepala Puskesmas) */}
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-md bg-slate-900 text-white rounded-xl p-3.5 text-center shadow-md border border-slate-800 relative">
              <div className="inline-block px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase mb-1 tracking-wider">
                {data.headOfPuskesmas.title}
              </div>
              <h3 className="text-sm font-black text-white">
                {data.headOfPuskesmas.name}
              </h3>
              <p className="text-[10px] font-mono text-slate-300 font-medium">
                NIP. {data.headOfPuskesmas.nip}
              </p>
            </div>
          </div>

          {/* 5 Clusters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5 items-start">
            {data.clusters.map((cluster, cIdx) => (
              <div 
                key={cluster.id || cIdx}
                className={`rounded-xl border p-3 flex flex-col justify-between space-y-2.5 h-full ${getClusterBorder(cluster.code)}`}
              >
                {/* Cluster Header */}
                <div className="space-y-1.5 pb-2 border-b border-slate-200">
                  <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase text-center ${getClusterBadge(cluster.code)}`}>
                    {cluster.shortTitle}
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-2xs text-center">
                    <span className="text-[8px] font-bold text-slate-500 uppercase block">Koordinator / PJ Klaster:</span>
                    <strong className="text-[10px] font-bold text-slate-900 leading-tight block">
                      {cluster.coordinator.name}
                    </strong>
                  </div>
                </div>

                {/* Units List */}
                <div className="space-y-1.5 flex-1">
                  {cluster.units.map((unit, uIdx) => (
                    <div 
                      key={unit.id || uIdx}
                      className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-2xs space-y-0.5"
                    >
                      <div className="text-[9px] font-bold text-slate-800 leading-snug">
                        {unit.name}
                      </div>
                      <div className="text-[9px] font-semibold text-blue-700">
                        {unit.personInCharge || '-'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Formal Signature & Footer Block */}
          <div className="mt-8 pt-4 border-t border-slate-300 flex justify-between items-end break-inside-avoid">
            <div className="text-[10px] text-slate-500 space-y-1">
              <p>Dokumen Resmi Tata Kelola & Struktur Organisasi UPT Puskesmas Boganatar</p>
              <p className="font-mono text-[9px]">Dicetak dari SIMPEG Terpadu pada: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>

            <div className="text-center w-64 space-y-1">
              <p className="text-[11px] text-slate-700">
                Kringa, {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
              <p className="text-[11px] font-bold text-slate-900">
                Kepala UPT Puskesmas Boganatar
              </p>
              <div className="h-14 flex items-center justify-center">
                <span className="text-[10px] text-slate-400 italic">(Tanda Tangan & Cap Resmi)</span>
              </div>
              <p className="text-[11px] font-bold text-slate-900 underline">
                {data.headOfPuskesmas.name}
              </p>
              <p className="text-[10px] font-mono text-slate-600">
                NIP. {data.headOfPuskesmas.nip}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
