import React from 'react';
import { 
  Target, 
  Sparkles, 
  HeartHandshake, 
  Edit, 
  Printer, 
  RotateCcw,
  Lock,
  Award,
  CheckCircle2,
  BookmarkCheck
} from 'lucide-react';
import { PuskesmasProfileData } from '../types/profileTerritory';
import { PuskesmasInfo } from '../types/employee';

interface VisionMissionViewProps {
  profileData: PuskesmasProfileData;
  puskesmasInfo: PuskesmasInfo;
  isAdmin?: boolean;
  onOpenEditProfile: () => void;
  onOpenPrintModal: () => void;
  onResetDefaultData: () => void;
}

export const VisionMissionView: React.FC<VisionMissionViewProps> = ({
  profileData,
  puskesmasInfo,
  isAdmin = false,
  onOpenEditProfile,
  onOpenPrintModal,
  onResetDefaultData
}) => {
  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner & Quick Action Header */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-semibold">
              <Target className="w-3.5 h-3.5" />
              <span>Arah Kebijakan &bull; UPT Puskesmas Boganatar</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Visi, Misi & Tata Nilai Puskesmas
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Landasan moral, komitmen mutu pelayanan kesehatan, dan budaya kerja seluruh tenaga kesehatan.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-edit-vision-mission-view"
              onClick={onOpenEditProfile}
              className={`px-3.5 py-2 border rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isAdmin 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border-amber-800/60'
              }`}
              title={isAdmin ? "Edit Visi, Misi & Nilai" : "Hanya Admin yang dapat mengedit data (Klik untuk Login)"}
            >
              {isAdmin ? <Edit className="w-4 h-4 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isAdmin ? 'Edit Visi & Misi' : 'Edit (Khusus Admin)'}</span>
            </button>

            <button
              id="btn-print-vision-mission-view"
              onClick={onOpenPrintModal}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Visi Misi</span>
            </button>
          </div>
        </div>
      </div>

      {/* Visi & Motto Utama */}
      <div className="bg-gradient-to-br from-emerald-950 via-slate-900 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-emerald-900/40 relative overflow-hidden">
        <div className="max-w-4xl space-y-4">
          <span className="px-3 py-1 bg-emerald-500/30 text-emerald-300 text-xs font-bold rounded-full border border-emerald-400/30 inline-flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5" />
            <span>VISI UPT PUSKESMAS BOGANATAR</span>
          </span>
          <h2 className="text-lg sm:text-2xl font-black italic tracking-wide leading-relaxed text-emerald-50">
            &quot;{profileData.vision}&quot;
          </h2>
          
          <div className="pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 block font-semibold">MOTTO PELAYANAN:</span>
              <span className="text-sm sm:text-base font-black text-amber-400 tracking-wide">
                &quot;{profileData.motto}&quot;
              </span>
            </div>
            {isAdmin && (
              <button
                onClick={onOpenEditProfile}
                className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1.5 self-start cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Ubah Visi / Motto</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Misi Section */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Misi UPT Puskesmas Boganatar
              </h3>
              <p className="text-xs text-slate-500">
                5 Pilar Komitmen Pelayanan Kesehatan Primer
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={onOpenEditProfile}
              className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Misi</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {profileData.mission.map((item, idx) => (
            <div 
              key={idx} 
              className="p-4 bg-slate-50/70 border border-slate-200 rounded-xl flex items-start gap-3 hover:border-emerald-300 transition-colors"
            >
              <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                {idx + 1}
              </span>
              <p className="text-xs text-slate-800 leading-relaxed font-medium">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Tata Nilai Budaya Kerja */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Tata Nilai Budaya Kerja: {profileData.coreValues.acronym}
              </h3>
              <p className="text-xs text-slate-500">
                {profileData.coreValues.description}
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={onOpenEditProfile}
              className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Tata Nilai</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {profileData.coreValues.points.map((pt, idx) => (
            <div 
              key={idx} 
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3 hover:border-blue-300 transition-colors"
            >
              <span className="w-8 h-8 rounded-lg bg-blue-600 text-white font-black text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                {pt.letter}
              </span>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  {pt.word}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed mt-0.5">
                  {pt.meaning}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Maklumat & Komitmen Pelayanan */}
      <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-start gap-4 shadow-2xs">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-sm">
          <Award className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-emerald-950">
            Maklumat Pelayanan UPT Puskesmas Boganatar
          </h4>
          <p className="text-xs text-emerald-800 leading-relaxed">
            &quot;Dengan ini kami menyatakan sanggup menyelenggarakan pelayanan sesuai standar pelayanan yang telah ditetapkan dan apabila tidak menepati janji ini, kami siap menerima sanksi sesuai peraturan perundang-undangan yang berlaku.&quot;
          </p>
        </div>
      </div>

      {/* Reset Data Standar (Khusus Admin) */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>Visi, Misi dan Tata Nilai tersimpan aman dan disinkronkan secara cloud.</span>
        {isAdmin && (
          <button
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin mengembalikan Data Visi & Misi ke setelan awal Puskesmas Boganatar?')) {
                onResetDefaultData();
              }
            }}
            className="text-slate-500 hover:text-red-600 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Visi Misi ke Standar</span>
          </button>
        )}
      </div>
    </div>
  );
};
