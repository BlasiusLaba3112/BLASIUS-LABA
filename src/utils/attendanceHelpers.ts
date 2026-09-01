/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Employee } from '../types/employee';
import { 
  EmployeeMonthlyAttendance, 
  DailyAttendanceRecord, 
  MonthlyAttendanceSummary, 
  MONTH_NAMES_INDONESIAN,
  AttendanceStatusType
} from '../types/attendance';

const DAY_NAMES = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];

/**
 * Get number of days in a specific month and year
 */
export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

/**
 * Calculate summary of attendance (H, TK BOK, TK DINKES, TL, S, I, C, TK, Percentage)
 */
export function calculateAttendanceSummary(
  dailyRecords: DailyAttendanceRecord[],
  totalDaysInMonth: number
): MonthlyAttendanceSummary {
  let hCount = 0;
  let tkBokCount = 0;
  let tkDinkesCount = 0;
  let sCount = 0;
  let iCount = 0;
  let cCount = 0;
  let tkCount = 0;
  let totalWorkDays = 0;

  for (let i = 0; i < 31; i++) {
    const record = dailyRecords[i];
    if (!record || record.day > totalDaysInMonth) continue;

    // Sundays are rest days unless specified
    if (!record.isSunday) {
      totalWorkDays++;
    }

    switch (record.status) {
      case 'H':
        hCount++;
        break;
      case 'TK_BOK':
        tkBokCount++;
        break;
      case 'TK_DINKES':
        tkDinkesCount++;
        break;
      case 'S':
        sCount++;
        break;
      case 'I':
        iCount++;
        break;
      case 'C':
        cCount++;
        break;
      case 'TK':
        tkCount++;
        break;
      default:
        break;
    }
  }

  const tlCount = tkBokCount + tkDinkesCount;
  const effectiveAttended = hCount + tlCount;
  
  // Calculate percentage
  const effectiveTotal = totalWorkDays > 0 ? totalWorkDays : 26;
  const percentage = Math.min(100, Math.round((effectiveAttended / effectiveTotal) * 100));

  return {
    hCount,
    tkBokCount,
    tkDinkesCount,
    tlCount,
    sCount,
    iCount,
    cCount,
    tkCount,
    totalWorkDays: effectiveTotal,
    attendancePercentage: isNaN(percentage) ? 0 : percentage
  };
}

/**
 * Generate a blank or pre-filled monthly attendance record for an employee
 */
export function createDefaultMonthlyAttendance(
  employee: Employee,
  month: number = 9, // September default
  year: number = 2026,
  autoFillWorkdays: boolean = true
): EmployeeMonthlyAttendance {
  const daysCount = getDaysInMonth(month, year);
  const monthName = MONTH_NAMES_INDONESIAN[month - 1] || 'September';
  const dailyRecords: DailyAttendanceRecord[] = [];

  for (let day = 1; day <= 31; day++) {
    const isOutOfMonth = day > daysCount;
    let dayName = '';
    let isSunday = false;

    if (!isOutOfMonth) {
      const dateObj = new Date(year, month - 1, day);
      const dayOfWeek = dateObj.getDay();
      dayName = DAY_NAMES[dayOfWeek];
      isSunday = dayOfWeek === 0; // 0 = Sunday
    }

    const padDay = day.toString().padStart(2, '0');
    const padMonth = month.toString().padStart(2, '0');
    const dateStr = `${year}-${padMonth}-${padDay}`;

    // Default status: If autoFillWorkdays is true and it's a weekday, set 'H' (Hadir), else ''
    let defaultStatus: AttendanceStatusType = '';
    let checkIn = '';
    let checkOut = '';

    if (!isOutOfMonth) {
      if (isSunday) {
        defaultStatus = '';
        checkIn = '';
        checkOut = '';
      } else if (autoFillWorkdays) {
        defaultStatus = 'H';
        checkIn = '';
        checkOut = '';
      }
    } else {
      checkIn = '';
      checkOut = '';
    }

    dailyRecords.push({
      day,
      date: dateStr,
      dayName,
      isSunday,
      checkInTime: checkIn,
      checkOutTime: checkOut,
      status: defaultStatus,
      signatureParaf: defaultStatus === 'H' ? '✓' : defaultStatus ? defaultStatus : '',
      note: ''
    });
  }

  const summary = calculateAttendanceSummary(dailyRecords, daysCount);

  return {
    id: `att_${employee.id}_${year}_${month.toString().padStart(2, '0')}`,
    employeeId: employee.id,
    employeeName: employee.fullName,
    nip: employee.nip,
    employmentStatus: employee.employmentStatus,
    rankGrade: employee.rankGrade || 'Penata TK 1, III/d',
    jobTitle: employee.jobTitle,
    month,
    year,
    monthName,
    dailyRecords,
    summary,
    signedLocation: 'Kringa',
    signedDate: `01 ${monthName} ${year}`,
    headName: 'Christiana Lensi,S.KM',
    headRank: 'Penata TK 1, III/d',
    headNip: 'NIP.19750403 200112 2 003',
    updatedAt: new Date().toISOString()
  };
}

/**
 * Generate initial records for all employees
 */
export function generateInitialAttendanceList(
  employees: Employee[],
  month: number = 9,
  year: number = 2026
): EmployeeMonthlyAttendance[] {
  return employees.map((emp) => createDefaultMonthlyAttendance(emp, month, year, true));
}
