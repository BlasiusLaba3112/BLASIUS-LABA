import React, { useState } from 'react';
import { 
  Building2, 
  Clock, 
  Phone, 
  User, 
  RotateCcw,
  ShieldCheck,
  Printer,
  Edit,
  MapPin,
  Hospital,
  Activity,
  CheckCircle2,
  Plus,
  Trash2,
  Lock,
  Tag,
  AlertCircle,
  Stethoscope,
  Heart,
  Sparkles,
  Layers
} from 'lucide-react';
import { PuskesmasProfileData, FacilityUnit, OrganizationStructureData } from '../types/profileTerritory';
import { PuskesmasInfo, Employee } from '../types/employee';
import { DEFAULT_FACILITIES, DEFAULT_ORGANIZATION_STRUCTURE } from '../data/initialProfileTerritoryData';
import { EditOverviewModal } from './EditOverviewModal';
import { EditFacilityModal } from './EditFacilityModal';
import { OrganizationStructureView } from './OrganizationStructureView';

interface PuskesmasProfileViewProps {
  profileData: PuskesmasProfileData;
  puskesmasInfo: PuskesmasInfo;
  employees?: Employee[];
  isAdmin?: boolean;
  onUpdateProfile?: (updatedData: PuskesmasProfileData) => void;
  onOpenEditProfile: () => void;
  onOpenPrintModal: () => void;
  onResetDefaultData: () => void;
  onRequireAdmin?: () => void;
}

export const PuskesmasProfileView: React.FC<PuskesmasProfileViewProps> = ({
  profileData,
  puskesmasInfo,
  employees = [],
  isAdmin = false,
  onUpdateProfile,
  onOpenEditProfile,
  onOpenPrintModal,
  onResetDefaultData,
  onRequireAdmin
}) => {
  // Sub-tab switch: 'struktur' (Struktur Organisasi Klaster ILP) or 'fasilitas' (Gambaran Umum & Fasilitas)
  const [activeTab, setActiveTab] = useState<'struktur' | 'fasilitas'>('struktur');

  // Modal states for Gambaran Umum and Facilities
  const [isEditOverviewOpen, setIsEditOverviewOpen] = useState(false);
  const [isEditFacilityOpen, setIsEditFacilityOpen] = useState(false);
  const [facilityToEdit, setFacilityToEdit] = useState<FacilityUnit | null>(null);

  // Filter state for facilities
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [searchFacility, setSearchFacility] = useState<string>('');

  // Handler for Organization Structure Update
  const handleUpdateStructure = (updatedStructure: OrganizationStructureData) => {
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    const updated: PuskesmasProfileData = {
      ...profileData,
      organizationStructure: updatedStructure,
      updatedAt: new Date().toISOString()
    };
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  // Fallback to DEFAULT_FACILITIES if facilities is empty or undefined
  const facilitiesList: FacilityUnit[] = profileData.facilities && profileData.facilities.length > 0 
    ? profileData.facilities 
    : DEFAULT_FACILITIES;

  // Handler for saving Overview
  const handleSaveOverview = (newOverview: string) => {
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    const updated: PuskesmasProfileData = {
      ...profileData,
      overview: newOverview,
      updatedAt: new Date().toISOString()
    };
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  // Handler for deleting Overview
  const handleDeleteOverview = () => {
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    const updated: PuskesmasProfileData = {
      ...profileData,
      overview: '',
      updatedAt: new Date().toISOString()
    };
    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  // Handler for Adding / Editing Facility
  const handleOpenAddFacility = () => {
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    setFacilityToEdit(null);
    setIsEditFacilityOpen(true);
  };

  const handleOpenEditFacility = (facility: FacilityUnit) => {
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    setFacilityToEdit(facility);
    setIsEditFacilityOpen(true);
  };

  const handleSaveFacility = (savedFacility: FacilityUnit) => {
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    const currentList = profileData.facilities && profileData.facilities.length > 0 
      ? [...profileData.facilities] 
      : [...DEFAULT_FACILITIES];

    const existingIndex = currentList.findIndex(f => f.id === savedFacility.id);
    let updatedList: FacilityUnit[];

    if (existingIndex >= 0) {
      updatedList = currentList.map((f, i) => i === existingIndex ? savedFacility : f);
    } else {
      updatedList = [...currentList, savedFacility];
    }

    const updated: PuskesmasProfileData = {
      ...profileData,
      facilities: updatedList,
      updatedAt: new Date().toISOString()
    };

    if (onUpdateProfile) {
      onUpdateProfile(updated);
    }
  };

  const handleDeleteFacility = (facilityId: string, facilityName: string) => {
    if (!isAdmin) {
      if (onRequireAdmin) onRequireAdmin();
      return;
    }
    if (window.confirm(`Apakah Anda yakin ingin menghapus fasilitas "${facilityName}"?`)) {
      const currentList = profileData.facilities && profileData.facilities.length > 0 
        ? [...profileData.facilities] 
        : [...DEFAULT_FACILITIES];

      const updatedList = currentList.filter(f => f.id !== facilityId);
      const updated: PuskesmasProfileData = {
        ...profileData,
        facilities: updatedList,
        updatedAt: new Date().toISOString()
      };

      if (onUpdateProfile) {
        onUpdateProfile(updated);
      }
    }
  };

  // Helper for category badge color
  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case 'Kegawatdaruratan':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'Kesehatan Ibu & Anak':
        return 'bg-pink-100 text-pink-800 border-pink-200';
      case 'Rawat Inap':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Rawat Jalan':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Penunjang Medis':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Konseling & Promkes':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  // Filtered facilities
  const categories = ['Semua', ...Array.from(new Set(facilitiesList.map(f => f.category).filter(Boolean)))];

  const filteredFacilities = facilitiesList.filter(item => {
    const matchesCategory = selectedCategory === 'Semua' || item.category === selectedCategory;
    const matchesSearch = searchFacility === '' || 
      item.name.toLowerCase().includes(searchFacility.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchFacility.toLowerCase())) ||
      (item.category && item.category.toLowerCase().includes(searchFacility.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Profile Sub-Navigation Switcher */}
      <div className="flex items-center justify-between flex-wrap gap-3 pb-1">
        <div className="flex items-center bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs gap-1.5 overflow-x-auto max-w-full">
          <button
            id="subtab-profile-structure"
            onClick={() => setActiveTab('struktur')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'struktur'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20 ring-1 ring-blue-700'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className={`w-4 h-4 ${activeTab === 'struktur' ? 'text-white' : 'text-blue-600'}`} />
            <span>Struktur Organisasi (Klaster ILP)</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === 'struktur' ? 'bg-blue-800 text-blue-100' : 'bg-slate-200 text-slate-700'
            }`}>
              5 Klaster
            </span>
          </button>

          <button
            id="subtab-profile-facilities"
            onClick={() => setActiveTab('fasilitas')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'fasilitas'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 ring-1 ring-emerald-700'
                : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Building2 className={`w-4 h-4 ${activeTab === 'fasilitas' ? 'text-white' : 'text-emerald-600'}`} />
            <span>Profil & Fasilitas Pelayanan</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
              activeTab === 'fasilitas' ? 'bg-emerald-800 text-emerald-100' : 'bg-slate-200 text-slate-700'
            }`}>
              {facilitiesList.length} Unit
            </span>
          </button>
        </div>
      </div>

      {/* Conditionally Render: Struktur Organisasi OR Gambaran Umum & Fasilitas */}
      {activeTab === 'struktur' ? (
        <OrganizationStructureView
          structureData={profileData.organizationStructure || DEFAULT_ORGANIZATION_STRUCTURE}
          puskesmasInfo={puskesmasInfo}
          employees={employees}
          isAdmin={isAdmin}
          onUpdateStructure={handleUpdateStructure}
          onRequireAdmin={onRequireAdmin}
        />
      ) : (
        <div className="space-y-6">
          {/* Top Banner & Quick Action Header */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-800 relative overflow-hidden">
            <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-emerald-500/20 border border-emerald-400/30 rounded-full text-emerald-300 text-xs font-semibold">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Profil Lembaga & Fasilitas &bull; UPT Puskesmas Boganatar</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Profil & Fasilitas Pelayanan
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Pusat Pelayanan Kesehatan Primer Terpadu Kecamatan Talibura, Kabupaten Sikka, Nusa Tenggara Timur.
                </p>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  id="btn-edit-profile-view"
                  onClick={onOpenEditProfile}
                  className={`px-3.5 py-2 border rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    isAdmin 
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' 
                      : 'bg-amber-950/60 hover:bg-amber-900/60 text-amber-200 border-amber-800/60'
                  }`}
                  title={isAdmin ? "Edit Data Profil & Jam Operasional" : "Hanya Admin yang dapat mengedit data (Klik untuk Login)"}
                >
                  {isAdmin ? <Edit className="w-4 h-4 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-amber-400" />}
                  <span>{isAdmin ? 'Edit Lengkap' : 'Edit (Admin)'}</span>
                </button>

                <button
                  id="btn-print-profile-view"
                  onClick={onOpenPrintModal}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Profil</span>
                </button>
              </div>
            </div>
          </div>

      {/* Main Identity & Leadership Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Gambaran Umum & Informasi Institusi (With Direct Edit & Hapus Controls) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 flex-wrap gap-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Hospital className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Gambaran Umum Puskesmas
                </h3>
                <p className="text-xs text-slate-500">
                  Informasi sejarah, fungsi, dan karakteristik pelayanan
                </p>
              </div>
            </div>

            {/* Direct Action Buttons for Gambaran Umum */}
            <div className="flex items-center gap-1.5">
              <button
                id="btn-edit-overview-direct"
                onClick={() => {
                  if (!isAdmin && onRequireAdmin) {
                    onRequireAdmin();
                  } else {
                    setIsEditOverviewOpen(true);
                  }
                }}
                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer"
                title="Edit Teks Gambaran Umum"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Gambaran Umum</span>
              </button>

              {profileData.overview && (
                <button
                  id="btn-delete-overview-direct"
                  onClick={() => {
                    if (!isAdmin && onRequireAdmin) {
                      onRequireAdmin();
                    } else {
                      if (window.confirm('Apakah Anda yakin ingin menghapus teks Gambaran Umum Puskesmas?')) {
                        handleDeleteOverview();
                      }
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                  title="Hapus Gambaran Umum"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Gambaran Umum Content Display or Empty State */}
          {profileData.overview ? (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed text-justify whitespace-pre-line bg-slate-50/50 p-3.5 rounded-xl border border-slate-100">
                {profileData.overview}
              </p>
            </div>
          ) : (
            <div className="p-6 bg-slate-50 rounded-xl border border-dashed border-slate-300 text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-500 mx-auto flex items-center justify-center">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-800">Teks Gambaran Umum Belum Diisi / Telah Dihapus</h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Klik tombol di bawah untuk menambahkan gambaran umum baru atau memulihkan teks standar Puskesmas Boganatar.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  onClick={() => setIsEditOverviewOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah Gambaran Umum</span>
                </button>
                <button
                  onClick={() => handleSaveOverview('UPT Puskesmas Boganatar merupakan fasilitas pelayanan kesehatan tingkat pertama (FKTP) di bawah naungan Dinas Kesehatan Kabupaten Sikka, terletak di jalur strategis Trans Flores Maumere - Larantuka, Kecamatan Talibura. Puskesmas Boganatar mengampu 5 (lima) desa binaan dengan cakupan pelayanan promotif, preventif, kuratif, dan rehabilitatif serta Unit Gawat Darurat (UGD) dan Rawat Inap.')}
                  className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Pulihkan Teks Standar</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Institutional Attributes */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-500 block text-[11px]">Nama Resmi:</span>
                <strong className="text-slate-900 font-bold">{puskesmasInfo.fullName}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Kode Registrasi Puskesmas:</span>
                <strong className="font-mono text-emerald-700 font-bold">{puskesmasInfo.codePuskesmas}</strong>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Kategori Puskesmas:</span>
                <span className="inline-block px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-semibold text-[11px]">
                  Rawat Inap & Non-Rawat Inap
                </span>
              </div>
              <div>
                <span className="text-slate-500 block text-[11px]">Karakteristik Wilayah:</span>
                <span className="text-slate-800 font-semibold">Pesisir, Dataran Rendah & Perbukitan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Leadership & Contact Info */}
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Kepala UPT Puskesmas
                </h3>
                <p className="text-[11px] text-slate-500">
                  Pimpinan & Penanggung Jawab
                </p>
              </div>
            </div>

            <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 text-xs space-y-1.5">
              <div className="font-black text-slate-900 text-sm">
                {puskesmasInfo.headOfPuskesmas.name}
              </div>
              <div className="text-blue-900 font-semibold text-[11px]">
                {puskesmasInfo.headOfPuskesmas.rankGrade}
              </div>
              <div className="text-slate-600 font-mono text-[11px]">
                NIP. {puskesmasInfo.headOfPuskesmas.nip}
              </div>
            </div>

            {/* Address & Phone */}
            <div className="space-y-2 text-xs pt-1">
              <div className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Alamat:</span>
                  <span className="text-slate-800 font-medium">{puskesmasInfo.address}</span>
                </div>
              </div>
              <div className="flex items-start gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Kontak / WhatsApp:</span>
                  <span className="text-slate-800 font-mono font-medium">{puskesmasInfo.phone}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md font-semibold inline-flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Terakreditasi Paripurna &bull; Dinkes Sikka</span>
            </span>
          </div>
        </div>
      </div>

      {/* Operasional Resmi */}
      <div className="p-5 bg-white border border-slate-200 rounded-2xl shadow-xs space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Jam Operasional & Pelayanan Resmi</span>
          </h4>
          {isAdmin && (
            <button
              onClick={onOpenEditProfile}
              className="text-[11px] text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <Edit className="w-3 h-3" />
              <span>Ubah Jam Layanan</span>
            </button>
          )}
        </div>
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-950 font-medium leading-relaxed">
          {profileData.serviceHours}
        </div>
        <p className="text-[11px] text-slate-500">
          Unit Gawat Darurat (UGD) & Pelayanan Persalinan 24 Jam siap siaga melayani masyarakat 7 hari dalam seminggu.
        </p>
      </div>

      {/* Fasilitas & Unit Pelayanan (Full CRUD: Tambah, Edit, Hapus, Simpan) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Fasilitas & Unit Pelayanan
                </h3>
                <span className="px-2 py-0.5 bg-teal-100 text-teal-800 rounded-full text-xs font-bold font-mono">
                  {facilitiesList.length} Unit
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Daftar ruang pelayanan, poli spesifik, penunjang medis, dan rawat inap
              </p>
            </div>
          </div>

          {/* Action: Tambah Fasilitas */}
          <div className="flex items-center gap-2">
            <button
              id="btn-add-facility"
              onClick={handleOpenAddFacility}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Fasilitas / Unit</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="w-full md:w-64">
            <input
              type="text"
              value={searchFacility}
              onChange={(e) => setSearchFacility(e.target.value)}
              placeholder="Cari fasilitas atau poli..."
              className="w-full px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Facilities Grid */}
        {filteredFacilities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFacilities.map((fac) => (
              <div 
                key={fac.id} 
                className="p-4 bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between transition-all hover:shadow-xs group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${getCategoryBadgeClass(fac.category)}`}>
                      {fac.category || 'Pelayanan'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                      fac.status === 'Siaga' 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : fac.status === 'Pemeliharaan'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {fac.status || 'Aktif'}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{fac.name}</span>
                  </h4>

                  {fac.operationalHours && (
                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5 font-medium">
                      <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                      <span>{fac.operationalHours}</span>
                    </div>
                  )}

                  {fac.description && (
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {fac.description}
                    </p>
                  )}
                </div>

                {/* Card Action Buttons (Edit & Hapus) */}
                <div className="pt-3 border-t border-slate-200/80 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenEditFacility(fac)}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                    title="Edit Fasilitas ini"
                  >
                    <Edit className="w-3 h-3 text-blue-600" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDeleteFacility(fac.id, fac.name)}
                    className="px-2.5 py-1 bg-white hover:bg-red-50 border border-slate-200 text-red-600 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer hover:border-red-200"
                    title="Hapus Fasilitas ini"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Hapus</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 space-y-3">
            <Activity className="w-8 h-8 text-slate-400 mx-auto" />
            <div>
              <p className="text-xs font-bold text-slate-700">Tidak ada fasilitas yang sesuai</p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Coba ubah kata kunci pencarian atau tambahkan fasilitas baru.
              </p>
            </div>
            <button
              onClick={handleOpenAddFacility}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Fasilitas Baru</span>
            </button>
          </div>
        )}
      </div>

      {/* Reset Data Standar Profil (Khusus Admin) */}
      <div className="pt-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <span>Data profil & fasilitas tersimpan aman di sistem dan disinkronkan secara realtime ke Cloud.</span>
        {isAdmin && (
          <button
            onClick={() => {
              if (window.confirm('Apakah Anda yakin ingin mengembalikan Data Profil & Fasilitas ke setelan awal Puskesmas Boganatar?')) {
                onResetDefaultData();
              }
            }}
            className="text-slate-500 hover:text-red-600 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Profil ke Standar</span>
          </button>
        )}
      </div>
        </div>
      )}

      {/* Modal Edit Gambaran Umum */}
      <EditOverviewModal
        isOpen={isEditOverviewOpen}
        onClose={() => setIsEditOverviewOpen(false)}
        overview={profileData.overview}
        onSave={handleSaveOverview}
        onDelete={handleDeleteOverview}
      />

      {/* Modal Tambah / Edit Fasilitas */}
      <EditFacilityModal
        isOpen={isEditFacilityOpen}
        onClose={() => setIsEditFacilityOpen(false)}
        facilityToEdit={facilityToEdit}
        onSave={handleSaveFacility}
      />
    </div>
  );
};
