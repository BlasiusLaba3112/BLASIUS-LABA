import React, { useState, useEffect } from 'react';
import { 
  X, 
  Save, 
  Target, 
  Users, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle,
  Building,
  FileText,
  Activity,
  Plus,
  Trash2
} from 'lucide-react';
import { SPMIndicator, SPMStatus, SPMCategory } from '../types/spm';
import { Employee } from '../types/employee';

interface EditSPMModalProps {
  isOpen: boolean;
  onClose: () => void;
  indicator: SPMIndicator | null;
  employees: Employee[];
  isAdmin?: boolean;
  onSave: (updatedIndicator: SPMIndicator) => void;
}

export const EditSPMModal: React.FC<EditSPMModalProps> = ({
  isOpen,
  onClose,
  indicator,
  employees,
  isAdmin = true,
  onSave,
}) => {
  const [formData, setFormData] = useState<SPMIndicator | null>(null);
  const [newActivity, setNewActivity] = useState('');

  useEffect(() => {
    if (indicator) {
      setFormData(JSON.parse(JSON.stringify(indicator)));
    }
  }, [indicator]);

  if (!isOpen || !formData) return null;

  const handleTargetChange = (val: number) => {
    const target = Math.max(0, val);
    const achieved = formData.achievedCount;
    const pct = target > 0 ? Number(((achieved / target) * 100).toFixed(1)) : 0;
    
    let status: SPMStatus = 'Perhatian';
    if (pct >= 100) status = 'Tercapai';
    else if (pct >= 80) status = 'On Track';
    else if (pct >= 50) status = 'Perhatian';
    else status = 'Kritis';

    setFormData({
      ...formData,
      targetPopulation: target,
      percentage: pct,
      status,
    });
  };

  const handleAchievedChange = (val: number) => {
    const achieved = Math.max(0, val);
    const target = formData.targetPopulation;
    const pct = target > 0 ? Number(((achieved / target) * 100).toFixed(1)) : 0;

    let status: SPMStatus = 'Perhatian';
    if (pct >= 100) status = 'Tercapai';
    else if (pct >= 80) status = 'On Track';
    else if (pct >= 50) status = 'Perhatian';
    else status = 'Kritis';

    setFormData({
      ...formData,
      achievedCount: achieved,
      percentage: pct,
      status,
    });
  };

  const handleVillageCountChange = (index: number, field: 'targetCount' | 'achievedCount', value: number) => {
    const updatedVillages = [...formData.villageBreakdown];
    const current = { ...updatedVillages[index], [field]: Math.max(0, value) };
    current.percentage = current.targetCount > 0 
      ? Number(((current.achievedCount / current.targetCount) * 100).toFixed(1))
      : 0;
    updatedVillages[index] = current;

    // Recalculate totals
    const sumTarget = updatedVillages.reduce((acc, v) => acc + v.targetCount, 0);
    const sumAchieved = updatedVillages.reduce((acc, v) => acc + v.achievedCount, 0);
    const overallPct = sumTarget > 0 ? Number(((sumAchieved / sumTarget) * 100).toFixed(1)) : 0;

    let status: SPMStatus = 'Perhatian';
    if (overallPct >= 100) status = 'Tercapai';
    else if (overallPct >= 80) status = 'On Track';
    else if (overallPct >= 50) status = 'Perhatian';
    else status = 'Kritis';

    setFormData({
      ...formData,
      villageBreakdown: updatedVillages,
      targetPopulation: sumTarget,
      achievedCount: sumAchieved,
      percentage: overallPct,
      status,
    });
  };

  const handleSelectEmployee = (empName: string) => {
    const emp = employees.find(e => e.fullName === empName);
    if (emp) {
      setFormData({
        ...formData,
        picEmployeeName: emp.fullName,
        picEmployeeNip: emp.nip || '',
        picPosition: emp.jobTitle || 'Penanggung Jawab Program',
      });
    } else {
      setFormData({
        ...formData,
        picEmployeeName: empName,
      });
    }
  };

  const handleAddActivity = () => {
    if (!newActivity.trim()) return;
    setFormData({
      ...formData,
      keyActivities: [...formData.keyActivities, newActivity.trim()]
    });
    setNewActivity('');
  };

  const handleRemoveActivity = (idx: number) => {
    const filtered = formData.keyActivities.filter((_, i) => i !== idx);
    setFormData({
      ...formData,
      keyActivities: filtered
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAdmin) {
      alert('Akses Ditolak: Hanya Administrator (@shyllpb) yang dapat mengubah data indikator SPM.');
      return;
    }
    onSave({
      ...formData,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 font-black text-sm">
              #{formData.number}
            </div>
            <div>
              <h2 className="text-base font-bold leading-snug text-white">
                Edit Capaian SPM Indikator ke-{formData.number}
              </h2>
              <p className="text-xs text-slate-300 line-clamp-1">
                {formData.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Main Info */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                {formData.category}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">Target Nasional:</span>
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold text-xs rounded">
                  100%
                </span>
                <span className="text-xs text-slate-500 ml-2">Capaian Saat Ini:</span>
                <span className={`px-2.5 py-0.5 font-black text-xs rounded ${
                  formData.percentage >= 100 
                    ? 'bg-emerald-600 text-white' 
                    : formData.percentage >= 80 
                    ? 'bg-blue-600 text-white' 
                    : formData.percentage >= 50
                    ? 'bg-amber-500 text-white'
                    : 'bg-red-600 text-white'
                }`}>
                  {formData.percentage}% ({formData.status})
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Standar Pelayanan / Definisi Operasional
              </label>
              <textarea
                value={formData.standardDescription}
                onChange={(e) => setFormData({ ...formData, standardDescription: e.target.value })}
                rows={2}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Aggregated Numbers */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Target className="w-4 h-4 text-blue-600" />
              <span>Target Sasaran & Realisasi Total Puskesmas</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Target Sasaran Riil ({formData.unitMeasure})
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.targetPopulation}
                  onChange={(e) => handleTargetChange(Number(e.target.value))}
                  className="w-full text-sm font-bold p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Realisasi Terlayani Sesuai Standar
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.achievedCount}
                  onChange={(e) => handleAchievedChange(Number(e.target.value))}
                  className="w-full text-sm font-bold p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Periode / Status Evaluasi
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.period}
                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                    className="w-1/2 text-xs font-semibold p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                    placeholder="Tahun 2026"
                  />
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as SPMStatus })}
                    className="w-1/2 text-xs font-semibold p-2 bg-slate-50 border border-slate-300 rounded-lg focus:bg-white"
                  >
                    <option value="Tercapai">Tercapai (≥100%)</option>
                    <option value="On Track">On Track (80-99%)</option>
                    <option value="Perhatian">Perhatian (50-79%)</option>
                    <option value="Kritis">Kritis (&lt;50%)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Breakdown Per 5 Desa */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-emerald-600" />
                <span>Rincian Capaian per 5 Desa Binaan</span>
              </div>
              <span className="text-[11px] font-normal text-slate-500 lowercase">
                (otomatis mengalkulasi capaian & persen per desa)
              </span>
            </h3>

            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <tr>
                    <th className="p-3">Nama Desa</th>
                    <th className="p-3 w-32">Target Sasaran</th>
                    <th className="p-3 w-32">Realisasi</th>
                    <th className="p-3 w-28 text-center">% Capaian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {formData.villageBreakdown.map((vb, idx) => (
                    <tr key={vb.villageId} className="hover:bg-slate-50">
                      <td className="p-3 font-semibold text-slate-900">
                        {vb.villageName}
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          value={vb.targetCount}
                          onChange={(e) => handleVillageCountChange(idx, 'targetCount', Number(e.target.value))}
                          className="w-full p-1.5 font-medium text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          min="0"
                          value={vb.achievedCount}
                          onChange={(e) => handleVillageCountChange(idx, 'achievedCount', Number(e.target.value))}
                          className="w-full p-1.5 font-medium text-xs bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        />
                      </td>
                      <td className="p-3 text-center font-bold">
                        <span className={`px-2 py-0.5 rounded text-[11px] ${
                          vb.percentage >= 100
                            ? 'bg-emerald-100 text-emerald-800'
                            : vb.percentage >= 80
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {vb.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Triwulan Progress */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span>Progres Realisasi per Triwulan</span>
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {(['q1', 'q2', 'q3', 'q4'] as const).map((qKey, qIdx) => (
                <div key={qKey} className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
                  <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                    Triwulan {qIdx + 1}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.quarterProgress[qKey]}
                    onChange={(e) => setFormData({
                      ...formData,
                      quarterProgress: {
                        ...formData.quarterProgress,
                        [qKey]: Number(e.target.value)
                      }
                    })}
                    className="w-full text-center text-xs font-bold p-1.5 bg-white border border-slate-300 rounded focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Penanggung Jawab Program (PIC) */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Penanggung Jawab Program (Koordinator SPM)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pilih dari Pegawai Puskesmas Boganatar:
                </label>
                <select
                  value={formData.picEmployeeName}
                  onChange={(e) => handleSelectEmployee(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Pegawai --</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.fullName}>
                      {emp.fullName} ({emp.jobTitle})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jabatan / Posisi dalam Program:
                </label>
                <input
                  type="text"
                  value={formData.picPosition}
                  onChange={(e) => setFormData({ ...formData, picPosition: e.target.value })}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Bidan Koordinator / Pengelola PTM"
                />
              </div>
            </div>
          </div>

          {/* Rencana Inovasi & Kegiatan */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-teal-600" />
              <span>Inovasi Layanan & Kegiatan Utama</span>
            </h3>
            <div className="space-y-2 mb-3">
              {formData.keyActivities.map((act, i) => (
                <div key={i} className="flex items-center justify-between gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <span className="text-slate-800 font-medium">&bull; {act}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveActivity(i)}
                    className="text-red-500 hover:text-red-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={newActivity}
                onChange={(e) => setNewActivity(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddActivity(); } }}
                placeholder="Tambah kegiatan atau inovasi..."
                className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={handleAddActivity}
                className="px-3 py-2 bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-slate-700 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah</span>
              </button>
            </div>
          </div>

          {/* Analisis Masalah & RTL */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Analisis Kendala / Hambatan
              </label>
              <textarea
                value={formData.problemAnalysis || ''}
                onChange={(e) => setFormData({ ...formData, problemAnalysis: e.target.value })}
                rows={3}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Identifikasi faktor penyebab belum tercapai 100%..."
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Rencana Tindak Lanjut (RTL)
              </label>
              <textarea
                value={formData.followUpPlan || ''}
                onChange={(e) => setFormData({ ...formData, followUpPlan: e.target.value })}
                rows={3}
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Langkah perbaikan dan intervensi lanjutan..."
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className={`px-5 py-2 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer ${
              isAdmin 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-amber-200 text-amber-900 border border-amber-400 hover:bg-amber-300'
            }`}
          >
            <Save className="w-4 h-4" />
            <span>{isAdmin ? 'Simpan Perubahan SPM' : 'Terkunci (Hanya Admin)'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
