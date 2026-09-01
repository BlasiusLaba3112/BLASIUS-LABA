/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AttendanceStatusType = 'H' | 'TK_BOK' | 'TK_DINKES' | 'S' | 'I' | 'C' | 'TK' | '';

export interface DailyAttendanceRecord {
  day: number; // 1 - 31
  date: string; // YYYY-MM-DD
  dayName: string; // 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'
  isSunday: boolean;
  isHoliday?: boolean;
  holidayName?: string;
  checkInTime: string; // default "08.00"
  checkOutTime: string; // default "14.00"
  status: AttendanceStatusType; // 'H' | 'TK_BOK' | 'TK_DINKES' | 'S' | 'I' | 'C' | 'TK' | ''
  signatureParaf: string; // e.g. "paraf" or signed
  note?: string;
}

export interface MonthlyAttendanceSummary {
  hCount: number; // Total Hadir (H)
  tkBokCount: number; // Total Tugas Keluar BOK (TK BOK)
  tkDinkesCount: number; // Total Tugas Keluar Dinkes (TK DINKES)
  tlCount: number; // Total Tugas Luar (TK BOK + TK DINKES)
  sCount: number; // Total Sakit (S)
  iCount: number; // Total Izin (I)
  cCount: number; // Total Cuti (C)
  tkCount: number; // Total Tanpa Keterangan / Alpa (TK)
  totalWorkDays: number; // Total hari kerja efektif dalam bulan
  attendancePercentage: number; // ((H + TL) / totalWorkDays) * 100%
}

export interface EmployeeMonthlyAttendance {
  id: string; // e.g. "att_peg-001_2026_09"
  employeeId: string;
  employeeName: string;
  nip: string;
  employmentStatus: string;
  rankGrade: string;
  jobTitle: string;
  month: number; // 1 - 12 (default 9 = September)
  year: number; // default 2026
  monthName: string; // "September"
  dailyRecords: DailyAttendanceRecord[]; // 1 - 31 days
  summary: MonthlyAttendanceSummary;
  signedLocation: string; // "Kringa"
  signedDate: string; // "01 September 2026"
  headName: string; // "Christiana Lensi,S.KM"
  headRank: string; // "Penata TK 1, III/d"
  headNip: string; // "NIP.19750403 200112 2 003"
  updatedAt?: string;
}

export const MONTH_NAMES_INDONESIAN = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember'
];
