import { Employee } from '../types/employee';

export function formatDateIndonesian(dateStr: string | undefined): string {
  if (!dateStr) return '-';
  try {
    const [year, month, day] = dateStr.split('-');
    if (!year || !month || !day) return dateStr;
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return `${parseInt(day, 10)} ${months[monthIndex]} ${year}`;
  } catch {
    return dateStr;
  }
}

export function calculateAge(birthDateStr: string): number {
  if (!birthDateStr) return 0;
  const birthDate = new Date(birthDateStr);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export function calculateTenure(startDateStr: string): string {
  if (!startDateStr) return '-';
  const start = new Date(startDateStr);
  const now = new Date();
  
  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();
  
  if (months < 0) {
    years--;
    months += 12;
  }
  
  if (years <= 0 && months <= 0) return 'Baru bergabung';
  if (years <= 0) return `${months} Bulan`;
  if (months === 0) return `${years} Tahun`;
  return `${years} Thn ${months} Bln`;
}

export interface CredentialStatus {
  status: 'active' | 'warning' | 'expired' | 'lifetime' | 'none';
  label: string;
  badgeClass: string;
  daysRemaining?: number;
}

export function getCredentialStatus(
  expiryDateStr: string | undefined, 
  isLifetime: boolean = false, 
  isNakes: boolean = true
): CredentialStatus {
  if (!isNakes || !expiryDateStr || expiryDateStr === '-' || expiryDateStr.trim() === '') {
    return {
      status: 'none',
      label: isNakes ? 'Belum Diisi' : 'Tidak Wajib (Non-Nakes)',
      badgeClass: 'bg-slate-100 text-slate-600 border-slate-200'
    };
  }

  if (isLifetime) {
    return {
      status: 'lifetime',
      label: 'Seumur Hidup',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDateStr);
  expiry.setHours(0, 0, 0, 0);

  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return {
      status: 'expired',
      label: `Kadaluarsa (${Math.abs(diffDays)} hari lalu)`,
      badgeClass: 'bg-red-50 text-red-700 border-red-200',
      daysRemaining: diffDays
    };
  } else if (diffDays <= 90) {
    return {
      status: 'warning',
      label: `Segera Berakhir (${diffDays} hari)`,
      badgeClass: 'bg-amber-50 text-amber-800 border-amber-300',
      daysRemaining: diffDays
    };
  } else {
    return {
      status: 'active',
      label: `Aktif (${diffDays} hari lagi)`,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      daysRemaining: diffDays
    };
  }
}

export function exportEmployeesToCSV(employees: Employee[]): void {
  const headers = [
    'No',
    'NIP / Identitas',
    'NIK',
    'Nama Lengkap',
    'Jenis Kelamin',
    'Tempat Lahir',
    'Tanggal Lahir',
    'Agama',
    'Status Nikah',
    'No HP / WA',
    'Email',
    'Status Kepegawaian',
    'Pangkat / Golongan',
    'Jabatan',
    'Unit Kerja',
    'Kategori Pegawai',
    'Jenjang Pendidikan',
    'Jurusan',
    'Asal Kampus',
    'Tahun Lulus',
    'Nomor STR',
    'Masa Berlaku STR',
    'Nomor SIP',
    'Masa Berlaku SIP',
    'TMT Pengangkatan'
  ];

  const rows = employees.map((emp, index) => [
    index + 1,
    `"${emp.nip}"`,
    `"${emp.nik}"`,
    `"${emp.fullName}"`,
    emp.gender === 'L' ? 'Laki-laki' : 'Perempuan',
    `"${emp.birthPlace}"`,
    emp.birthDate,
    emp.religion,
    emp.maritalStatus,
    `"${emp.phone}"`,
    emp.email,
    emp.employmentStatus,
    `"${emp.rankGrade}"`,
    `"${emp.jobTitle}"`,
    `"${emp.department}"`,
    emp.staffCategory,
    emp.educationLevel,
    `"${emp.major}"`,
    `"${emp.institution}"`,
    emp.graduationYear,
    `"${emp.strNumber}"`,
    emp.strIsLifetime ? 'Seumur Hidup' : (emp.strExpiryDate || '-'),
    `"${emp.sipNumber}"`,
    emp.sipExpiryDate || '-',
    emp.appointmentTMT || '-'
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(r => r.join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Daftar_Pegawai_UPT_Puskesmas_Boganatar_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportBackupJSON(employees: Employee[]): void {
  const data = {
    puskesmas: 'UPT Puskesmas Boganatar',
    exportedAt: new Date().toISOString(),
    totalEmployees: employees.length,
    data: employees
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Backup_SIMPEG_Boganatar_${new Date().toISOString().split('T')[0]}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
