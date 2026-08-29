import React, { useState } from 'react';
import { 
  Building2, 
  User, 
  Layers, 
  Printer, 
  Edit, 
  Lock, 
  Search, 
  Eye, 
  Download, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  HeartHandshake,
  Activity,
  Stethoscope,
  Baby,
  Users,
  AlertTriangle,
  FileSpreadsheet,
  Maximize2,
  Save,
  Check,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  OrganizationStructureData, 
  OrganizationCluster, 
  OrganizationUnit 
} from '../types/profileTerritory';
import { PuskesmasInfo, Employee } from '../types/employee';
import { DEFAULT_ORGANIZATION_STRUCTURE } from '../data/initialProfileTerritoryData';
import { EditOrganizationModal } from './EditOrganizationModal';
import { PrintOrganizationModal } from './PrintOrganizationModal';

interface OrganizationStructureViewProps {
  structureData?: OrganizationStructureData;
  puskesmasInfo: PuskesmasInfo;
  employees?: Employee[];
  isAdmin?: boolean;
  onUpdateStructure?: (updatedData: OrganizationStructureData) => void;
  onRequireAdmin?: () => void;
}

export const OrganizationStructureView: React.FC<OrganizationStructureViewProps> = ({
  structureData,
  puskesmasInfo,
  employees = [],
  isAdmin = false,
  onUpdateStructure,
  onRequireAdmin
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [modalInitialTab, setModalInitialTab] = useState<string>('pimpinan');
  const [modalInitialClusterIndex, setModalInitialClusterIndex] = useState<number>(0);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'interactive' | 'scan_image'>('interactive');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('ALL');
  const [imageZoom, setImageZoom] = useState<number>(100);

  // Inline Quick Editing States
  // 'head' | string (clusterId) | null
  const [editingClusterId, setEditingClusterId] = useState<string | null>(null);
  const [editingHead, setEditingHead] = useState<boolean>(false);
  const [tempClusterData, setTempClusterData] = useState<OrganizationCluster | null>(null);
  const [tempHeadData, setTempHeadData] = useState<{ title: string; name: string; nip: string } | null>(null);
  const [savedSuccessClusterId, setSavedSuccessClusterId] = useState<string | null>(null);

  const data: OrganizationStructureData = structureData || DEFAULT_ORGANIZATION_STRUCTURE;
  const originalImageUrl = data.originalImageUrl || 'https://iili.io/CmtF6Q9.jpg';

  const employeeNames = Array.from(new Set(employees.map(e => e.fullName).filter(Boolean)));

  const handleOpenEdit = (tab = 'pimpinan', clusterIdx = 0) => {
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    setModalInitialTab(tab);
    setModalInitialClusterIndex(clusterIdx);
    setIsEditModalOpen(true);
  };

  const handleSaveStructure = (updated: OrganizationStructureData) => {
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    if (onUpdateStructure) {
      onUpdateStructure(updated);
    }
  };

  // Inline Quick Edit for Head of Puskesmas
  const handleStartEditHead = () => {
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    setTempHeadData({ ...data.headOfPuskesmas });
    setEditingHead(true);
  };

  const handleSaveHead = () => {
    if (!tempHeadData) return;
    const updated: OrganizationStructureData = {
      ...data,
      headOfPuskesmas: tempHeadData,
      updatedAt: new Date().toISOString()
    };
    handleSaveStructure(updated);
    setEditingHead(false);
    setTempHeadData(null);
    setSavedSuccessClusterId('head');
    setTimeout(() => setSavedSuccessClusterId(null), 2500);
  };

  const handleCancelHead = () => {
    setEditingHead(false);
    setTempHeadData(null);
  };

  // Inline Quick Edit for Cluster
  const handleStartEditCluster = (cluster: OrganizationCluster) => {
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    setTempClusterData(JSON.parse(JSON.stringify(cluster)));
    setEditingClusterId(cluster.id);
  };

  const handleSaveCluster = (clusterId: string) => {
    if (!tempClusterData) return;
    const updatedClusters = data.clusters.map(c => c.id === clusterId ? tempClusterData : c);
    const updated: OrganizationStructureData = {
      ...data,
      clusters: updatedClusters,
      updatedAt: new Date().toISOString()
    };
    handleSaveStructure(updated);
    setEditingClusterId(null);
    setTempClusterData(null);
    setSavedSuccessClusterId(clusterId);
    setTimeout(() => setSavedSuccessClusterId(null), 2500);
  };

  const handleCancelCluster = () => {
    setEditingClusterId(null);
    setTempClusterData(null);
  };

  const handleAddUnitToTemp = () => {
    if (!tempClusterData) return;
    const newUnit: OrganizationUnit = {
      id: `unit-${Date.now()}`,
      name: 'Unit Pelayanan Baru',
      personInCharge: '',
      roleTitle: 'Penanggung Jawab'
    };
    setTempClusterData({
      ...tempClusterData,
      units: [...tempClusterData.units, newUnit]
    });
  };

  const handleDeleteUnitFromTemp = (unitIdx: number) => {
    if (!tempClusterData) return;
    setTempClusterData({
      ...tempClusterData,
      units: tempClusterData.units.filter((_, i) => i !== unitIdx)
    });
  };

  // Color theme helpers
  const getClusterStyles = (code: string) => {
    switch (code) {
      case 'KLASTER_1':
        return {
          border: 'border-blue-200 hover:border-blue-400',
          headerBg: 'bg-blue-600 text-white',
          coordinatorBg: 'bg-blue-50/70 border-blue-200 text-blue-900',
          badge: 'bg-blue-100 text-blue-800',
          cardHover: 'hover:bg-blue-50/50 hover:border-blue-300',
          dotColor: 'bg-blue-500',
          btnSave: 'bg-blue-600 hover:bg-blue-700 text-white',
          icon: Layers
        };
      case 'KLASTER_2':
        return {
          border: 'border-rose-200 hover:border-rose-400',
          headerBg: 'bg-rose-600 text-white',
          coordinatorBg: 'bg-rose-50/70 border-rose-200 text-rose-900',
          badge: 'bg-rose-100 text-rose-800',
          cardHover: 'hover:bg-rose-50/50 hover:border-rose-300',
          dotColor: 'bg-rose-500',
          btnSave: 'bg-rose-600 hover:bg-rose-700 text-white',
          icon: Baby
        };
      case 'KLASTER_3':
        return {
          border: 'border-amber-200 hover:border-amber-400',
          headerBg: 'bg-amber-600 text-white',
          coordinatorBg: 'bg-amber-50/70 border-amber-200 text-amber-900',
          badge: 'bg-amber-100 text-amber-800',
          cardHover: 'hover:bg-amber-50/50 hover:border-amber-300',
          dotColor: 'bg-amber-500',
          btnSave: 'bg-amber-600 hover:bg-amber-700 text-white',
          icon: Users
        };
      case 'KLASTER_4':
        return {
          border: 'border-emerald-200 hover:border-emerald-400',
          headerBg: 'bg-emerald-600 text-white',
          coordinatorBg: 'bg-emerald-50/70 border-emerald-200 text-emerald-900',
          badge: 'bg-emerald-100 text-emerald-800',
          cardHover: 'hover:bg-emerald-50/50 hover:border-emerald-300',
          dotColor: 'bg-emerald-500',
          btnSave: 'bg-emerald-600 hover:bg-emerald-700 text-white',
          icon: Activity
        };
      default:
        return {
          border: 'border-indigo-200 hover:border-indigo-400',
          headerBg: 'bg-indigo-600 text-white',
          coordinatorBg: 'bg-indigo-50/70 border-indigo-200 text-indigo-900',
          badge: 'bg-indigo-100 text-indigo-800',
          cardHover: 'hover:bg-indigo-50/50 hover:border-indigo-300',
          dotColor: 'bg-indigo-500',
          btnSave: 'bg-indigo-600 hover:bg-indigo-700 text-white',
          icon: Stethoscope
        };
    }
  };

  // Filter clusters & search
  const totalUnits = data.clusters.reduce((acc, c) => acc + c.units.length, 0);

  const isMatched = (text: string) => {
    if (!searchQuery.trim()) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  return (
    <div className="space-y-6">
      {/* Datalist for autocomplete */}
      <datalist id="interactive-employee-names">
        {employeeNames.map(name => (
          <option key={name} value={name} />
        ))}
      </datalist>

      {/* Top Banner & Quick Actions */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-blue-500/20 border border-blue-400/30 rounded-full text-blue-300 text-xs font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Struktur Organisasi & Tata Kelola Klaster ILP &bull; Tahun {data.year || '2026'}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {data.title || 'STRUKTUR ORGANISASI UPT PUSKESMAS BOGANATAR'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Penerapan Manajemen Klaster Integrasi Layanan Primer (ILP) berbasis siklus hidup. Anda dapat langsung mengedit dan menyimpan perubahan nama pimpinan, koordinator, dan unit pelayanan di setiap klaster.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              id="btn-edit-organization-chart"
              onClick={() => handleOpenEdit('pimpinan', 0)}
              className={`px-3.5 py-2 border rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                isAdmin 
                  ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                  : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border-amber-800/60'
              }`}
              title={isAdmin ? "Buka Formulir Modal Lengkap Struktur Organisasi" : "Hanya Admin yang dapat mengedit data (Klik untuk Login)"}
            >
              {isAdmin ? <Edit className="w-4 h-4 text-blue-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
              <span>{isAdmin ? 'Edit Modal Lengkap' : 'Edit (Admin)'}</span>
            </button>

            <button
              id="btn-print-organization-chart"
              onClick={() => setIsPrintModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Bagan</span>
            </button>
          </div>
        </div>
      </div>

      {/* Control Bar: View Toggle (Interactive vs Scan Image) + Search + Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: View Mode Segmented Button */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto">
          <button
            onClick={() => setViewMode('interactive')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'interactive'
                ? 'bg-white text-blue-700 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Bagan Digital Interaktif (Bisa Edit & Simpan Langsung)</span>
          </button>

          <button
            onClick={() => setViewMode('scan_image')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'scan_image'
                ? 'bg-white text-blue-700 shadow-xs font-black'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Dokumen Scan Asli (Gambar)</span>
          </button>
        </div>

        {/* Right: Search & Cluster Filter (For Interactive Mode) */}
        {viewMode === 'interactive' && (
          <div className="flex items-center gap-2.5 flex-1 max-w-xl justify-end flex-wrap">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama pegawai, jabatan, atau unit pelayanan..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            <select
              value={selectedClusterFilter}
              onChange={(e) => setSelectedClusterFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Semua Klaster (5)</option>
              {data.clusters.map((c) => (
                <option key={c.id} value={c.code}>
                  {c.shortTitle}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Content Area: Interactive Chart OR Scan Image Viewer */}
      {viewMode === 'interactive' ? (
        <div className="space-y-6">
          {/* Top Node: Kepala Puskesmas */}
          <div className="flex flex-col items-center">
            <div className="relative group max-w-lg w-full">
              <div className="bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-lg border-2 border-slate-700 text-center relative overflow-hidden transition-all hover:border-blue-500 hover:shadow-blue-500/10">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-xl pointer-events-none" />
                
                {/* Header line with Edit/Save button */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{editingHead ? 'EDIT PIMPINAN' : data.headOfPuskesmas.title}</span>
                  </div>

                  {/* Inline Action Buttons for Head */}
                  {editingHead ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleSaveHead}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                        title="Simpan Perubahan Pimpinan"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Simpan</span>
                      </button>
                      <button
                        onClick={handleCancelHead}
                        className="p-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs transition-colors cursor-pointer"
                        title="Batal"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      {savedSuccessClusterId === 'head' && (
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 animate-in fade-in">
                          <Check className="w-3 h-3" /> Tersimpan
                        </span>
                      )}
                      <button
                        onClick={handleStartEditHead}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-blue-600 text-slate-300 hover:text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer border border-slate-700"
                        title={isAdmin ? "Edit Nama & NIP Kepala Puskesmas" : "Login Admin untuk Edit"}
                      >
                        <Edit className="w-3 h-3 text-blue-400" />
                        <span>Edit Pimpinan</span>
                      </button>
                    </div>
                  )}
                </div>

                {editingHead && tempHeadData ? (
                  <div className="space-y-2.5 text-left bg-slate-950/80 p-3 rounded-xl border border-slate-700 mt-2">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                        Jabatan
                      </label>
                      <input
                        type="text"
                        value={tempHeadData.title}
                        onChange={(e) => setTempHeadData({ ...tempHeadData, title: e.target.value })}
                        className="w-full px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                        Nama Lengkap & Gelar
                      </label>
                      <input
                        type="text"
                        value={tempHeadData.name}
                        onChange={(e) => setTempHeadData({ ...tempHeadData, name: e.target.value })}
                        className="w-full px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-yellow-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        list="interactive-employee-names"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-0.5">
                        NIP
                      </label>
                      <input
                        type="text"
                        value={tempHeadData.nip}
                        onChange={(e) => setTempHeadData({ ...tempHeadData, nip: e.target.value })}
                        className="w-full px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className={`text-base sm:text-lg font-black text-white ${isMatched(data.headOfPuskesmas.name) ? 'bg-yellow-400 text-slate-950 px-2 py-0.5 rounded' : ''}`}>
                      {data.headOfPuskesmas.name}
                    </h3>

                    <p className="text-xs font-mono text-slate-300 mt-0.5 font-medium">
                      NIP. {data.headOfPuskesmas.nip}
                    </p>
                  </>
                )}

                <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-center gap-4 text-[11px] text-slate-400">
                  <span>{puskesmasInfo.fullName}</span>
                  <span>&bull;</span>
                  <span>Total {totalUnits} Unit Pelayanan</span>
                </div>
              </div>

              {/* Connecting Tree Stem */}
              <div className="w-0.5 h-6 bg-slate-300 mx-auto" />
            </div>

            {/* Tree Branch Line */}
            <div className="w-full max-w-5xl h-0.5 bg-slate-300 hidden md:block" />
          </div>

          {/* 5 Klaster Columns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
            {data.clusters
              .filter(c => selectedClusterFilter === 'ALL' || c.code === selectedClusterFilter)
              .map((cluster, cIdx) => {
                const style = getClusterStyles(cluster.code);
                const IconComponent = style.icon;
                const matchCoordinator = isMatched(cluster.coordinator.name);
                const isEditing = editingClusterId === cluster.id;
                const isSaved = savedSuccessClusterId === cluster.id;
                const currentCluster = isEditing && tempClusterData ? tempClusterData : cluster;

                return (
                  <div 
                    key={cluster.id || cIdx}
                    className={`bg-white rounded-2xl border ${isEditing ? 'border-blue-500 ring-2 ring-blue-500/20' : style.border} shadow-xs overflow-hidden flex flex-col transition-all`}
                  >
                    {/* Header Bar with Quick Action */}
                    <div className={`${style.headerBg} px-3.5 py-2.5 flex items-center justify-between gap-1.5`}>
                      <div className="flex items-center gap-1.5 min-w-0">
                        <IconComponent className="w-4 h-4 shrink-0" />
                        <h4 className="text-xs font-black uppercase tracking-tight leading-tight truncate">
                          {cluster.shortTitle}
                        </h4>
                      </div>

                      {/* Header Actions: Edit & Simpan Buttons */}
                      <div className="flex items-center gap-1 shrink-0">
                        {isEditing ? (
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleSaveCluster(cluster.id)}
                              className="px-2 py-0.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-md text-[10px] font-black transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                              title="Simpan Perubahan Klaster Ini"
                            >
                              <Save className="w-3 h-3" />
                              <span>Simpan</span>
                            </button>
                            <button
                              onClick={handleCancelCluster}
                              className="p-1 bg-black/20 hover:bg-black/40 text-white rounded-md transition-colors cursor-pointer"
                              title="Batal Edit"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1">
                            {isSaved && (
                              <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.2 rounded animate-in fade-in">
                                ✓ Tersimpan
                              </span>
                            )}
                            <button
                              onClick={() => handleStartEditCluster(cluster)}
                              className="px-2 py-0.5 bg-black/20 hover:bg-black/40 text-white rounded-md text-[10px] font-bold transition-all flex items-center gap-1 cursor-pointer"
                              title="Edit dan Ganti Nama pada Klaster ini"
                            >
                              <Edit className="w-3 h-3" />
                              <span>Edit</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Coordinator Node */}
                    <div className="p-3 bg-slate-50/80 border-b border-slate-200 space-y-2">
                      <div className={`p-2.5 rounded-xl border ${style.coordinatorBg} shadow-2xs space-y-1.5`}>
                        <div className="flex items-center justify-between gap-1 text-[9px] font-bold text-slate-500 uppercase">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-slate-400" />
                            <span>Koordinator / PJ:</span>
                          </div>
                        </div>

                        {isEditing && tempClusterData ? (
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={tempClusterData.coordinator.name}
                              onChange={(e) => setTempClusterData({
                                ...tempClusterData,
                                coordinator: { ...tempClusterData.coordinator, name: e.target.value }
                              })}
                              className="w-full px-2 py-1 bg-white border border-blue-300 rounded-lg text-xs font-bold text-blue-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Nama Koordinator"
                              list="interactive-employee-names"
                            />
                            <input
                              type="text"
                              value={tempClusterData.coordinator.title || ''}
                              onChange={(e) => setTempClusterData({
                                ...tempClusterData,
                                coordinator: { ...tempClusterData.coordinator, title: e.target.value }
                              })}
                              className="w-full px-2 py-0.5 bg-white border border-slate-200 rounded-lg text-[10px] text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              placeholder="Jabatan Koordinator"
                            />
                          </div>
                        ) : (
                          <>
                            <h5 className={`text-xs font-bold leading-snug ${matchCoordinator ? 'bg-yellow-300 text-slate-950 px-1 rounded' : 'text-slate-900'}`}>
                              {cluster.coordinator.name}
                            </h5>
                            {cluster.coordinator.title && (
                              <p className="text-[10px] text-slate-500 font-medium">
                                {cluster.coordinator.title}
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    </div>

                    {/* Sub Units List */}
                    <div className="p-3 space-y-2 flex-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider px-1">
                        <span>Unit Pelayanan ({currentCluster.units.length})</span>
                        {isEditing && (
                          <button
                            onClick={handleAddUnitToTemp}
                            className="text-blue-600 hover:text-blue-700 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" /> Tambah
                          </button>
                        )}
                      </div>

                      <div className="space-y-2">
                        {currentCluster.units.map((unit, uIdx) => {
                          const matchUnitName = isMatched(unit.name);
                          const matchPIC = isMatched(unit.personInCharge);

                          if (isEditing && tempClusterData) {
                            return (
                              <div
                                key={unit.id || uIdx}
                                className="p-2 rounded-xl border border-blue-200 bg-blue-50/40 shadow-2xs space-y-1.5"
                              >
                                <div className="flex items-center justify-between gap-1">
                                  <span className="text-[10px] font-mono font-bold text-blue-800">#{uIdx + 1}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUnitFromTemp(uIdx)}
                                    className="text-slate-400 hover:text-red-600 p-0.5 rounded cursor-pointer"
                                    title="Hapus Unit Ini"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div>
                                  <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">
                                    Nama Unit / Program:
                                  </label>
                                  <input
                                    type="text"
                                    value={unit.name}
                                    onChange={(e) => {
                                      const updatedUnits = [...tempClusterData.units];
                                      updatedUnits[uIdx] = { ...updatedUnits[uIdx], name: e.target.value };
                                      setTempClusterData({ ...tempClusterData, units: updatedUnits });
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Nama Unit"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[9px] font-semibold text-slate-500 mb-0.5">
                                    Penanggung Jawab (Nakes):
                                  </label>
                                  <input
                                    type="text"
                                    value={unit.personInCharge}
                                    onChange={(e) => {
                                      const updatedUnits = [...tempClusterData.units];
                                      updatedUnits[uIdx] = { ...updatedUnits[uIdx], personInCharge: e.target.value };
                                      setTempClusterData({ ...tempClusterData, units: updatedUnits });
                                    }}
                                    className="w-full px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    placeholder="Nama & Gelar"
                                    list="interactive-employee-names"
                                  />
                                </div>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={unit.id || uIdx}
                              className={`p-2.5 rounded-xl border border-slate-200/80 bg-white ${style.cardHover} transition-all shadow-2xs space-y-1 ${
                                (matchUnitName || matchPIC) ? 'ring-2 ring-yellow-400 bg-yellow-50/40' : ''
                              }`}
                            >
                              <div className="flex items-start gap-1.5">
                                <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor} mt-1.5 shrink-0`} />
                                <div className="text-xs font-bold text-slate-800 leading-snug">
                                  <span className={matchUnitName ? 'bg-yellow-300 text-slate-950 px-1 rounded' : ''}>
                                    {unit.name}
                                  </span>
                                </div>
                              </div>

                              <div className="pl-3 text-[11px] text-slate-600 flex items-center gap-1">
                                <span className="text-slate-400 font-medium">PJ:</span>
                                <span className={`font-semibold ${matchPIC ? 'bg-yellow-300 text-slate-950 px-1 rounded' : 'text-blue-900'}`}>
                                  {unit.personInCharge || '-'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Bottom Save bar when editing */}
                      {isEditing && (
                        <div className="pt-2 flex items-center gap-2 border-t border-slate-200">
                          <button
                            onClick={() => handleSaveCluster(cluster.id)}
                            className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                          >
                            <Save className="w-3.5 h-3.5" />
                            <span>Simpan Perubahan</span>
                          </button>
                          <button
                            onClick={handleCancelCluster}
                            className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                          >
                            Batal
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        /* Dokumen Scan Asli (Gambar Resmi) Viewer */
        <div className="bg-slate-900 rounded-2xl p-4 sm:p-6 border border-slate-800 space-y-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <span>Dokumen Bagan Scan Asli SK Manajemen Klaster</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                  Resolusi Tinggi
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Sesuai arsip lembar bagan struktur resmi UPT Puskesmas Boganatar Tahun 2026
              </p>
            </div>

            {/* Zoom & Download Controls */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-slate-800 rounded-xl p-1 border border-slate-700">
                <button
                  onClick={() => setImageZoom(prev => Math.max(50, prev - 25))}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  title="Perkecil"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 text-xs font-mono text-slate-300 font-bold min-w-[50px] text-center">
                  {imageZoom}%
                </span>
                <button
                  onClick={() => setImageZoom(prev => Math.min(250, prev + 25))}
                  className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
                  title="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setImageZoom(100)}
                  className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors cursor-pointer text-xs font-bold"
                  title="Reset Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              <a
                href={originalImageUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Buka Gambar Penuh</span>
              </a>
            </div>
          </div>

          {/* Image Container */}
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-2 overflow-auto max-h-[75vh] flex justify-center items-center">
            <img
              src={originalImageUrl}
              alt="Struktur Organisasi UPT Puskesmas Boganatar 2026"
              style={{ width: `${imageZoom}%`, maxWidth: 'none' }}
              className="rounded-lg shadow-2xl transition-all duration-150 object-contain mx-auto"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://iili.io/CmtF6Q9.jpg';
              }}
            />
          </div>
        </div>
      )}

      {/* Modals */}
      {isEditModalOpen && (
        <EditOrganizationModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          structureData={data}
          employees={employees}
          puskesmasInfo={puskesmasInfo}
          initialTab={modalInitialTab}
          initialClusterIndex={modalInitialClusterIndex}
          onSave={handleSaveStructure}
        />
      )}

      {isPrintModalOpen && (
        <PrintOrganizationModal
          isOpen={isPrintModalOpen}
          onClose={() => setIsPrintModalOpen(false)}
          structureData={data}
          puskesmasInfo={puskesmasInfo}
        />
      )}
    </div>
  );
};

