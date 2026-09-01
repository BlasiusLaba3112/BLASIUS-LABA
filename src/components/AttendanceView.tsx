/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  CalendarCheck, 
  Printer, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  Users, 
  AlertCircle, 
  Sparkles, 
  Save, 
  RotateCcw, 
  FileText, 
  Calendar, 
  ChevronRight, 
  Check, 
  Layers, 
  Lock, 
  Info,
  Building2,
  FileSpreadsheet
} from 'lucide-react';
import { Employee, PuskesmasInfo } from '../types/employee';
import { 
  EmployeeMonthlyAttendance, 
  AttendanceStatusType, 
  MONTH_NAMES_INDONESIAN, 
  DailyAttendanceRecord 
} from '../types/attendance';
import { 
  calculateAttendanceSummary, 
  createDefaultMonthlyAttendance, 
  getDaysInMonth 
} from '../utils/attendanceHelpers';
import { PrintAttendanceModal } from './PrintAttendanceModal';
import { PrintAttendanceRekapModal } from './PrintAttendanceRekapModal';

interface AttendanceViewProps {
  employees: Employee[];
  puskesmasInfo: PuskesmasInfo;
  attendanceMap: Record<string, EmployeeMonthlyAttendance>;
  onSaveAttendance: (record: EmployeeMonthlyAttendance) => void;
  onBatchSaveAttendance: (records: EmployeeMonthlyAttendance[]) => void;
  isAdmin: boolean;
  onOpenLogin: () => void;
  showToast: (msg: string, type: 'success' | 'info' | 'error') => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  employees,
  puskesmasInfo,
  attendanceMap,
  onSaveAttendance,
  onBatchSaveAttendance,
  isAdmin,
  onOpenLogin,
  showToast
}) => {
  // Month & Year state (Default September 2026 as per user requirement)
  const [selectedMonth, setSelectedMonth] = useState<number>(9); // September
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Active Tab inside attendance view: 'individual-form' | 'rekap-table' | 'daily-quick'
  const [activeTab, setActiveTab] = useState<'individual-form' | 'rekap-table' | 'daily-quick'>('individual-form');

  // Selected employee for individual form
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>(() => {
    return employees.length > 0 ? employees[0].id : '';
  });

  // Filter & Search state for employee list
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');

  // Selected Day for daily quick check-in tab
  const [selectedDailyDay, setSelectedDailyDay] = useState<number>(1);

  // Print Modals State
  const [isPrintIndividualOpen, setIsPrintIndividualOpen] = useState(false);
  const [isPrintRekapOpen, setIsPrintRekapOpen] = useState(false);

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter(emp => {
      const matchSearch = emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          emp.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'Semua' || emp.employmentStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [employees, searchQuery, statusFilter]);

  // Current month's attendance records for all employees
  const currentMonthAttendanceList = useMemo(() => {
    return employees.map(emp => {
      const key = `att_${emp.id}_${selectedYear}_${selectedMonth.toString().padStart(2, '0')}`;
      if (attendanceMap[key]) {
        return attendanceMap[key];
      }
      return createDefaultMonthlyAttendance(emp, selectedMonth, selectedYear, true);
    });
  }, [employees, attendanceMap, selectedMonth, selectedYear]);

  // Currently active employee's attendance record
  const currentEmployeeAttendance = useMemo(() => {
    const targetEmp = employees.find(e => e.id === selectedEmployeeId) || employees[0];
    if (!targetEmp) return null;

    const key = `att_${targetEmp.id}_${selectedYear}_${selectedMonth.toString().padStart(2, '0')}`;
    if (attendanceMap[key]) {
      return attendanceMap[key];
    }
    return createDefaultMonthlyAttendance(targetEmp, selectedMonth, selectedYear, true);
  }, [employees, selectedEmployeeId, attendanceMap, selectedMonth, selectedYear]);

  // Aggregate statistics for the month
  const stats = useMemo(() => {
    let totalH = 0;
    let totalTL = 0;
    let totalS = 0;
    let totalI = 0;
    let totalC = 0;
    let totalTK = 0;
    let sumPercentage = 0;

    currentMonthAttendanceList.forEach(item => {
      totalH += item.summary.hCount;
      totalTL += item.summary.tlCount;
      totalS += item.summary.sCount;
      totalI += item.summary.iCount;
      totalC += item.summary.cCount;
      totalTK += item.summary.tkCount;
      sumPercentage += item.summary.attendancePercentage;
    });

    const count = currentMonthAttendanceList.length;
    const avgPercentage = count > 0 ? Math.round(sumPercentage / count) : 0;

    return {
      totalH,
      totalTL,
      totalS,
      totalI,
      totalC,
      totalTK,
      avgPercentage,
      totalEmployees: count
    };
  }, [currentMonthAttendanceList]);

  // Handlers for updating status in individual form
  const handleToggleDayStatus = (dayIndex: number, newStatus: AttendanceStatusType) => {
    if (!isAdmin) {
      showToast('Akses Terbatas: Hanya Administrator yang dapat mengubah data presensi.', 'info');
      onOpenLogin();
      return;
    }
    if (!currentEmployeeAttendance) return;

    const daysCount = getDaysInMonth(selectedMonth, selectedYear);
    const updatedDaily = [...currentEmployeeAttendance.dailyRecords];
    const targetDay = updatedDaily[dayIndex];

    if (targetDay.day > daysCount) return;

    // Toggle logic: If clicking the active status, clear it; otherwise set new status
    const resultingStatus: AttendanceStatusType = targetDay.status === newStatus ? '' : newStatus;

    updatedDaily[dayIndex] = {
      ...targetDay,
      status: resultingStatus,
      signatureParaf: resultingStatus ? '✓' : '',
      checkInTime: targetDay.checkInTime || '',
      checkOutTime: targetDay.checkOutTime || '',
    };

    const newSummary = calculateAttendanceSummary(updatedDaily, daysCount);
    const updatedRecord: EmployeeMonthlyAttendance = {
      ...currentEmployeeAttendance,
      dailyRecords: updatedDaily,
      summary: newSummary,
      updatedAt: new Date().toISOString()
    };

    onSaveAttendance(updatedRecord);
  };

  const handleTimeChange = (dayIndex: number, field: 'checkInTime' | 'checkOutTime', value: string) => {
    if (!isAdmin) {
      showToast('Akses Terbatas: Hanya Administrator yang dapat mengubah data presensi.', 'info');
      onOpenLogin();
      return;
    }
    if (!currentEmployeeAttendance) return;

    const updatedDaily = [...currentEmployeeAttendance.dailyRecords];
    updatedDaily[dayIndex] = {
      ...updatedDaily[dayIndex],
      [field]: value
    };

    const updatedRecord: EmployeeMonthlyAttendance = {
      ...currentEmployeeAttendance,
      dailyRecords: updatedDaily,
      updatedAt: new Date().toISOString()
    };

    onSaveAttendance(updatedRecord);
  };

  const handleAutoFillWorkdays = () => {
    if (!isAdmin) {
      showToast('Akses Terbatas: Hanya Administrator yang dapat mengubah data presensi.', 'info');
      onOpenLogin();
      return;
    }
    const targetEmp = employees.find(e => e.id === selectedEmployeeId);
    if (!targetEmp) return;

    const newRecord = createDefaultMonthlyAttendance(targetEmp, selectedMonth, selectedYear, true);
    onSaveAttendance(newRecord);
    showToast(`Presensi ${targetEmp.fullName} berhasil diisi hadir (H) untuk seluruh hari kerja!`, 'success');
  };

  const handleResetAttendance = () => {
    if (!isAdmin) {
      showToast('Akses Terbatas: Hanya Administrator yang dapat mengubah data presensi.', 'info');
      onOpenLogin();
      return;
    }
    const targetEmp = employees.find(e => e.id === selectedEmployeeId);
    if (!targetEmp) return;

    const newRecord = createDefaultMonthlyAttendance(targetEmp, selectedMonth, selectedYear, false);
    onSaveAttendance(newRecord);
    showToast(`Presensi ${targetEmp.fullName} berhasil dikosongkan.`, 'info');
  };

  const handleAutoFillAllEmployees = () => {
    if (!isAdmin) {
      showToast('Akses Terbatas: Hanya Administrator yang dapat mengubah data presensi.', 'info');
      onOpenLogin();
      return;
    }

    const updatedList = employees.map(emp => 
      createDefaultMonthlyAttendance(emp, selectedMonth, selectedYear, true)
    );
    onBatchSaveAttendance(updatedList);
    showToast(`Seluruh ${employees.length} Pegawai berhasil ditandai hadir (H) untuk Bulan ${MONTH_NAMES_INDONESIAN[selectedMonth - 1]} ${selectedYear}!`, 'success');
  };

  // Daily Quick Check-in toggle
  const handleQuickDailyToggle = (empId: string, status: AttendanceStatusType) => {
    if (!isAdmin) {
      showToast('Akses Terbatas: Hanya Administrator yang dapat mengubah data presensi.', 'info');
      onOpenLogin();
      return;
    }

    const key = `att_${empId}_${selectedYear}_${selectedMonth.toString().padStart(2, '0')}`;
    const currentRecord = attendanceMap[key] || 
      createDefaultMonthlyAttendance(employees.find(e => e.id === empId)!, selectedMonth, selectedYear, true);

    const daysCount = getDaysInMonth(selectedMonth, selectedYear);
    const dayIndex = selectedDailyDay - 1;
    const updatedDaily = [...currentRecord.dailyRecords];

    const currentDayRecord = updatedDaily[dayIndex];
    const newStatus = currentDayRecord.status === status ? '' : status;

    updatedDaily[dayIndex] = {
      ...currentDayRecord,
      status: newStatus,
      signatureParaf: newStatus ? '✓' : '',
      checkInTime: newStatus ? (currentDayRecord.checkInTime || '08.00') : '',
      checkOutTime: newStatus ? (currentDayRecord.checkOutTime || '14.00') : ''
    };

    const newSummary = calculateAttendanceSummary(updatedDaily, daysCount);
    const updatedRecord: EmployeeMonthlyAttendance = {
      ...currentRecord,
      dailyRecords: updatedDaily,
      summary: newSummary,
      updatedAt: new Date().toISOString()
    };

    onSaveAttendance(updatedRecord);
  };

  return (
    <div id="attendance-view-container" className="space-y-6 animate-in fade-in duration-300">
      {/* 1. Header Hero Card with Period Selector & Quick Actions */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-700/60 relative overflow-hidden">
        {/* Background ambient decoration */}
        <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute left-1/3 bottom-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-semibold border border-emerald-500/30">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Modul Presensi & Daftar Hadir Pegawai</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Daftar Hadir Pegawai</span>
              <span className="text-sm font-bold px-3 py-1 bg-emerald-600/60 border border-emerald-400/40 rounded-xl text-emerald-200">
                {MONTH_NAMES_INDONESIAN[selectedMonth - 1]} {selectedYear}
              </span>
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Format lembar absensi resmi 100% sesuai standar UPT Puskesmas Boganatar dengan pencatatan jam kerja (08.00 - 14.00), klasifikasi presensi (Hadir, Tugas Luar BOK, Dinkes, Sakit, Izin, Cuti, Alpa), rekapitulasi otomatis, dan cetak form resmi A4.
            </p>
          </div>

          {/* Month & Year Selectors and Print Rekap Button */}
          <div className="flex flex-wrap items-center gap-3 bg-slate-800/80 p-3 rounded-2xl border border-slate-700 backdrop-blur-md">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <select
                id="select-attendance-month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {MONTH_NAMES_INDONESIAN.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    Bulan {m}
                  </option>
                ))}
              </select>

              <select
                id="select-attendance-year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-xl border border-slate-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 cursor-pointer"
              >
                {[2024, 2025, 2026, 2027].map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              id="btn-print-rekap-attendance"
              onClick={() => setIsPrintRekapOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer"
              title="Cetak Rekapitulasi Presensi Seluruh Pegawai (Landscape A4)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Cetak Rekap Bulanan</span>
            </button>
          </div>
        </div>

        {/* Statistical Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/50">
            <span className="text-[11px] text-slate-400 block font-medium">Total Pegawai</span>
            <div className="text-lg sm:text-xl font-black text-white mt-0.5">{stats.totalEmployees}</div>
            <span className="text-[10px] text-slate-400">UPT Boganatar</span>
          </div>

          <div className="bg-emerald-950/40 p-3 rounded-2xl border border-emerald-800/40">
            <span className="text-[11px] text-emerald-300 block font-medium">Total Hadir (H)</span>
            <div className="text-lg sm:text-xl font-black text-emerald-400 mt-0.5">{stats.totalH}</div>
            <span className="text-[10px] text-emerald-400/80">Check-in Kantor</span>
          </div>

          <div className="bg-cyan-950/40 p-3 rounded-2xl border border-cyan-800/40">
            <span className="text-[11px] text-cyan-300 block font-medium">Tugas Luar (TL)</span>
            <div className="text-lg sm:text-xl font-black text-cyan-400 mt-0.5">{stats.totalTL}</div>
            <span className="text-[10px] text-cyan-400/80">BOK & Dinkes</span>
          </div>

          <div className="bg-amber-950/40 p-3 rounded-2xl border border-amber-800/40">
            <span className="text-[11px] text-amber-300 block font-medium">Sakit (S)</span>
            <div className="text-lg sm:text-xl font-black text-amber-400 mt-0.5">{stats.totalS}</div>
            <span className="text-[10px] text-amber-400/80">Surat Keterangan</span>
          </div>

          <div className="bg-purple-950/40 p-3 rounded-2xl border border-purple-800/40">
            <span className="text-[11px] text-purple-300 block font-medium">Izin (I) / Cuti (C)</span>
            <div className="text-lg sm:text-xl font-black text-purple-300 mt-0.5">{stats.totalI + stats.totalC}</div>
            <span className="text-[10px] text-purple-300/80">I:{stats.totalI} &bull; C:{stats.totalC}</span>
          </div>

          <div className="bg-rose-950/40 p-3 rounded-2xl border border-rose-800/40">
            <span className="text-[11px] text-rose-300 block font-medium">Alpa / TK</span>
            <div className="text-lg sm:text-xl font-black text-rose-400 mt-0.5">{stats.totalTK}</div>
            <span className="text-[10px] text-rose-400/80">Tanpa Keterangan</span>
          </div>

          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-3 rounded-2xl text-white shadow-md">
            <span className="text-[11px] text-emerald-100 block font-medium">Rata-rata Presensi</span>
            <div className="text-xl sm:text-2xl font-black mt-0.5">{stats.avgPercentage}%</div>
            <span className="text-[10px] text-emerald-200">Bulan {MONTH_NAMES_INDONESIAN[selectedMonth - 1]}</span>
          </div>
        </div>
      </div>

      {/* 2. Sub-Tab Switcher: Format Form PDF Resmi vs Rekapitulasi vs Input Harian Cepat */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
          <button
            id="tab-view-individual-form"
            onClick={() => setActiveTab('individual-form')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'individual-form'
                ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-emerald-600" />
            <span>Formulir Presensi Individu (Format PDF)</span>
          </button>

          <button
            id="tab-view-rekap-table"
            onClick={() => setActiveTab('rekap-table')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'rekap-table'
                ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4 text-emerald-600" />
            <span>Matriks Rekap Seluruh Pegawai</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-black">
              {employees.length}
            </span>
          </button>

          <button
            id="tab-view-daily-quick"
            onClick={() => setActiveTab('daily-quick')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'daily-quick'
                ? 'bg-white text-emerald-800 shadow-xs ring-1 ring-emerald-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-4 h-4 text-emerald-600" />
            <span>Input Presensi Harian Cepat</span>
          </button>
        </div>

        {/* Admin Quick Action Button */}
        {isAdmin && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleAutoFillAllEmployees}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition-colors cursor-pointer"
              title="Isi Hadir Otomatis untuk Seluruh Pegawai di Hari Kerja"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Isi Hadir Semua Pegawai (Auto-Fill)</span>
            </button>
          </div>
        )}
      </div>

      {/* 3. TAB CONTENT 1: Formulir Presensi Individu (Format Lembar Resmi PDF Sesuai Dokumen) */}
      {activeTab === 'individual-form' && currentEmployeeAttendance && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Employee Selector & Filter List (lg:col-span-4) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-5 shadow-xs border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-600" />
                <span>Pilih Pegawai ({filteredEmployees.length})</span>
              </h3>
            </div>

            {/* Search and Status filter */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari nama, NIP, jabatan..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Semua">Semua Status Kepegawaian</option>
                <option value="PNS">PNS</option>
                <option value="PPPK">PPPK</option>
                <option value="PPPK Paruh Waktu">PPPK Paruh Waktu</option>
                <option value="Honorer Daerah">Honorer Daerah</option>
                <option value="THL">THL</option>
              </select>
            </div>

            {/* Employee List Scrolling */}
            <div className="max-h-[560px] overflow-y-auto space-y-1.5 pr-1">
              {filteredEmployees.map((emp) => {
                const isSelected = emp.id === selectedEmployeeId;
                const empKey = `att_${emp.id}_${selectedYear}_${selectedMonth.toString().padStart(2, '0')}`;
                const empAtt = attendanceMap[empKey] || createDefaultMonthlyAttendance(emp, selectedMonth, selectedYear, true);

                return (
                  <button
                    key={emp.id}
                    onClick={() => setSelectedEmployeeId(emp.id)}
                    className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200/60'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-xs truncate">{emp.fullName}</div>
                      <div className={`text-[10px] truncate ${isSelected ? 'text-emerald-100' : 'text-slate-500'}`}>
                        {emp.jobTitle} &bull; {emp.employmentStatus}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                        isSelected ? 'bg-emerald-800 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {empAtt.summary.attendancePercentage}%
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Official Form Sheet Preview & Interactive Editor (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Top Interactive Actions Bar for Form */}
            <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-800">
                  Formulir Presensi: <strong className="text-emerald-700">{currentEmployeeAttendance.employeeName}</strong>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {isAdmin ? (
                  <>
                    <button
                      onClick={handleAutoFillWorkdays}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      title="Isi Hadir Otomatis (Senin - Sabtu)"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Isi Hari Kerja</span>
                    </button>
                    <button
                      onClick={handleResetAttendance}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
                      title="Kosongkan Isian Presensi"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                      <span>Reset</span>
                    </button>
                  </>
                ) : (
                  <span className="text-[11px] text-slate-500 flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-lg">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Mode Lihat (Login Admin untuk Edit)</span>
                  </span>
                )}

                {/* Primary Button: Print Official PDF Form */}
                <button
                  id="btn-print-official-form"
                  onClick={() => setIsPrintIndividualOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Cetak Form PDF (Format Resmi)</span>
                </button>
              </div>
            </div>

            {/* Official Sheet Container (Styled like the uploaded PDF) */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border-2 border-slate-300 font-sans text-slate-900">
              {/* 1. KOP SURAT */}
              <div className="border-b-2 border-black pb-2 mb-3 relative min-h-[85px] flex items-center">
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

              {/* 2. TITLE */}
              <div className="text-center my-2">
                <h2 className="text-xs sm:text-sm font-black uppercase text-black tracking-wide">
                  DAFTAR HADIR PEGAWAI
                </h2>
                <h3 className="text-xs sm:text-sm font-bold uppercase text-black">
                  BULAN {currentEmployeeAttendance.monthName.toUpperCase()}
                </h3>
              </div>

              {/* 3. IDENTITAS PEGAWAI */}
              <div className="border border-black p-2.5 mb-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1">
                  <div className="space-y-0.5">
                    <div className="flex">
                      <span className="w-28 font-medium text-slate-700">Nama Pegawai</span>
                      <span className="mr-1">:</span>
                      <span className="font-bold text-black uppercase">{currentEmployeeAttendance.employeeName}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 font-medium text-slate-700">NIP</span>
                      <span className="mr-1">:</span>
                      <span className="font-mono text-black">{currentEmployeeAttendance.nip || '-'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-28 font-medium text-slate-700">Jabatan</span>
                      <span className="mr-1">:</span>
                      <span className="text-black">{currentEmployeeAttendance.jobTitle || '-'}</span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex">
                      <span className="w-32 font-medium text-slate-700">Status Pegawai</span>
                      <span className="mr-1">:</span>
                      <span className="font-semibold text-black">{currentEmployeeAttendance.employmentStatus || '-'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-medium text-slate-700">Pangkat/Golongan</span>
                      <span className="mr-1">:</span>
                      <span className="text-black">{currentEmployeeAttendance.rankGrade || '-'}</span>
                    </div>
                    <div className="flex">
                      <span className="w-32 font-medium text-slate-700">Bulan/tahun</span>
                      <span className="mr-1">:</span>
                      <span className="text-black font-semibold">{currentEmployeeAttendance.monthName} / {currentEmployeeAttendance.year}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Instruction banner */}
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-3 py-1.5 rounded-xl text-[11px] mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>
                    <strong>Panduan Presensi:</strong> Klik langsung pada kotak <strong>H, TK BOK, TK DINKES, S, I, C, TK</strong> untuk mencentang status.
                  </span>
                </div>
                <span className="font-bold text-emerald-800">
                  Total Hari Kerja: {currentEmployeeAttendance.summary.totalWorkDays} Hari
                </span>
              </div>

              {/* 4. TABEL INTERAKTIF PRESENSI KEHADIRAN (1 s.d. 31) */}
              <div className="overflow-x-auto border border-black">
                <table className="w-full border-collapse text-xs text-center">
                  <thead>
                    <tr className="bg-slate-100 text-black font-bold">
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
                    <tr className="bg-slate-100 text-black font-bold text-[11px]">
                      <th className="border border-black p-1 w-20 font-semibold">
                        Masuk<br /><span className="text-[10px] font-normal">08.00</span>
                      </th>
                      <th className="border border-black p-1 w-20 font-semibold">
                        Keluar<br /><span className="text-[10px] font-normal">14.00</span>
                      </th>
                      <th className="border border-black p-1 w-11 bg-emerald-50/70" title="Hadir">H</th>
                      <th className="border border-black p-1 w-16 bg-cyan-50/70" title="Tugas Keluar BOK">TK BOK</th>
                      <th className="border border-black p-1 w-18 bg-blue-50/70" title="Tugas Keluar Dinkes">TK DINKES</th>
                      <th className="border border-black p-1 w-11 bg-amber-50/70" title="Sakit">S</th>
                      <th className="border border-black p-1 w-11 bg-purple-50/70" title="Izin">I</th>
                      <th className="border border-black p-1 w-11 bg-indigo-50/70" title="Cuti">C</th>
                      <th className="border border-black p-1 w-11 bg-rose-50/70" title="Tanpa Keterangan / Alpa">TK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentEmployeeAttendance.dailyRecords.map((record, index) => {
                      const isSunday = record.isSunday;
                      const status = record.status;

                      return (
                        <tr 
                          key={record.day}
                          className={`hover:bg-slate-50 transition-colors ${
                            isSunday ? 'bg-slate-100/80 text-slate-500' : ''
                          }`}
                        >
                          {/* Tanggal & Hari */}
                          <td className="border border-black p-1 font-bold text-slate-900">
                            <span>{record.day}</span>
                            {record.dayName && (
                              <span className={`block text-[9px] font-normal ${isSunday ? 'text-rose-600 font-semibold' : 'text-slate-500'}`}>
                                {record.dayName}
                              </span>
                            )}
                          </td>

                          {/* Jam Masuk */}
                          <td className="border border-black p-0.5 w-16 h-7 text-center">
                            {isAdmin && !isSunday ? (
                              <input
                                type="text"
                                value={record.checkInTime || ''}
                                onChange={(e) => handleTimeChange(index, 'checkInTime', e.target.value)}
                                className="w-full text-center font-mono text-[11px] bg-transparent focus:bg-emerald-50 focus:outline-hidden py-0.5"
                              />
                            ) : (
                              <span className="font-mono text-[11px]">{record.checkInTime || ''}</span>
                            )}
                          </td>

                          {/* Jam Keluar */}
                          <td className="border border-black p-0.5 w-16 h-7 text-center">
                            {isAdmin && !isSunday ? (
                              <input
                                type="text"
                                value={record.checkOutTime || ''}
                                onChange={(e) => handleTimeChange(index, 'checkOutTime', e.target.value)}
                                className="w-full text-center font-mono text-[11px] bg-transparent focus:bg-emerald-50 focus:outline-hidden py-0.5"
                              />
                            ) : (
                              <span className="font-mono text-[11px]">{record.checkOutTime || ''}</span>
                            )}
                          </td>

                          {/* Status Columns: H, TK_BOK, TK_DINKES, S, I, C, TK */}
                          {/* 1. H (Hadir) */}
                          <td 
                            onClick={() => !isSunday && handleToggleDayStatus(index, 'H')}
                            className={`border border-black p-1 cursor-pointer transition-colors ${
                              status === 'H' 
                                ? 'bg-emerald-600 text-white font-black' 
                                : 'hover:bg-emerald-100'
                            }`}
                          >
                            {status === 'H' ? '✓' : ''}
                          </td>

                          {/* 2. TK BOK */}
                          <td 
                            onClick={() => !isSunday && handleToggleDayStatus(index, 'TK_BOK')}
                            className={`border border-black p-1 cursor-pointer transition-colors ${
                              status === 'TK_BOK' 
                                ? 'bg-cyan-600 text-white font-black' 
                                : 'hover:bg-cyan-100'
                            }`}
                          >
                            {status === 'TK_BOK' ? '✓' : ''}
                          </td>

                          {/* 3. TK DINKES */}
                          <td 
                            onClick={() => !isSunday && handleToggleDayStatus(index, 'TK_DINKES')}
                            className={`border border-black p-1 cursor-pointer transition-colors ${
                              status === 'TK_DINKES' 
                                ? 'bg-blue-600 text-white font-black' 
                                : 'hover:bg-blue-100'
                            }`}
                          >
                            {status === 'TK_DINKES' ? '✓' : ''}
                          </td>

                          {/* 4. S (Sakit) */}
                          <td 
                            onClick={() => !isSunday && handleToggleDayStatus(index, 'S')}
                            className={`border border-black p-1 cursor-pointer transition-colors ${
                              status === 'S' 
                                ? 'bg-amber-500 text-white font-black' 
                                : 'hover:bg-amber-100'
                            }`}
                          >
                            {status === 'S' ? '✓' : ''}
                          </td>

                          {/* 5. I (Izin) */}
                          <td 
                            onClick={() => !isSunday && handleToggleDayStatus(index, 'I')}
                            className={`border border-black p-1 cursor-pointer transition-colors ${
                              status === 'I' 
                                ? 'bg-purple-600 text-white font-black' 
                                : 'hover:bg-purple-100'
                            }`}
                          >
                            {status === 'I' ? '✓' : ''}
                          </td>

                          {/* 6. C (Cuti) */}
                          <td 
                            onClick={() => !isSunday && handleToggleDayStatus(index, 'C')}
                            className={`border border-black p-1 cursor-pointer transition-colors ${
                              status === 'C' 
                                ? 'bg-indigo-600 text-white font-black' 
                                : 'hover:bg-indigo-100'
                            }`}
                          >
                            {status === 'C' ? '✓' : ''}
                          </td>

                          {/* 7. TK (Alpa / Tanpa Keterangan) */}
                          <td 
                            onClick={() => !isSunday && handleToggleDayStatus(index, 'TK')}
                            className={`border border-black p-1 cursor-pointer transition-colors ${
                              status === 'TK' 
                                ? 'bg-rose-600 text-white font-black' 
                                : 'hover:bg-rose-100'
                            }`}
                          >
                            {status === 'TK' ? '✓' : ''}
                          </td>

                          {/* PARAF */}
                          <td className="border border-black p-0.5 text-center text-slate-700 font-mono text-[10px]">
                            {status === 'H' || status === 'TK_BOK' || status === 'TK_DINKES' ? (
                              <span className="text-emerald-700 font-serif italic font-bold">✓</span>
                            ) : (
                              ''
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* 5. NB KETERANGAN */}
              <div className="mt-2 text-xs font-bold text-black uppercase">
                NB.DI CENTANG PADA KOTAK PRESENSI KEHADIRAN
              </div>

              {/* 6. TABEL REKAPITULASI KEHADIRAN */}
              <div className="mt-3 overflow-x-auto border border-black">
                <table className="w-full border-collapse text-xs text-center">
                  <thead>
                    <tr className="bg-slate-100 font-bold">
                      <th className="border border-black p-2 w-36 uppercase">
                        REKAPITULASI KEHADIRAN
                      </th>
                      <th className="border border-black p-2 w-14">H</th>
                      <th className="border border-black p-2 w-14">TL</th>
                      <th className="border border-black p-2 w-14">S</th>
                      <th className="border border-black p-2 w-14">I</th>
                      <th className="border border-black p-2 w-14">C</th>
                      <th className="border border-black p-2 w-14">TK</th>
                      <th className="border border-black p-2 w-40 uppercase">
                        PERSENTASI KEHADIRAN
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="font-bold text-sm h-8 bg-white">
                      <td className="border border-black p-1 text-slate-500 font-normal">
                        Total
                      </td>
                      <td className="border border-black p-1 font-mono text-emerald-700 font-black">
                        {currentEmployeeAttendance.summary.hCount}
                      </td>
                      <td className="border border-black p-1 font-mono text-cyan-700 font-black">
                        {currentEmployeeAttendance.summary.tlCount}
                      </td>
                      <td className="border border-black p-1 font-mono text-amber-700 font-black">
                        {currentEmployeeAttendance.summary.sCount}
                      </td>
                      <td className="border border-black p-1 font-mono text-purple-700 font-black">
                        {currentEmployeeAttendance.summary.iCount}
                      </td>
                      <td className="border border-black p-1 font-mono text-indigo-700 font-black">
                        {currentEmployeeAttendance.summary.cCount}
                      </td>
                      <td className="border border-black p-1 font-mono text-rose-700 font-black">
                        {currentEmployeeAttendance.summary.tkCount}
                      </td>
                      <td className="border border-black p-1 font-mono text-base font-black text-emerald-800 bg-emerald-50/50">
                        {currentEmployeeAttendance.summary.attendancePercentage}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* 7. PENGESAHAN KEPALA PUSKESMAS */}
              <div className="mt-6 flex justify-end">
                <div className="text-center w-72 text-xs">
                  <div>
                    {currentEmployeeAttendance.signedLocation || 'Kringa'}, {currentEmployeeAttendance.signedDate || `01 ${currentEmployeeAttendance.monthName} ${currentEmployeeAttendance.year}`}
                  </div>
                  <div className="font-semibold mt-0.5">
                    Kepala UPT Puskesmas Boganatar
                  </div>

                  <div className="h-16 flex items-center justify-center">
                    <span className="text-[10px] text-slate-400 italic">Tanda Tangan & Cap</span>
                  </div>

                  <div className="font-bold underline text-black uppercase">
                    {currentEmployeeAttendance.headName || 'Christiana Lensi,S.KM'}
                  </div>
                  <div>{currentEmployeeAttendance.headRank || 'Penata TK 1, III/d'}</div>
                  <div className="font-mono">{currentEmployeeAttendance.headNip || 'NIP.19750403 200112 2 003'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB CONTENT 2: Matriks Rekap Seluruh Pegawai */}
      {activeTab === 'rekap-table' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Rekapitulasi Presensi Seluruh Pegawai ({employees.length} Personel)
              </h3>
              <p className="text-xs text-slate-500">
                Bulan {MONTH_NAMES_INDONESIAN[selectedMonth - 1]} {selectedYear} &bull; UPT Puskesmas Boganatar
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Cari pegawai..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <button
                onClick={() => setIsPrintRekapOpen(true)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Cetak Rekap (A4)</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-bold text-center border-b border-slate-300">
                  <th className="p-2.5 w-10">No</th>
                  <th className="p-2.5 text-left">Nama Pegawai & NIP</th>
                  <th className="p-2.5 text-left">Jabatan</th>
                  <th className="p-2.5">Status</th>
                  <th className="p-2.5 w-12 bg-emerald-50 text-emerald-800">H</th>
                  <th className="p-2.5 w-12 bg-cyan-50 text-cyan-800">TL</th>
                  <th className="p-2.5 w-12 bg-amber-50 text-amber-800">S</th>
                  <th className="p-2.5 w-12 bg-purple-50 text-purple-800">I</th>
                  <th className="p-2.5 w-12 bg-indigo-50 text-indigo-800">C</th>
                  <th className="p-2.5 w-12 bg-rose-50 text-rose-800">TK</th>
                  <th className="p-2.5 w-20 bg-slate-200">Persentase</th>
                  <th className="p-2.5 w-24">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {currentMonthAttendanceList
                  .filter(item => {
                    return item.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
                  })
                  .map((item, idx) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 text-center font-medium text-slate-500">{idx + 1}</td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{item.employeeName}</div>
                        <div className="text-[10px] text-slate-500 font-mono">NIP: {item.nip || '-'}</div>
                      </td>
                      <td className="p-2.5 text-slate-700">{item.jobTitle}</td>
                      <td className="p-2.5 text-center">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-800 rounded-md font-semibold text-[10px]">
                          {item.employmentStatus}
                        </span>
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-emerald-700 bg-emerald-50/40">
                        {item.summary.hCount}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-cyan-700 bg-cyan-50/40">
                        {item.summary.tlCount}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-amber-700 bg-amber-50/40">
                        {item.summary.sCount}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-purple-700 bg-purple-50/40">
                        {item.summary.iCount}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-indigo-700 bg-indigo-50/40">
                        {item.summary.cCount}
                      </td>
                      <td className="p-2.5 text-center font-mono font-bold text-rose-700 bg-rose-50/40">
                        {item.summary.tkCount}
                      </td>
                      <td className="p-2.5 text-center font-mono font-black text-slate-900 bg-slate-100">
                        <span className={`px-2 py-0.5 rounded-md ${
                          item.summary.attendancePercentage >= 90
                            ? 'text-emerald-700 bg-emerald-100'
                            : item.summary.attendancePercentage >= 75
                            ? 'text-blue-700 bg-blue-100'
                            : 'text-amber-700 bg-amber-100'
                        }`}>
                          {item.summary.attendancePercentage}%
                        </span>
                      </td>
                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => {
                            setSelectedEmployeeId(item.employeeId);
                            setActiveTab('individual-form');
                          }}
                          className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[11px] font-bold border border-emerald-200 transition-colors cursor-pointer"
                        >
                          Buka Form
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. TAB CONTENT 3: Input Presensi Harian Cepat */}
      {activeTab === 'daily-quick' && (
        <div className="bg-white rounded-3xl p-6 shadow-xs border border-slate-200 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                <span>Check-in Cepat Harian: Tanggal {selectedDailyDay} {MONTH_NAMES_INDONESIAN[selectedMonth - 1]} {selectedYear}</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Pilih tanggal di bawah untuk mencentang kehadiran seluruh pegawai pada hari kerja tertentu sekaligus.
              </p>
            </div>

            {/* Day Selector Buttons */}
            <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-2 rounded-2xl max-w-full overflow-x-auto">
              {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => i + 1).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDailyDay(d)}
                  className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedDailyDay === d
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Check-in Table for All Employees on selectedDailyDay */}
          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 text-slate-900 font-bold text-center border-b border-slate-300">
                  <th className="p-2.5 w-10">No</th>
                  <th className="p-2.5 text-left">Nama Pegawai & Jabatan</th>
                  <th className="p-2.5 w-16">Status</th>
                  <th className="p-2.5 w-16 bg-emerald-50 text-emerald-800">H (Hadir)</th>
                  <th className="p-2.5 w-20 bg-cyan-50 text-cyan-800">TK BOK</th>
                  <th className="p-2.5 w-22 bg-blue-50 text-blue-800">TK DINKES</th>
                  <th className="p-2.5 w-16 bg-amber-50 text-amber-800">S (Sakit)</th>
                  <th className="p-2.5 w-16 bg-purple-50 text-purple-800">I (Izin)</th>
                  <th className="p-2.5 w-16 bg-indigo-50 text-indigo-800">C (Cuti)</th>
                  <th className="p-2.5 w-16 bg-rose-50 text-rose-800">TK (Alpa)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {employees.map((emp, idx) => {
                  const empKey = `att_${emp.id}_${selectedYear}_${selectedMonth.toString().padStart(2, '0')}`;
                  const record = attendanceMap[empKey] || createDefaultMonthlyAttendance(emp, selectedMonth, selectedYear, true);
                  const dayRecord = record.dailyRecords[selectedDailyDay - 1] || record.dailyRecords[0];
                  const currentStatus = dayRecord ? dayRecord.status : '';

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-2.5 text-center font-medium text-slate-500">{idx + 1}</td>
                      <td className="p-2.5">
                        <div className="font-bold text-slate-900">{emp.fullName}</div>
                        <div className="text-[10px] text-slate-500">{emp.jobTitle}</div>
                      </td>
                      <td className="p-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          currentStatus === 'H' ? 'bg-emerald-100 text-emerald-800' :
                          currentStatus.startsWith('TK') ? 'bg-blue-100 text-blue-800' :
                          currentStatus ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {currentStatus || '-'}
                        </span>
                      </td>

                      {/* Interactive Buttons for daily status */}
                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleQuickDailyToggle(emp.id, 'H')}
                          className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                            currentStatus === 'H'
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-emerald-100 text-slate-600'
                          }`}
                        >
                          {currentStatus === 'H' ? '✓' : 'H'}
                        </button>
                      </td>

                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleQuickDailyToggle(emp.id, 'TK_BOK')}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            currentStatus === 'TK_BOK'
                              ? 'bg-cyan-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-cyan-100 text-slate-600'
                          }`}
                        >
                          {currentStatus === 'TK_BOK' ? '✓' : 'BOK'}
                        </button>
                      </td>

                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleQuickDailyToggle(emp.id, 'TK_DINKES')}
                          className={`px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                            currentStatus === 'TK_DINKES'
                              ? 'bg-blue-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-blue-100 text-slate-600'
                          }`}
                        >
                          {currentStatus === 'TK_DINKES' ? '✓' : 'Dinkes'}
                        </button>
                      </td>

                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleQuickDailyToggle(emp.id, 'S')}
                          className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                            currentStatus === 'S'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-amber-100 text-slate-600'
                          }`}
                        >
                          {currentStatus === 'S' ? '✓' : 'S'}
                        </button>
                      </td>

                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleQuickDailyToggle(emp.id, 'I')}
                          className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                            currentStatus === 'I'
                              ? 'bg-purple-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-purple-100 text-slate-600'
                          }`}
                        >
                          {currentStatus === 'I' ? '✓' : 'I'}
                        </button>
                      </td>

                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleQuickDailyToggle(emp.id, 'C')}
                          className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                            currentStatus === 'C'
                              ? 'bg-indigo-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-indigo-100 text-slate-600'
                          }`}
                        >
                          {currentStatus === 'C' ? '✓' : 'C'}
                        </button>
                      </td>

                      <td className="p-2 text-center">
                        <button
                          onClick={() => handleQuickDailyToggle(emp.id, 'TK')}
                          className={`w-8 h-8 rounded-lg font-bold transition-all cursor-pointer ${
                            currentStatus === 'TK'
                              ? 'bg-rose-600 text-white shadow-xs'
                              : 'bg-slate-100 hover:bg-rose-100 text-slate-600'
                          }`}
                        >
                          {currentStatus === 'TK' ? '✓' : 'TK'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Modals for Printing */}
      <PrintAttendanceModal
        isOpen={isPrintIndividualOpen}
        onClose={() => setIsPrintIndividualOpen(false)}
        attendanceData={currentEmployeeAttendance}
      />

      <PrintAttendanceRekapModal
        isOpen={isPrintRekapOpen}
        onClose={() => setIsPrintRekapOpen(false)}
        attendanceList={currentMonthAttendanceList}
        monthName={MONTH_NAMES_INDONESIAN[selectedMonth - 1]}
        year={selectedYear}
        puskesmasInfo={puskesmasInfo}
      />
    </div>
  );
};
