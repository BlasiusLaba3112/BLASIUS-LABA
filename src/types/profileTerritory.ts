export interface PosyanduInfo {
  id: string;
  name: string;
  category: 'Posyandu Balita' | 'Posyandu Lansia' | 'Posyandu Remaja' | 'Posyandu Integrasi ILP' | 'Posbindu PTM';
  dusun: string;
  address: string;
  cadreCount: number; // Jumlah Kader
  headOfPosyandu: string; // Nama Ketua Kader Posyandu
  phone: string;
  schedule: string; // contoh: 'Setiap tanggal 10' / 'Kamis Minggu ke-2'
  notes?: string;
}

export interface VillagePopulation {
  familyCount: number; // Jumlah KK
  maleCount: number; // Laki-laki
  femaleCount: number; // Perempuan
  totalPopulation: number; // Total Jiwa (bisa auto-calc male + female)
  infantCount: number; // Bayi 0-11 bulan (< 1 tahun)
  toddlerCount: number; // Balita 12-60 bulan (1 - 5 tahun)
  pregnantMotherCount: number; // Ibu Hamil (Bumil)
  nursingMotherCount: number; // Ibu Menyusui (Bufas)
  elderlyCount: number; // Lansia (≥ 60 tahun)
  productiveAgeCount?: number; // Usia Produktif (15 - 59 tahun)
  youthCount?: number; // Remaja (10 - 18/19 tahun)
  pusCount?: number; // Pasangan Usia Subur (PUS)
  wusCount?: number; // Wanita Usia Subur (WUS 15 - 49 tahun)
  bpjsCoveredCount: number; // Jumlah Peserta BPJS/KIS
}

export interface VillageTerritory {
  id: string;
  name: string;
  headOfVillage: string; // Kepala Desa
  phoneHeadOfVillage?: string;
  areaKm2: number; // Luas Wilayah (km²)
  distanceToPuskesmasKm: number; // Jarak ke Puskesmas (km)
  travelTimeMinutes: number; // Waktu tempuh (menit)
  geographicType: 'Pesisir / Pantai' | 'Perbukitan / Pegunungan' | 'Dataran Rendah';
  pustuPoskesdes: string; // Nama Pustu / Poskesdes di desa tsb
  pustuStaff: string; // Nama Bidan/Perawat Penanggung Jawab Pustu/Poskesdes
  population: VillagePopulation;
  posyanduList: PosyanduInfo[];
  notes?: string;
}

export interface FacilityUnit {
  id: string;
  name: string;
  category: string; // contoh: 'Kegawatdaruratan' | 'Rawat Inap' | 'Rawat Jalan' | 'Penunjang Medis' | 'Kesehatan Ibu & Anak' | 'Konseling & Promkes' | 'Tata Usaha / Umum'
  operationalHours?: string; // contoh: '24 Jam Non-Stop' | 'Senin - Sabtu (08.00 - 14.00 WITA)'
  description?: string; // Penjelasan singkat cakupan pelayanan
  status?: 'Aktif' | 'Siaga' | 'Tersedia' | 'Pemeliharaan';
}

export interface OrganizationUnit {
  id: string;
  name: string;
  personInCharge: string;
  nip?: string;
  roleTitle?: string;
  notes?: string;
}

export interface OrganizationCluster {
  id: string;
  code: 'KLASTER_1' | 'KLASTER_2' | 'KLASTER_3' | 'KLASTER_4' | 'LINTAS_KLASTER';
  title: string;
  shortTitle: string;
  colorTheme: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'purple' | 'cyan';
  coordinator: {
    name: string;
    title?: string;
    nip?: string;
  };
  units: OrganizationUnit[];
}

export interface OrganizationStructureData {
  title: string;
  subtitle?: string;
  year: string;
  headOfPuskesmas: {
    title: string;
    name: string;
    nip: string;
  };
  originalImageUrl?: string;
  clusters: OrganizationCluster[];
  updatedAt?: string;
}

export interface PuskesmasProfileData {
  vision: string;
  mission: string[];
  motto: string;
  coreValues: {
    acronym: string;
    description: string;
    points: { letter: string; word: string; meaning: string }[];
  };
  overview: string;
  workingAreaDescription: string;
  serviceHours: string;
  facilities?: FacilityUnit[];
  organizationStructure?: OrganizationStructureData;
  villages: VillageTerritory[];
  updatedAt: string;
}
