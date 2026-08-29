export type NipType = 'NIP' | 'NIP PPPK' | 'NIP PPPK PW' | 'NIK' | 'THL' | 'Honorer Daerah';
export type Gender = 'L' | 'P';
export type Religion = 'Katolik' | 'Kristen Protestan' | 'Islam' | 'Hindu' | 'Buddha' | 'Konghucu';
export type MaritalStatus = 'Belum Menikah' | 'Menikah' | 'Cerai Hidup' | 'Cerai Mati';

export type EmploymentStatus = 
  | 'PNS' 
  | 'PPPK' 
  | 'PPPK Paruh Waktu'
  | 'Honorer Daerah' 
  | 'THL' 
  | 'Magang / Sukarela';

export type StaffCategory = 'Nakes' | 'Non-Nakes';

export type PositionType = 
  | 'Fungsional Tertentu' 
  | 'Fungsional Umum' 
  | 'Struktural / Manajemen';

export type EducationLevel = 
  | 'SMA / SMK' 
  | 'D-III' 
  | 'D-IV' 
  | 'S-1' 
  | 'S-1 + Profesi' 
  | 'S-2';

export interface DigitalDocument {
  id: string;
  type: 'SK' | 'STR' | 'SIP' | 'Ijazah' | 'KTP' | 'Lainnya';
  title: string;
  fileName: string;
  fileSize: string;
  uploadDate: string;
  fileData?: string; // base64 / blob URL
}

export interface Employee {
  id: string;
  // 1. Identitas Pribadi
  nip: string;
  nipType: NipType;
  nik: string;
  fullName: string; // Termasuk gelar, misal: dr. Maria Goreti, M.Kes / Ns. Yohanes, S.Kep
  birthPlace: string;
  birthDate: string; // YYYY-MM-DD
  gender: Gender;
  religion: Religion;
  maritalStatus: MaritalStatus;
  address: string;
  village: string; // Desa/Kecamatan
  phone: string; // No WA/Telp
  email: string;
  photoUrl: string; // Base64 or standard asset

  // 2. Status Kepegawaian & Jabatan
  employmentStatus: EmploymentStatus;
  rankGrade: string; // Contoh: Penata Muda (III/a), Penata (III/c), Ahli Pertama (IX), dsb.
  appointmentTMT: string; // TMT SK Terakhir (YYYY-MM-DD)
  firstAppointmentTMT: string; // TMT CPNS / Pengangkatan Pertama
  jobTitle: string; // Jabatan: Dokter Umum, Bidan, Perawat UGD, Sanitarian, dsb.
  staffCategory: StaffCategory;
  department: string; // Unit Kerja: Poli Umum, UGD, Rawat Inap, VK, TU, dsb.
  positionType: PositionType;

  // 3. Pendidikan & STR / SIP
  educationLevel: EducationLevel;
  major: string; // Jurusan: Ilmu Keperawatan, Kebidanan, Kedokteran Umum, dsb.
  institution: string; // Nama Kampus / Universitas
  graduationYear: number;
  ijazahNumber?: string; // Nomor Ijazah / Surat Tanda Tamat Belajar
  
  // Nakes credentials
  strNumber: string; // No. STR
  strExpiryDate: string; // YYYY-MM-DD (atau 'Seumur Hidup' jika berlaku UU baru, tapi bisa tanggal)
  strIsLifetime: boolean;
  sipNumber: string; // No. SIP (Surat Izin Praktik dari DPMPTSP / Dinkes Sikka)
  sipExpiryDate: string; // YYYY-MM-DD

  // 4. Berkas Digital
  documents: DigitalDocument[];
  notes?: string;
  
  createdAt: string;
  updatedAt: string;
}

export interface PuskesmasInfo {
  name: string;
  fullName: string;
  subdistrict: string;
  regency: string;
  province: string;
  address: string;
  postalCode: string;
  phone: string;
  email: string;
  codePuskesmas: string;
  headOfPuskesmas: {
    name: string;
    nip: string;
    rankGrade: string;
    position: string;
  };
}
