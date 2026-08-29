export interface VillageSPMBreakdown {
  villageId: string;
  villageName: string;
  targetCount: number; // Target Sasaran Riil di desa tsb
  achievedCount: number; // Jumlah yang telah terlayani sesuai standar
  percentage: number; // % Capaian (auto: (achieved / target) * 100)
}

export type SPMCategory = 
  | 'Kesehatan Ibu & Anak (KIA)'
  | 'Anak Usia Pendidikan & Remaja'
  | 'Usia Produktif & Lansia'
  | 'Penyakit Tidak Menular (PTM)'
  | 'Kesehatan Jiwa'
  | 'Penyakit Menular (TB & HIV)';

export type SPMStatus = 'Tercapai' | 'On Track' | 'Perhatian' | 'Kritis';

export interface SPMIndicator {
  id: string;
  number: number; // 1 s/d 12
  name: string; // Nama Resmi Indikator SPM (Permenkes 4/2019)
  shortTitle: string; // Judul Ringkas
  category: SPMCategory;
  standardDescription: string; // Definisi Operasional & Standar Pelayanan
  targetPopulation: number; // Total Sasaran Riil Puskesmas (Setahun/Berjalan)
  achievedCount: number; // Realisasi Terlayani Sesuai Standar
  targetPercentage: number; // Standar Nasional selalu 100%
  percentage: number; // Realisasi %
  unitMeasure: string; // e.g., 'Orang / Ibu Hamil', 'Bayi', 'Balita', 'Peserta Didik', 'Lansia', 'Penderita'
  picEmployeeName: string; // Penanggung Jawab Program (PJ)
  picEmployeeNip?: string; // NIP/NRPTT Penanggung Jawab
  picPosition: string; // Jabatan Pengelola Program
  period: string; // Periode Evaluasi (e.g. 'Tahun 2026')
  quarterProgress: {
    q1: number; // Realisasi Triwulan I
    q2: number; // Realisasi Triwulan II
    q3: number; // Realisasi Triwulan III
    q4: number; // Realisasi Triwulan IV
  };
  villageBreakdown: VillageSPMBreakdown[]; // Rincian per 5 Desa
  keyActivities: string[]; // Rencana Kegiatan / Inovasi Layanan
  problemAnalysis?: string; // Analisis Kendala & Hambatan Lapangan
  followUpPlan?: string; // Rencana Tindak Lanjut (RTL)
  status: SPMStatus;
  updatedAt: string;
}

export interface SPMOverallSummary {
  totalIndicators: number;
  averagePercentage: number;
  achievedCount: number; // Status Tercapai (≥100%)
  onTrackCount: number; // Status On Track (80-99%)
  attentionCount: number; // Status Perhatian (50-79%)
  criticalCount: number; // Status Kritis (<50%)
  totalTargetAll: number;
  totalAchievedAll: number;
}
