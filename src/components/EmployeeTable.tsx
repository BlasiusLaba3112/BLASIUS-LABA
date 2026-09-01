import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Eye, 
  Printer, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  Building, 
  UserCheck, 
  ShieldCheck, 
  ShieldAlert,
  AlertCircle,
  Clock,
  ArrowUpDown,
  FileText,
  Lock,
  MapPin
} from 'lucide-react';
import { Employee } from '../types/employee';
import { WORK_UNITS, EMPLOYMENT_STATUSES } from '../data/initialData';
import { getCredentialStatus } from '../utils/helpers';

interface EmployeeTableProps {
  employees: Employee[];
  searchQuery: string;
  onSearchChange: (val: string) => void;
  statusFilter: string;
  onStatusFilterChange: (val: string) => void;
  unitFilter: string;
  onUnitFilterChange: (val: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (val: string) => void;
  isAdmin?: boolean;
  onViewEmployee: (emp: Employee) => void;
  onPrintEmployee: (emp: Employee) => void;
  onEditEmployee: (emp: Employee) => void;
  onDeleteEmployee: (emp: Employee) => void;
  onUploadDocument?: (emp: Employee) => void;
  onAddNew: () => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({
  employees,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  unitFilter,
  onUnitFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  isAdmin = false,
  onViewEmployee,
  onPrintEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onUploadDocument,
  onAddNew
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'fullName' | 'nip' | 'employmentStatus' | 'department'>('fullName');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Copy helper
  const handleCopyNip = (nip: string, id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(nip);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Sorting
  const handleSort = (field: 'fullName' | 'nip' | 'employmentStatus' | 'department') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filtered & Sorted list
  const filtered = employees.filter(emp => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      emp.fullName.toLowerCase().includes(q) ||
      emp.nip.toLowerCase().includes(q) ||
      emp.nik.toLowerCase().includes(q) ||
      emp.jobTitle.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q) ||
      emp.major.toLowerCase().includes(q) ||
      emp.strNumber.toLowerCase().includes(q) ||
      (emp.assignedVillage && emp.assignedVillage.toLowerCase().includes(q)) ||
      (emp.villageRole && emp.villageRole.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'ALL' || 
      emp.employmentStatus === statusFilter ||
      (statusFilter === 'HONOR' && ['Honorer Daerah', 'THL', 'Magang / Sukarela'].includes(emp.employmentStatus));
    const matchesUnit = unitFilter === 'ALL' || emp.department.includes(unitFilter);
    const matchesCategory = categoryFilter === 'ALL' || emp.staffCategory === categoryFilter;

    return matchesSearch && matchesStatus && matchesUnit && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    let valA = a[sortField] || '';
    let valB = b[sortField] || '';
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sorted.length / itemsPerPage) || 1;
  const paginated = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const resetFilters = () => {
    onSearchChange('');
    onStatusFilterChange('ALL');
    onUnitFilterChange('ALL');
    onCategoryFilterChange('ALL');
    setCurrentPage(1);
  };

  const hasActiveFilters = searchQuery || statusFilter !== 'ALL' || unitFilter !== 'ALL' || categoryFilter !== 'ALL';

  return (
    <div id="employee-table-container" className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden print:hidden">
      {/* Security Status Notification Banner */}
      {!isAdmin ? (
        <div id="security-locked-banner-table" className="px-4 py-3 bg-gradient-to-r from-amber-500/10 via-amber-50 to-amber-500/10 border-b border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
              <Lock className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <p className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                <span>Sistem Terkunci (Mode Hanya Lihat / Staf)</span>
                <span className="px-1.5 py-0.2 bg-amber-200/80 text-amber-900 text-[10px] font-bold rounded">Read-Only</span>
              </p>
              <p className="text-[11px] text-amber-800">
                Fitur Tambah Pegawai, Edit Data, Hapus, dan Upload Berkas dikunci aman khusus <strong>ADMINISTRATOR (@shyllpb)</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={onAddNew}
            className="self-start sm:self-center px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-200" />
            <span>Buka Kunci / Login Admin</span>
          </button>
        </div>
      ) : (
        <div id="security-admin-banner-table" className="px-4 py-2.5 bg-gradient-to-r from-emerald-500/10 via-emerald-50 to-emerald-500/10 border-b border-emerald-200/80 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs text-emerald-900">
              <strong>Sesi Administrator Aktif (@shyllpb)</strong> &bull; Akses penuh untuk Input Data Pegawai, Update Profil, 5 Desa, 16 Posyandu & 12 SPM.
            </p>
          </div>
          <span className="hidden md:inline-flex px-2 py-0.5 bg-emerald-200 text-emerald-900 text-[10px] font-mono font-bold rounded-full">
            Full Access
          </span>
        </div>
      )}

      {/* Table Toolbar & Filters */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">
        {/* Search Box */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-search-employee"
            type="text"
            placeholder="Cari nama pegawai, NIP, NIK, jabatan, atau STR..."
            value={searchQuery}
            onChange={(e) => { onSearchChange(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-slate-400 text-slate-800"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
            >
              &times;
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Unit Kerja Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-medium text-slate-600 hidden sm:inline">Unit:</label>
            <select
              id="select-filter-unit"
              value={unitFilter}
              onChange={(e) => { onUnitFilterChange(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium"
            >
              <option value="ALL">Semua Unit Kerja</option>
              {WORK_UNITS.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>

          {/* Status Kepegawaian Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-medium text-slate-600 hidden sm:inline">Status:</label>
            <select
              id="select-filter-status"
              value={statusFilter}
              onChange={(e) => { onStatusFilterChange(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium"
            >
              <option value="ALL">Semua Status</option>
              {EMPLOYMENT_STATUSES.map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Kategori Nakes Filter */}
          <div className="flex items-center gap-1.5">
            <label className="text-[11px] font-medium text-slate-600 hidden sm:inline">Kategori:</label>
            <select
              id="select-filter-category"
              value={categoryFilter}
              onChange={(e) => { onCategoryFilterChange(e.target.value); setCurrentPage(1); }}
              className="px-2.5 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-700 font-medium"
            >
              <option value="ALL">Nakes & Non-Nakes</option>
              <option value="Nakes">Tenaga Kesehatan (Nakes)</option>
              <option value="Non-Nakes">Non-Nakes / Administrasi</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              id="btn-clear-filters"
              onClick={resetFilters}
              className="px-2.5 py-1.5 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg font-medium border border-transparent transition-colors"
            >
              Reset Filter
            </button>
          )}
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table id="main-employee-table" className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4 w-12 text-center">No</th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                onClick={() => handleSort('fullName')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Nama Lengkap & NIP</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                onClick={() => handleSort('employmentStatus')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Status & Golongan</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th 
                className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition-colors select-none"
                onClick={() => handleSort('department')}
              >
                <div className="flex items-center gap-1.5">
                  <span>Jabatan & Unit Kerja</span>
                  <ArrowUpDown className="w-3 h-3 text-slate-400" />
                </div>
              </th>
              <th className="py-3 px-4">Status STR / SIP</th>
              <th className="py-3 px-4 text-center w-36">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  <div className="max-w-xs mx-auto flex flex-col items-center">
                    <AlertCircle className="w-10 h-10 text-slate-300 mb-2" />
                    <p className="font-semibold text-slate-700">Tidak ada data pegawai yang sesuai</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan kata kunci pencarian atau ubah filter status.</p>
                    <button
                      onClick={resetFilters}
                      className="mt-3 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-medium"
                    >
                      Tampilkan Semua Pegawai
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              paginated.map((emp, idx) => {
                const globalIndex = (currentPage - 1) * itemsPerPage + idx + 1;
                const strStatus = getCredentialStatus(emp.strExpiryDate, emp.strIsLifetime, emp.staffCategory === 'Nakes');
                const sipStatus = getCredentialStatus(emp.sipExpiryDate, false, emp.staffCategory === 'Nakes');

                return (
                  <tr 
                    key={emp.id}
                    id={`row-employee-${emp.id}`}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onViewEmployee(emp)}
                  >
                    {/* Index */}
                    <td className="py-3.5 px-4 text-center font-medium text-slate-400">
                      {globalIndex}
                    </td>

                    {/* Nama & NIP */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative flex-shrink-0">
                          <img
                            src={emp.photoUrl}
                            alt={emp.fullName}
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-full object-cover border border-slate-200 shadow-2xs"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(emp.fullName)}&background=2563eb&color=fff`;
                            }}
                          />
                          <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                            emp.employmentStatus === 'PNS' ? 'bg-green-500' :
                            emp.employmentStatus === 'PPPK' ? 'bg-blue-500' : 'bg-slate-400'
                          }`} />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors text-sm flex items-center gap-1.5">
                            <span className="truncate">{emp.fullName}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-mono mt-0.5">
                            <span>{emp.nipType}: {emp.nip}</span>
                            <button
                              id={`btn-copy-nip-${emp.id}`}
                              onClick={(e) => handleCopyNip(emp.nip, emp.id, e)}
                              className="p-0.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded"
                              title="Salin NIP/NIK"
                            >
                              {copiedId === emp.id ? (
                                <Check className="w-3 h-3 text-blue-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status & Pangkat */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          emp.employmentStatus === 'PNS' 
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                            : emp.employmentStatus === 'PPPK'
                            ? 'bg-teal-50 text-teal-700 border-teal-200'
                            : emp.employmentStatus === 'PPPK Paruh Waktu'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : emp.employmentStatus === 'Honorer Daerah'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : emp.employmentStatus === 'THL'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}>
                          {emp.employmentStatus}
                        </span>
                        <span className="text-[11px] text-slate-600 font-medium">
                          {emp.rankGrade || '-'}
                        </span>
                      </div>
                    </td>

                    {/* Jabatan & Unit Kerja */}
                    <td className="py-3.5 px-4">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-semibold text-slate-800 line-clamp-1">{emp.jobTitle}</p>
                          {(emp.isVillageHealthWorker || emp.assignedVillage) && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-[9px] font-bold">
                              <MapPin className="w-2.5 h-2.5 text-emerald-600" />
                              {emp.assignedVillage || 'Nakes Desa'}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span className="truncate">{emp.department}</span>
                        </p>
                      </div>
                    </td>

                    {/* Status STR & SIP */}
                    <td className="py-3.5 px-4">
                      {emp.staffCategory === 'Nakes' ? (
                        <div className="flex flex-col gap-1 text-[10px]">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-medium text-slate-500 w-7">STR:</span>
                            <span className={`px-1.5 py-0.5 rounded border font-medium ${strStatus.badgeClass}`}>
                              {emp.strIsLifetime ? 'Seumur Hidup' : (emp.strExpiryDate ? strStatus.label : 'Belum Ada')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-medium text-slate-500 w-7">SIP:</span>
                            <span className={`px-1.5 py-0.5 rounded border font-medium ${sipStatus.badgeClass}`}>
                              {emp.sipExpiryDate ? sipStatus.label : 'Belum Ada'}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] text-slate-400 italic">
                          <span>Non-Tenaga Medis</span>
                        </span>
                      )}
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-1 bg-slate-50 p-1 rounded-lg border border-slate-200">
                        {/* Lihat Profil Detail */}
                        <button
                          id={`btn-view-${emp.id}`}
                          onClick={() => onViewEmployee(emp)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-colors"
                          title="Lihat Biodata Lengkap"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Cetak Profil Resmi A4 */}
                        <button
                          id={`btn-print-${emp.id}`}
                          onClick={() => onPrintEmployee(emp)}
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-colors"
                          title="Cetak Profil / Biodata Resmi"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* Upload & Kelola Berkas PDF */}
                        {onUploadDocument && (
                          <button
                            id={`btn-upload-doc-${emp.id}`}
                            onClick={() => onUploadDocument(emp)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-colors relative"
                            title={`Upload / Kelola Berkas PDF (${emp.documents?.length || 0} berkas terlampir)`}
                          >
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            {Boolean(emp.documents && emp.documents.length > 0) && (
                              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-blue-600 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                                {emp.documents?.length}
                              </span>
                            )}
                          </button>
                        )}

                        {/* Edit Data */}
                        <button
                          id={`btn-edit-${emp.id}`}
                          onClick={() => onEditEmployee(emp)}
                          className={`p-1.5 rounded transition-colors ${
                            isAdmin 
                              ? 'text-slate-500 hover:text-blue-600 hover:bg-white' 
                              : 'text-slate-400 hover:text-amber-700 hover:bg-amber-50'
                          }`}
                          title={isAdmin ? "Edit Data Pegawai" : "Hanya Admin yang dapat mengedit data (Klik untuk Login)"}
                        >
                          {isAdmin ? <Edit3 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5 text-amber-600" />}
                        </button>

                        {/* Hapus Data (Khusus Admin) */}
                        {isAdmin && (
                          <button
                            id={`btn-delete-${emp.id}`}
                            onClick={() => onDeleteEmployee(emp)}
                            className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-white rounded transition-colors"
                            title="Hapus Pegawai (Khusus Admin)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Menampilkan <strong className="text-slate-800">{paginated.length}</strong> dari <strong className="text-slate-800">{filtered.length}</strong> pegawai terfilter ({employees.length} total)
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            Sebelumnya
          </button>
          <span className="px-2 font-medium text-slate-700">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-2.5 py-1 bg-white border border-slate-300 rounded text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
};
