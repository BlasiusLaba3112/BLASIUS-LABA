import React, { useState } from 'react';
import { 
  X, 
  Save, 
  Plus, 
  Trash2, 
  Building2, 
  User, 
  ShieldCheck, 
  Layers, 
  FileText, 
  Sparkles,
  Info,
  ChevronRight,
  Check
} from 'lucide-react';
import { 
  OrganizationStructureData, 
  OrganizationCluster, 
  OrganizationUnit 
} from '../types/profileTerritory';
import { Employee, PuskesmasInfo } from '../types/employee';
import { DEFAULT_ORGANIZATION_STRUCTURE } from '../data/initialProfileTerritoryData';

interface EditOrganizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  structureData: OrganizationStructureData;
  employees?: Employee[];
  puskesmasInfo?: PuskesmasInfo;
  initialTab?: string;
  initialClusterIndex?: number;
  onSave: (updated: OrganizationStructureData) => void;
}

export const EditOrganizationModal: React.FC<EditOrganizationModalProps> = ({
  isOpen,
  onClose,
  structureData,
  employees = [],
  puskesmasInfo,
  initialTab = 'pimpinan',
  initialClusterIndex = 0,
  onSave
}) => {
  const [formData, setFormData] = useState<OrganizationStructureData>(() => {
    return JSON.parse(JSON.stringify(structureData || DEFAULT_ORGANIZATION_STRUCTURE));
  });

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [selectedClusterIndex, setSelectedClusterIndex] = useState<number>(initialClusterIndex);

  if (!isOpen) return null;

  // List of distinct employee names for quick picker
  const employeeNames = Array.from(new Set(employees.map(e => e.fullName).filter(Boolean)));

  const handleHeadChange = (field: 'title' | 'name' | 'nip', value: string) => {
    setFormData(prev => ({
      ...prev,
      headOfPuskesmas: {
        ...prev.headOfPuskesmas,
        [field]: value
      }
    }));
  };

  const handleClusterChange = (clusterIdx: number, field: string, value: any) => {
    setFormData(prev => {
      const newClusters = [...prev.clusters];
      if (field.startsWith('coordinator.')) {
        const sub = field.split('.')[1];
        newClusters[clusterIdx] = {
          ...newClusters[clusterIdx],
          coordinator: {
            ...newClusters[clusterIdx].coordinator,
            [sub]: value
          }
        };
      } else {
        newClusters[clusterIdx] = {
          ...newClusters[clusterIdx],
          [field]: value
        };
      }
      return { ...prev, clusters: newClusters };
    });
  };

  const handleUnitChange = (clusterIdx: number, unitIdx: number, field: keyof OrganizationUnit, value: string) => {
    setFormData(prev => {
      const newClusters = [...prev.clusters];
      const units = [...newClusters[clusterIdx].units];
      units[unitIdx] = {
        ...units[unitIdx],
        [field]: value
      };
      newClusters[clusterIdx] = {
        ...newClusters[clusterIdx],
        units
      };
      return { ...prev, clusters: newClusters };
    });
  };

  const handleAddUnit = (clusterIdx: number) => {
    setFormData(prev => {
      const newClusters = [...prev.clusters];
      const newUnit: OrganizationUnit = {
        id: `unit-${clusterIdx + 1}-${Date.now()}`,
        name: 'Unit Pelayanan Baru',
        personInCharge: '',
        roleTitle: 'Penanggung Jawab'
      };
      newClusters[clusterIdx] = {
        ...newClusters[clusterIdx],
        units: [...newClusters[clusterIdx].units, newUnit]
      };
      return { ...prev, clusters: newClusters };
    });
  };

  const handleDeleteUnit = (clusterIdx: number, unitIdx: number) => {
    setFormData(prev => {
      const newClusters = [...prev.clusters];
      const units = newClusters[clusterIdx].units.filter((_, i) => i !== unitIdx);
      newClusters[clusterIdx] = {
        ...newClusters[clusterIdx],
        units
      };
      return { ...prev, clusters: newClusters };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      updatedAt: new Date().toISOString()
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div 
        id="modal-edit-organization"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-5xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-slate-900 text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Edit Struktur Organisasi Puskesmas</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[11px] font-mono font-semibold">
                  Tahun {formData.year || '2026'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Sesuaikan pimpinan, koordinator klaster, serta unit pelayanan dan penanggung jawab
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="bg-slate-100/90 px-4 sm:px-6 py-2.5 border-b border-slate-200 flex items-center gap-2 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('pimpinan')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'pimpinan'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Pimpinan & Info Umum</span>
          </button>

          {formData.clusters.map((cluster, idx) => (
            <button
              key={cluster.id || idx}
              type="button"
              onClick={() => {
                setActiveTab('klaster');
                setSelectedClusterIndex(idx);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'klaster' && selectedClusterIndex === idx
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>{cluster.shortTitle || `Klaster ${idx + 1}`}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-700 font-mono">
                {cluster.units.length}
              </span>
            </button>
          ))}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {activeTab === 'pimpinan' ? (
            <div className="space-y-6">
              {/* General Metadata */}
              <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200 space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Judul & Periode Struktur Organisasi</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Judul Bagan Organisasi
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="STRUKTUR ORGANISASI UPT PUSKESMAS BOGANATAR"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tahun Periode
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="2026"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Sub Judul / Keterangan Bagan
                    </label>
                    <input
                      type="text"
                      value={formData.subtitle || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Manajemen Klaster Integrasi Layanan Primer (ILP)"
                    />
                  </div>
                </div>
              </div>

              {/* Head of Puskesmas */}
              <div className="bg-blue-50/60 p-4.5 rounded-xl border border-blue-200 space-y-4">
                <h4 className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span>Pimpinan Tertinggi / Kepala Puskesmas</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jabatan Pimpinan
                    </label>
                    <input
                      type="text"
                      value={formData.headOfPuskesmas.title}
                      onChange={(e) => handleHeadChange('title', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="KEPALA PUSKESMAS"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nama Lengkap & Gelar
                    </label>
                    <input
                      type="text"
                      value={formData.headOfPuskesmas.name}
                      onChange={(e) => handleHeadChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Maria Yukensi Pogon, A.Md.Keb"
                      list="employee-names-list"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      NIP
                    </label>
                    <input
                      type="text"
                      value={formData.headOfPuskesmas.nip}
                      onChange={(e) => handleHeadChange('nip', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="19740303 200312 2 006"
                    />
                  </div>
                </div>
              </div>

              {/* Original Scan Image URL - Removed */}
            </div>
          ) : (
            /* Selected Cluster Editing View */
            <div className="space-y-6">
              {(() => {
                const cluster = formData.clusters[selectedClusterIndex];
                if (!cluster) return null;

                return (
                  <div className="space-y-5">
                    {/* Cluster Header & Coordinator Info */}
                    <div className="bg-slate-50 p-4.5 rounded-xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-100 text-blue-800 text-xs font-black">
                          {cluster.code}
                        </span>
                        <div className="text-xs text-slate-500">
                          Total Unit: <strong className="text-slate-800">{cluster.units.length} Unit Pelayanan</strong>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Nama Lengkap Klaster
                          </label>
                          <input
                            type="text"
                            value={cluster.title}
                            onChange={(e) => handleClusterChange(selectedClusterIndex, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Nama Singkat (Tab & Header)
                          </label>
                          <input
                            type="text"
                            value={cluster.shortTitle}
                            onChange={(e) => handleClusterChange(selectedClusterIndex, 'shortTitle', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="sm:col-span-2 bg-white p-3 rounded-lg border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Koordinator / Penanggung Jawab Klaster
                            </label>
                            <input
                              type="text"
                              value={cluster.coordinator.name}
                              onChange={(e) => handleClusterChange(selectedClusterIndex, 'coordinator.name', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Nama & Gelar Nakes"
                              list="employee-names-list"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-slate-700 mb-1">
                              Keterangan Jabatan Koordinator
                            </label>
                            <input
                              type="text"
                              value={cluster.coordinator.title || ''}
                              onChange={(e) => handleClusterChange(selectedClusterIndex, 'coordinator.title', e.target.value)}
                              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="Penanggung Jawab Klaster"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Units Table / List */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                          <Layers className="w-4 h-4 text-blue-600" />
                          <span>Daftar Unit Pelayanan & Penanggung Jawab ({cluster.units.length})</span>
                        </h4>
                        <button
                          type="button"
                          onClick={() => handleAddUnit(selectedClusterIndex)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Tambah Unit</span>
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {cluster.units.map((unit, uIdx) => (
                          <div 
                            key={unit.id || uIdx}
                            className="bg-white p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 shadow-2xs transition-all grid grid-cols-1 md:grid-cols-12 gap-3 items-center"
                          >
                            <div className="md:col-span-1 flex items-center justify-center font-mono font-bold text-xs text-slate-400 bg-slate-100 rounded-lg py-2">
                              #{uIdx + 1}
                            </div>
                            <div className="md:col-span-5">
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                Nama Unit / Program Pelayanan
                              </label>
                              <input
                                type="text"
                                value={unit.name}
                                onChange={(e) => handleUnitChange(selectedClusterIndex, uIdx, 'name', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Nama Unit Pelayanan"
                              />
                            </div>
                            <div className="md:col-span-5">
                              <label className="block text-[10px] font-semibold text-slate-500 mb-0.5">
                                Nama Penanggung Jawab (Nakes / Staf)
                              </label>
                              <input
                                type="text"
                                value={unit.personInCharge}
                                onChange={(e) => handleUnitChange(selectedClusterIndex, uIdx, 'personInCharge', e.target.value)}
                                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                                placeholder="Nama & Gelar Penanggung Jawab"
                                list="employee-names-list"
                              />
                            </div>
                            <div className="md:col-span-1 flex justify-end">
                              <button
                                type="button"
                                onClick={() => handleDeleteUnit(selectedClusterIndex, uIdx)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Hapus Unit Pelayanan Ini"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Datalist for autocomplete */}
          <datalist id="employee-names-list">
            {employeeNames.map(name => (
              <option key={name} value={name} />
            ))}
          </datalist>
        </form>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-5 sm:px-6 py-3.5 border-t border-slate-200 flex items-center justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-200 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-blue-600/20"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Perubahan</span>
          </button>
        </div>
      </div>
    </div>
  );
};
