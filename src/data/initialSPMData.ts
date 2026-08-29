import { SPMIndicator } from '../types/spm';

export const INITIAL_SPM_INDICATORS: SPMIndicator[] = [
  // 1. Pelayanan Kesehatan Ibu Hamil (K4 / K6)
  {
    id: 'spm-01',
    number: 1,
    name: 'Pelayanan Kesehatan Ibu Hamil (Antenatal Care Sesuai Standar K6)',
    shortTitle: 'Pelayanan Ibu Hamil (K6)',
    category: 'Kesehatan Ibu & Anak (KIA)',
    standardDescription: 'Pelayanan antenatal terpadu minimal 6 kali selama masa kehamilan (2x Trimester 1 dengan USG dokter, 1x Trimester 2, dan 3x Trimester 3) dengan standar 10T termasuk pemberian tablet tambah darah (TTD) dan skrining lab.',
    targetPopulation: 142,
    achievedCount: 135,
    targetPercentage: 100,
    percentage: 95.1,
    unitMeasure: 'Ibu Hamil (Bumil)',
    picEmployeeName: 'Maria Fransiska, A.Md.Keb',
    picEmployeeNip: '19880812 201101 2 005',
    picPosition: 'Bidan Koordinator / Pengelola Program KIA-KB',
    period: 'Tahun 2026',
    quarterProgress: { q1: 36, q2: 35, q3: 34, q4: 30 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 28, achievedCount: 27, percentage: 96.4 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 32, achievedCount: 31, percentage: 96.9 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 24, achievedCount: 22, percentage: 91.7 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 26, achievedCount: 25, percentage: 96.2 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 32, achievedCount: 30, percentage: 93.8 },
    ],
    keyActivities: [
      'Pemeriksaan ANC Terpadu & USG Obstetri oleh Dokter Puskesmas di Pustu/Posyandu',
      'Kelas Ibu Hamil di 15 Posyandu terintegrasi edukasi gizi cegah stunting',
      'Kunjungan Rumah (PIS-PK / Perkesmas) Bumil KEK dan Bumil Risiko Tinggi (Resti)',
      'Distribusi 90 Tablet Tambah Darah (TTD) & Pemantauan Kadar Hemoglobin'
    ],
    problemAnalysis: 'Sebagian kecil ibu hamil di wilayah perbukitan Hikong dan Ojang terlambat memeriksakan kehamilan pada trimester pertama karena akses transportasi.',
    followUpPlan: 'Penguatan sweeping bumil trimester 1 oleh kader Posyandu dan optimalisasi jadwal USG keliling tim dokter di Pustu/Poskesdes.',
    status: 'On Track',
    updatedAt: new Date().toISOString(),
  },

  // 2. Pelayanan Kesehatan Ibu Bersalin
  {
    id: 'spm-02',
    number: 2,
    name: 'Pelayanan Kesehatan Ibu Bersalin (Persalinan di Fasilitas Pelayanan Kesehatan)',
    shortTitle: 'Pelayanan Ibu Bersalin (Faskes)',
    category: 'Kesehatan Ibu & Anak (KIA)',
    standardDescription: 'Pelayanan persalinan oleh tim tenaga kesehatan kompeten (Bidan & Dokter) di Fasilitas Pelayanan Kesehatan (Puskesmas PONED / Rumah Sakit Rujukan) sesuai prosedur Asuhan Persalinan Normal (APN).',
    targetPopulation: 136,
    achievedCount: 132,
    targetPercentage: 100,
    percentage: 97.1,
    unitMeasure: 'Ibu Bersalin (Bulin)',
    picEmployeeName: 'Yuliana Nona, S.Tr.Keb',
    picEmployeeNip: '19920315 201503 2 002',
    picPosition: 'Penanggung Jawab Ruang Bersalin / PONED',
    period: 'Tahun 2026',
    quarterProgress: { q1: 35, q2: 34, q3: 32, q4: 31 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 27, achievedCount: 27, percentage: 100 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 30, achievedCount: 30, percentage: 100 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 23, achievedCount: 21, percentage: 91.3 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 25, achievedCount: 24, percentage: 96.0 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 31, achievedCount: 30, percentage: 96.8 },
    ],
    keyActivities: [
      'Pelayanan PONED 24 Jam Siaga di UPT Puskesmas Boganatar',
      'Pemanfaatan Rumah Tunggu Kelahiran (RTK) bagi bumil dari daerah terpencil',
      'Pemasangan Stiker P4K (Perencanaan Persalinan dan Pencegahan Komplikasi)',
      'Kemitraan Bidan dengan Tokoh Adat dan Dukun Bayi (Kemitraan Bidan-Dukun)'
    ],
    problemAnalysis: 'Ketiadaan kendaraan pribadi di malam hari bagi warga dusun pedalaman saat tanda persalinan muncul mendadak.',
    followUpPlan: 'Siaga Ambulans Desa / Pusling 24 jam dan koordinasi call center darurat UGD Puskesmas Boganatar.',
    status: 'On Track',
    updatedAt: new Date().toISOString(),
  },

  // 3. Pelayanan Kesehatan Bayi Baru Lahir (Neonatus)
  {
    id: 'spm-03',
    number: 3,
    name: 'Pelayanan Kesehatan Bayi Baru Lahir (Kunjungan Neonatal Lengkap KN1-KN3)',
    shortTitle: 'Pelayanan Bayi Baru Lahir (Neonatus)',
    category: 'Kesehatan Ibu & Anak (KIA)',
    standardDescription: 'Pelayanan kesehatan neonatal esensial minimal 3 kali (KN1 6-48 jam, KN2 3-7 hari, KN3 8-28 hari) mencakup pemeriksaan fisik, perawatan tali pusat, skrining hipotiroid kongenital (SHK), Vitamin K1, dan imunisasi Hepatitis B0.',
    targetPopulation: 136,
    achievedCount: 131,
    targetPercentage: 100,
    percentage: 96.3,
    unitMeasure: 'Bayi Baru Lahir (Neonatus)',
    picEmployeeName: 'Agustina Da Silva, A.Md.Keb',
    picEmployeeNip: '19901124 201402 2 003',
    picPosition: 'Pengelola Program Kesehatan Bayi & Imunisasi Dasar',
    period: 'Tahun 2026',
    quarterProgress: { q1: 34, q2: 33, q3: 33, q4: 31 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 27, achievedCount: 27, percentage: 100 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 30, achievedCount: 29, percentage: 96.7 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 23, achievedCount: 22, percentage: 95.7 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 25, achievedCount: 24, percentage: 96.0 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 31, achievedCount: 29, percentage: 93.5 },
    ],
    keyActivities: [
      'Inisiasi Menyusu Dini (IMD) dan Injeksi Vitamin K1 + Salep Mata Profilaksis',
      'Pemberian Imunisasi Hepatitis B (HB0) < 24 jam',
      'Skrining Hipotiroid Kongenital (SHK) bagi seluruh bayi baru lahir',
      'Kunjungan Rumah KN2 & KN3 oleh Bidan Desa'
    ],
    problemAnalysis: 'Beberapa keluarga membawa bayi keluar daerah (berkunjung ke keluarga di Larantuka/Maumere) sebelum KN3 selesai.',
    followUpPlan: 'Notifikasi lintas faskes melalui buku KIA elektronik dan pemantauan grup WhatsApp Bidan Desa.',
    status: 'On Track',
    updatedAt: new Date().toISOString(),
  },

  // 4. Pelayanan Kesehatan Balita
  {
    id: 'spm-04',
    number: 4,
    name: 'Pelayanan Kesehatan Balita Sesuai Standar (Pemantauan Tumbuh Kembang, Imunisasi, & Vit A)',
    shortTitle: 'Pelayanan Kesehatan Balita',
    category: 'Kesehatan Ibu & Anak (KIA)',
    standardDescription: 'Pelayanan kesehatan balita 0-59 bulan meliputi penimbangan bulanan (D/S), pengukuran panjang/tinggi badan, stimulasi deteksi intervensi dini tumbuh kembang (SDIDTK), imunisasi dasar dan lanjutan lengkap, pemberian Kapsul Vitamin A (Februari & Agustus), dan obat cacing.',
    targetPopulation: 685,
    achievedCount: 652,
    targetPercentage: 100,
    percentage: 95.2,
    unitMeasure: 'Anak Balita (0-59 Bulan)',
    picEmployeeName: 'Katarina Eko, S.Gz',
    picEmployeeNip: '19930614 201704 2 001',
    picPosition: 'Nutrisionis / Koordinator Penurunan Stunting Puskesmas',
    period: 'Tahun 2026',
    quarterProgress: { q1: 165, q2: 164, q3: 162, q4: 161 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 165, achievedCount: 160, percentage: 97.0 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 154, achievedCount: 148, percentage: 96.1 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 110, achievedCount: 102, percentage: 92.7 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 118, achievedCount: 112, percentage: 94.9 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 138, achievedCount: 130, percentage: 94.2 },
    ],
    keyActivities: [
      'Operasi Timbang Serentak & Pengukuran Antropometri Terstandar di 15 Posyandu',
      'Pemberian Makanan Tambahan (PMT) Pemulihan Berbahan Pangan Lokal bagi Balita Gizi Kurang',
      'Edukasi MP-ASI Kaya Protein Hewani (Telur, Ikan Segar Laut Talibura)',
      'Sweeping Balita Drop Out Imunisasi & Distribusi Kapsul Vitamin A'
    ],
    problemAnalysis: 'Orang tua bekerja di kebun pada jam Posyandu sehingga balita tidak dibawa hadir ke pos penimbangan.',
    followUpPlan: 'Sweeping door-to-door oleh kader Posyandu didampingi tenaga gizi Puskesmas di hari berikutnya.',
    status: 'On Track',
    updatedAt: new Date().toISOString(),
  },

  // 5. Pelayanan Kesehatan Usia Pendidikan Dasar
  {
    id: 'spm-05',
    number: 5,
    name: 'Pelayanan Kesehatan pada Usia Pendidikan Dasar (Penjaringan / Skrining Kesehatan Sekolah)',
    shortTitle: 'Skrining Anak Sekolah (Pendidikan Dasar)',
    category: 'Anak Usia Pendidikan & Remaja',
    standardDescription: 'Penjaringan kesehatan (screening) minimal 1 kali dalam setahun bagi peserta didik kelas 1 SD/MI dan kelas 7 SMP/MTs mencakup status gizi (TB/BB), ketajaman penglihatan, pendengaran, kesehatan gigi mulut, kebersihan diri, dan kebugaran jasmani.',
    targetPopulation: 540,
    achievedCount: 528,
    targetPercentage: 100,
    percentage: 97.8,
    unitMeasure: 'Siswa / Peserta Didik',
    picEmployeeName: 'Ignasius Lego, S.Kep, Ns',
    picEmployeeNip: '19870510 201001 1 004',
    picPosition: 'Koordinator UKS / PKPR Puskesmas Boganatar',
    period: 'Tahun 2026',
    quarterProgress: { q1: 130, q2: 135, q3: 133, q4: 130 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 120, achievedCount: 118, percentage: 98.3 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 135, achievedCount: 132, percentage: 97.8 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 85, achievedCount: 82, percentage: 96.5 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 95, achievedCount: 93, percentage: 97.9 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 105, achievedCount: 103, percentage: 98.1 },
    ],
    keyActivities: [
      'Pemeriksaan Penjaringan Kesehatan Berkala di 9 SD,  2 SMP dan 1 SMA  Wilayah Boganatar',
      'Pemberian Tablet Tambah Darah (TTD) Rematri 1 tablet/minggu di SMP',
      'Edukasi Sikat Gigi Bersama dan Perilaku Hidup Bersih & Sehat (PHBS) Sekolah',
      'Bulan Imunisasi Anak Sekolah (BIAS) Campak-Rubella, DT, dan Td'
    ],
    problemAnalysis: 'Beberapa siswa tidak masuk sekolah karena sakit saat jadwal tim UKS berkunjung.',
    followUpPlan: 'Jadwal kunjungan susulan koordinasi dengan Guru UKS di masing-masing sekolah.',
    status: 'On Track',
    updatedAt: new Date().toISOString(),
  },

  // 6. Pelayanan Kesehatan Usia Produktif (Skrining PTM)
  {
    id: 'spm-06',
    number: 6,
    name: 'Pelayanan Kesehatan pada Usia Produktif (Skrining Faktor Risiko PTM 15-59 Tahun)',
    shortTitle: 'Skrining Usia Produktif (PTM)',
    category: 'Usia Produktif & Lansia',
    standardDescription: 'Skrining kesehatan faktor risiko penyakit tidak menular (PTM) minimal 1 kali dalam setahun bagi warga usia 15-59 tahun meliputi pengukuran tekanan darah, lingkar perut, IMT, kadar gula darah, riwayat merokok, dan konseling gaya hidup CERDIK.',
    targetPopulation: 4650,
    achievedCount: 3980,
    targetPercentage: 100,
    percentage: 85.6,
    unitMeasure: 'Orang (Warga 15-59 Thn)',
    picEmployeeName: 'Bernadus Boli, S.Kep, Ns',
    picEmployeeNip: '19840218 200904 1 003',
    picPosition: 'Koordinator Posbindu PTM & P2PTM',
    period: 'Tahun 2026',
    quarterProgress: { q1: 980, q2: 1020, q3: 1000, q4: 980 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 1050, achievedCount: 920, percentage: 87.6 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 1120, achievedCount: 975, percentage: 87.1 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 680, achievedCount: 560, percentage: 82.4 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 780, achievedCount: 655, percentage: 84.0 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 1020, achievedCount: 870, percentage: 85.3 },
    ],
    keyActivities: [
      'Layanan Posbindu PTM Mobile Terintegrasi di Kantor Desa, Kelompok Tani, dan Gereja',
      'Skrining Massal pada Acara Desa dan Peringatan Hari Kesehatan Nasional',
      'Pemberian Edukasi Gerakan Masyarakat Hidup Sehat (GERMAS) & Batasi Konsumsi Moke/Rokok',
      'Rujukan Terintegrasi ke Poli Umum bagi Peserta Terindikasi Hipertensi/DM'
    ],
    problemAnalysis: 'Sebagian besar pria usia produktif merantau ke luar daerah atau sibuk bertani/melaut pada hari kerja.',
    followUpPlan: 'Pelaksanaan Posbindu Malam Hari / Akhir Pekan (Hari Minggu setelah Ibadah) dan skrining di kelompok nelayan.',
    status: 'On Track',
    updatedAt: new Date().toISOString(),
  },

  // 7. Pelayanan Kesehatan Usia Lanjut (Lansia)
  {
    id: 'spm-07',
    number: 7,
    name: 'Pelayanan Kesehatan pada Usia Lanjut (Skrining Kesehatan Lansia ≥ 60 Tahun)',
    shortTitle: 'Pelayanan Kesehatan Lansia',
    category: 'Usia Produktif & Lansia',
    standardDescription: 'Skrining kesehatan lansia minimal 1 kali setahun menggunakan instrumen Pengkajian Paripurna Pasien Geriatri (P3G) / Instrumen ICOPE, mencakup skrining kognitif (demensia), depresi, kemandirian (ADL), malnutrisi, risiko jatuh, serta cek tensi, gula, dan kolesterol.',
    targetPopulation: 980,
    achievedCount: 912,
    targetPercentage: 100,
    percentage: 93.1,
    unitMeasure: 'Lansia (≥ 60 Tahun)',
    picEmployeeName: 'Theresia Imelda, A.Md.Kep',
    picEmployeeNip: '19890919 201201 2 004',
    picPosition: 'Koordinator Kesehatan Lansia & Pelayanan Geriatri',
    period: 'Tahun 2026',
    quarterProgress: { q1: 230, q2: 235, q3: 227, q4: 220 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 245, achievedCount: 235, percentage: 95.9 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 230, achievedCount: 218, percentage: 94.8 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 145, achievedCount: 130, percentage: 89.7 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 160, achievedCount: 148, percentage: 92.5 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 200, achievedCount: 181, percentage: 90.5 },
    ],
    keyActivities: [
      'Posyandu Lansia Aktif & Senam Kebugaran Lansia di 15 Pos Wilayah',
      'Home Care / Kunjungan Rumah Perkesmas bagi Lansia Resti (Bedridden / Risti)',
      'Pemeriksaan Lab Sederhana (Glukosa, Asam Urat, Kolesterol) Gratis',
      'Konseling Nutrisi Lansia & Pembagian Makanan Tambahan Lansia'
    ],
    problemAnalysis: 'Sebagian lansia di daerah terpencil perbukitan mengalami keterbatasan fisik untuk berjalan ke lokasi Posyandu.',
    followUpPlan: 'Home visit terpadu bulanan oleh Tim Perkesmas Bidan/Perawat Desa didampingi kader.',
    status: 'On Track',
    updatedAt: new Date().toISOString(),
  },

  // 8. Pelayanan Kesehatan Penderita Hipertensi
  {
    id: 'spm-08',
    number: 8,
    name: 'Pelayanan Kesehatan Penderita Hipertensi Sesuai Standar',
    shortTitle: 'Pelayanan Penderita Hipertensi',
    category: 'Penyakit Tidak Menular (PTM)',
    standardDescription: 'Pelayanan kesehatan bagi seluruh penderita hipertensi (tekanan darah sistolik ≥140 mmHg atau diastolik ≥90 mmHg) mencakup pengukuran tekanan darah rutin tiap bulan, edukasi perubahan gaya hidup PATUH, dan terapi farmakologis teratur dengan ketersediaan obat antihipertensi.',
    targetPopulation: 1240,
    achievedCount: 1085,
    targetPercentage: 100,
    percentage: 87.5,
    unitMeasure: 'Penderita Hipertensi',
    picEmployeeName: 'dr. Fransiskus Xaverius, Sp.KKLP (atau Dokter Fungsional)',
    picEmployeeNip: '19860105 201403 1 002',
    picPosition: 'Dokter Fungsional / Penanggung Jawab Poli PTM',
    period: 'Tahun 2026',
    quarterProgress: { q1: 275, q2: 280, q3: 265, q4: 265 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 290, achievedCount: 260, percentage: 89.7 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 310, achievedCount: 275, percentage: 88.7 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 180, achievedCount: 152, percentage: 84.4 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 200, achievedCount: 172, percentage: 86.0 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 260, achievedCount: 226, percentage: 86.9 },
    ],
    keyActivities: [
      'Klub Prolanis (Program Pengelolaan Penyakit Kronis) Hipertensi Boganatar Sehat',
      'Pemberian Obat Antihipertensi Rutin 30 Hari & Monitoring Kepatuhan Minum Obat',
      'Edukasi Diet Rendah Garam & Olahraga Teratur',
      'Pelacakan Pasien Drop Out Minum Obat oleh Kader Kesehatan'
    ],
    problemAnalysis: 'Tingkat kepatuhan minum obat harian menurun jika pasien merasa tidak ada gejala sakit kepala.',
    followUpPlan: 'Penguatan konseling bahaya komplikasi stroke/gagal ginjal dan kalender pengingat minum obat bagi pasien.',
    status: 'On Track',
    updatedAt: new Date().toISOString(),
  },

  // 9. Pelayanan Kesehatan Penderita Diabetes Melitus
  {
    id: 'spm-09',
    number: 9,
    name: 'Pelayanan Kesehatan Penderita Diabetes Melitus (DM) Sesuai Standar',
    shortTitle: 'Pelayanan Penderita Diabetes Melitus (DM)',
    category: 'Penyakit Tidak Menular (PTM)',
    standardDescription: 'Pelayanan kesehatan bagi seluruh penderita diabetes melitus mencakup pemantauan gula darah berkala (GDP/GD2PP/HbA1c), edukasi gizi dan aktivitas fisik, perawatan kaki diabetes, dan terapi obat hipoglikemik oral / insulin teratur.',
    targetPopulation: 320,
    achievedCount: 288,
    targetPercentage: 100,
    percentage: 90.0,
    unitMeasure: 'Penderita Diabetes Melitus (DM)',
    picEmployeeName: 'Petrus Kanisius, S.Kep, Ns',
    picEmployeeNip: '19850720 201101 1 007',
    picPosition: 'Koordinator Pelayanan Prolanis DM & Perawat Poli Penyakit Dalam',
    period: 'Tahun 2026',
    quarterProgress: { q1: 72, q2: 74, q3: 71, q4: 71 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 75, achievedCount: 69, percentage: 92.0 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 82, achievedCount: 75, percentage: 91.5 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 45, achievedCount: 39, percentage: 86.7 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 52, achievedCount: 46, percentage: 88.5 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 66, achievedCount: 59, percentage: 89.4 },
    ],
    keyActivities: [
      'Pemeriksaan Kadar Gula Darah Puasa & 2 Jam PP Bulanan di Puskesmas / Posbindu',
      'Pemeriksaan Sensitivitas Kaki Diabetik untuk Mencegah Luka Gangren',
      'Penyuluhan Manajemen Pola Makan Rendah Indeks Glikemik',
      'Distribusi Obat Antidiabetes Oral Sesuai Formularium Nasional'
    ],
    problemAnalysis: 'Tantangan pengaturan pola makan tinggi karbohidrat (nasi dan ubi) dalam pola konsumsi harian keluarga.',
    followUpPlan: 'Konsultasi gizi terpadu dengan keluarga pasien untuk menyusun menu makanan harian yang variatif dan terkontrol.',
    status: 'On Track',
    updatedAt: new Date().toISOString(),
  },

  // 10. Pelayanan Kesehatan ODGJ Berat
  {
    id: 'spm-10',
    number: 10,
    name: 'Pelayanan Kesehatan Orang dengan Gangguan Jiwa (ODGJ) Berat Sesuai Standar',
    shortTitle: 'Pelayanan Kesehatan Jiwa (ODGJ Berat)',
    category: 'Kesehatan Jiwa',
    standardDescription: 'Pelayanan kesehatan bagi orang dengan gangguan jiwa berat (Psikotik Akut & Skizofrenia) meliputi pemeriksaan psikiatri, pemantauan kepatuhan minum obat antipsikotik, pencegahan dan penanganan kasus pasung (Bebas Pasung), serta edukasi penerimaan keluarga dan masyarakat.',
    targetPopulation: 28,
    achievedCount: 28,
    targetPercentage: 100,
    percentage: 100.0,
    unitMeasure: 'Orang (ODGJ Berat)',
    picEmployeeName: 'Egidius Nong, S.Kep, Ns',
    picEmployeeNip: '19870808 201001 1 006',
    picPosition: 'Koordinator Program Kesehatan Jiwa (Keswa) & Bebas Pasung',
    period: 'Tahun 2026',
    quarterProgress: { q1: 7, q2: 7, q3: 7, q4: 7 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 6, achievedCount: 6, percentage: 100 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 8, achievedCount: 8, percentage: 100 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 4, achievedCount: 4, percentage: 100 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 4, achievedCount: 4, percentage: 100 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 6, achievedCount: 6, percentage: 100 },
    ],
    keyActivities: [
      'Kunjungan Rumah Rutin (Home Care Keswa) Setiap Bulan bersama Tim Terpadu',
      'Distribusi dan Pemantauan Obat Antipsikotik Oral / Injeksi Depot',
      'Sosialisasi Anti Stigma Jiwa & Deklarasi Desa Bebas Pasung di 5 Desa',
      'Fasilitasi Rujukan ke RSUD TC Hillers Maumere / RS Jiwa Naimata Kupang bila Relaps Akut'
    ],
    problemAnalysis: 'Stigma masyarakat dan keputusasaan keluarga saat pasien mengalami penurunan emosi atau kambuh.',
    followUpPlan: 'Dukungan psikososial berkelanjutan kepada keluarga (caregiver) dan pelibatan tokoh agama/masyarakat.',
    status: 'Tercapai',
    updatedAt: new Date().toISOString(),
  },

  // 11. Pelayanan Kesehatan Terduga Tuberkulosis (TBC)
  {
    id: 'spm-11',
    number: 11,
    name: 'Pelayanan Kesehatan Orang Terduga Tuberkulosis (TBC / Suspek TB) Sesuai Standar',
    shortTitle: 'Pelayanan Terduga Tuberkulosis (TBC)',
    category: 'Penyakit Menular (TB & HIV)',
    standardDescription: 'Pelayanan kesehatan bagi orang terduga TBC meliputi pemeriksaan klinis, pemeriksaan penunjang dahak dengan Tes Cepat Molekuler (TCM) GeneXpert atau mikroskopis BTA, penegakan diagnosis, dan inisiasi Pengobatan Obat Anti Tuberkulosis (OAT) standar sampai sembuh.',
    targetPopulation: 185,
    achievedCount: 168,
    targetPercentage: 100,
    percentage: 90.8,
    unitMeasure: 'Orang (Terduga Suspek TB)',
    picEmployeeName: 'Yosefina Maya, A.Md.AK',
    picEmployeeNip: '19910405 201503 2 006',
    picPosition: 'Pengelola Program TB Paru & Analis Laboratorium',
    period: 'Tahun 2026',
    quarterProgress: { q1: 42, q2: 43, q3: 42, q4: 41 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 40, achievedCount: 38, percentage: 95.0 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 45, achievedCount: 42, percentage: 93.3 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 28, achievedCount: 24, percentage: 85.7 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 32, achievedCount: 28, percentage: 87.5 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 40, achievedCount: 36, percentage: 90.0 },
    ],
    keyActivities: [
      'Investigasi Kontak Serumah (IK) pada setiap Pasien Positif TBC',
      'Gerakan Ketuk Pintu TB & Pengambilan Dahak Sputum Door-to-Door oleh Kader',
      'Pengiriman Sampel Dahak ke Laboratorium TCM Rujukan RSUD TC Hillers',
      'Pemantauan Minum Obat (PMO) bersama Bidan Desa hingga 6 Bulan Pengobatan Tuntas'
    ],
    problemAnalysis: 'Pasien batuk lama kadang enggan mengeluarkan dahak dengan volume cukup untuk uji TCM.',
    followUpPlan: 'Edukasi cara berdahak yang benar dan penyediaan pot dahak steril di seluruh Pustu/Poskesdes.',
    status: 'On Track',
    updatedAt: new Date().toISOString(),
  },

  // 12. Pelayanan Kesehatan Orang dengan Risiko Terinfeksi HIV
  {
    id: 'spm-12',
    number: 12,
    name: 'Pelayanan Kesehatan Orang dengan Risiko Terinfeksi Virus HIV Sesuai Standar',
    shortTitle: 'Pelayanan Orang Berisiko HIV',
    category: 'Penyakit Menular (TB & HIV)',
    standardDescription: 'Pelayanan skrining dan tes cepat HIV (Rapid Test R1, R2, R3) disertai konseling pra dan pasca tes (VCT/PITC) bagi populasi berisiko (Ibu Hamil, Pasien TBC, Pasien IMS, WBP, dan Pasangan Kunci) serta inisiasi terapi Antiretroviral (ARV).',
    targetPopulation: 260,
    achievedCount: 245,
    targetPercentage: 100,
    percentage: 94.2,
    unitMeasure: 'Orang (Populasi Berisiko / Bumil / Pasien TB)',
    picEmployeeName: 'Kornelia Heni, S.Tr.Keb',
    picEmployeeNip: '19891212 201402 2 004',
    picPosition: 'Koordinator Layanan Konseling & Tes HIV (VCT / PITC)',
    period: 'Tahun 2026',
    quarterProgress: { q1: 62, q2: 64, q3: 60, q4: 59 },
    villageBreakdown: [
      { villageId: 'desa-01', villageName: 'Desa Kringa', targetCount: 55, achievedCount: 52, percentage: 94.5 },
      { villageId: 'desa-02', villageName: 'Desa Timutawa', targetCount: 60, achievedCount: 58, percentage: 96.7 },
      { villageId: 'desa-03', villageName: 'Desa Hikong', targetCount: 42, achievedCount: 38, percentage: 90.5 },
      { villageId: 'desa-04', villageName: 'Desa Udekduen', targetCount: 45, achievedCount: 42, percentage: 93.3 },
      { villageId: 'desa-05', villageName: 'Desa Ojang', targetCount: 58, achievedCount: 55, percentage: 94.8 },
    ],
    keyActivities: [
      'Skrining Triple Eliminasi (HIV, Sifilis, Hepatitis B) Wajib bagi Seluruh Ibu Hamil K1',
      'Tes HIV Rutin (PITC) pada Seluruh Pasien Terdiagnosa TB Paru',
      'Konseling dan Edukasi Pencegahan Penularan HIV pada Kelompok Remaja dan Calon Pengantin (Catin)',
      'Kerahasiaan Medis Terjamin & Pendampingan Minum ARV bagi Kasus Reaktif'
    ],
    problemAnalysis: 'Stigma dan rasa takut malu masyarakat saat ditawarkan pemeriksaan tes HIV.',
    followUpPlan: 'Penguatan edukasi bahwa tes HIV merupakan prosedur kesehatan standar yang aman, rahasia, dan penting untuk keselamatan janin.',
    status: 'On Track',
    updatedAt: new Date().toISOString(),
  }
];

export function calculateSPMSummary(indicators: SPMIndicator[]) {
  const total = indicators.length;
  if (total === 0) {
    return {
      totalIndicators: 0,
      averagePercentage: 0,
      achievedCount: 0,
      onTrackCount: 0,
      attentionCount: 0,
      criticalCount: 0,
      totalTargetAll: 0,
      totalAchievedAll: 0,
    };
  }

  const sumPercentage = indicators.reduce((acc, curr) => acc + curr.percentage, 0);
  const avg = Number((sumPercentage / total).toFixed(1));
  const achieved = indicators.filter(i => i.percentage >= 100).length;
  const onTrack = indicators.filter(i => i.percentage >= 80 && i.percentage < 100).length;
  const attention = indicators.filter(i => i.percentage >= 50 && i.percentage < 80).length;
  const critical = indicators.filter(i => i.percentage < 50).length;

  const totalTargetAll = indicators.reduce((acc, curr) => acc + curr.targetPopulation, 0);
  const totalAchievedAll = indicators.reduce((acc, curr) => acc + curr.achievedCount, 0);

  return {
    totalIndicators: total,
    averagePercentage: avg,
    achievedCount: achieved,
    onTrackCount: onTrack,
    attentionCount: attention,
    criticalCount: critical,
    totalTargetAll,
    totalAchievedAll,
  };
}
