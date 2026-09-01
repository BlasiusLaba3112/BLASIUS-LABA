import { PuskesmasProfileData, FacilityUnit, OrganizationStructureData } from '../types/profileTerritory';

export const DEFAULT_FACILITIES: FacilityUnit[] = [
  {
    id: 'fac-1',
    name: 'Unit Gawat Darurat (UGD) 24 Jam',
    category: 'Kegawatdaruratan',
    operationalHours: '24 Jam Non-Stop',
    description: 'Pelayanan penanganan pasien gawat darurat, triase, tindakan medis cito, resusitasi, dan tim ambulans rujukan.',
    status: 'Siaga'
  },
  {
    id: 'fac-2',
    name: 'Ruang Bersalin (VK) & Nifas',
    category: 'Kesehatan Ibu & Anak',
    operationalHours: '24 Jam Non-Stop',
    description: 'Pelayanan persalinan normal 24 jam, perawatan ibu nifas, perawatan bayi baru lahir, dan emergensi obstetri neonatal dasar (PONED).',
    status: 'Aktif'
  },
  {
    id: 'fac-3',
    name: 'Poli Rawat Jalan Umum',
    category: 'Rawat Jalan',
    operationalHours: 'Senin - Sabtu (08.00 - 14.00 WITA)',
    description: 'Pemeriksaan dokter umum, diagnosis penyakit umum, pengobatan terpadu, dan penerbitan surat keterangan berobat/rujukan BPJS.',
    status: 'Aktif'
  },
  {
    id: 'fac-4',
    name: 'Poli KIA, KB & Imunisasi',
    category: 'Kesehatan Ibu & Anak',
    operationalHours: 'Senin - Sabtu (08.00 - 14.00 WITA)',
    description: 'Pemeriksaan antenatal care (ANC) ibu hamil, USG dasar, pelayanan kontrasepsi KB suntik/IUD/implan, dan imunisasi rutin lengkap.',
    status: 'Aktif'
  },
  {
    id: 'fac-5',
    name: 'Laboratorium Klinik Sederhana',
    category: 'Penunjang Medis',
    operationalHours: 'Senin - Sabtu (08.00 - 14.00 WITA)',
    description: 'Pemeriksaan hematologi rutin, malaria RDT & mikroskopis, glukosa darah, asam urat, kolesterol, tes kehamilan, TB TCM/BTA, dan skrining triple eliminasi (HIV, Sifilis, Hepatitis B).',
    status: 'Aktif'
  },
  {
    id: 'fac-6',
    name: 'Farmasi & Gudang Obat',
    category: 'Penunjang Medis',
    operationalHours: 'Senin - Sabtu (08.00 - 14.00 WITA) + UGD 24 Jam',
    description: 'Pengelolaan obat, pelayanan resep dokter, pemberian informasi obat (PIO), rantai dingin vaksin, dan suplai obat ke 5 Pustu/Poskesdes binaan.',
    status: 'Aktif'
  },
  {
    id: 'fac-7',
    name: 'Ruang Rawat Inap Umum',
    category: 'Rawat Inap',
    operationalHours: '24 Jam Non-Stop',
    description: 'Fasilitas observasi medis dan perawatan inap pasien umum dengan kapasitas tempat tidur dan pemantauan dokter/perawat jaga.',
    status: 'Aktif'
  },
  {
    id: 'fac-8',
    name: 'Poli Gigi & Mulut',
    category: 'Rawat Jalan',
    operationalHours: 'Senin - Sabtu (08.00 - 14.00 WITA)',
    description: 'Pemeriksaan kesehatan gigi dan mulut, penambalan, ekstraksi gigi sulung & permanen, pembersihan karang gigi, dan edukasi kesehatan gigi.',
    status: 'Aktif'
  },
  {
    id: 'fac-9',
    name: 'Klinik Sanitasi & Konseling Gizi / Promkes',
    category: 'Konseling & Promkes',
    operationalHours: 'Senin - Sabtu (08.00 - 14.00 WITA)',
    description: 'Konseling pencegahan stunting, pemantauan status gizi balita, PMBA, sanitasi lingkungan (STBM), dan edukasi PHBS bagi masyarakat.',
    status: 'Aktif'
  }
];

export const DEFAULT_ORGANIZATION_STRUCTURE: OrganizationStructureData = {
  title: 'STRUKTUR ORGANISASI UPT PUSKESMAS BOGANATAR',
  subtitle: 'Manajemen Klaster Integrasi Layanan Primer (ILP)',
  year: '2026',
  headOfPuskesmas: {
    title: 'KEPALA PUSKESMAS',
    name: 'Maria Yukensi Pogon, A.Md.Keb',
    nip: '19740303 200312 2 006'
  },
  originalImageUrl: 'https://iili.io/CmtF6Q9.jpg',
  clusters: [
    {
      id: 'cluster-1',
      code: 'KLASTER_1',
      title: 'KLASTER 1: MANAJEMEN PUSKESMAS & TATA USAHA',
      shortTitle: 'Klaster 1: Manajemen',
      colorTheme: 'blue',
      coordinator: {
        name: 'Kornelia P.K. Daro, A.Md.Keb',
        title: 'Penanggung Jawab Klaster 1 (Manajemen & Tata Usaha)'
      },
      units: [
        {
          id: 'unit-1-1',
          name: 'Manajemen Inti Puskesmas',
          personInCharge: 'Hermiana Dua Wisang, A.Md.Keb',
          roleTitle: 'PJ Manajemen Inti'
        },
        {
          id: 'unit-1-2',
          name: 'Manajemen Arsip & Persuratan',
          personInCharge: 'Maria Reyneldis Kartini',
          roleTitle: 'PJ Arsip & Tata Persuratan'
        },
        {
          id: 'unit-1-3',
          name: 'Manajemen Sumber Daya Manusia (SDM)',
          personInCharge: 'Kornelia P.K. Daro, A.Md.Keb',
          roleTitle: 'PJ Kepegawaian & SDMK'
        },
        {
          id: 'unit-1-4',
          name: 'Manajemen Sarana, Prasarana, dan Perbekalan Kesehatan',
          personInCharge: 'apt. Maria Ine Ali Djeen, S.Farm',
          roleTitle: 'PJ Aset, Sarpras & Alkes'
        },
        {
          id: 'unit-1-5',
          name: 'Manajemen Mutu Pelayanan & Akreditasi',
          personInCharge: 'Maria Vianey E. Bauk, S.Tr.Keb',
          roleTitle: 'PJ Mutu & Keselamatan Pasien'
        },
        {
          id: 'unit-1-6',
          name: 'Manajemen Keuangan dan Aset atau Barang Milik Daerah',
          personInCharge: 'Veronika Nobho, A.Md.RMIK',
          roleTitle: 'PJ Keuangan & BMD'
        },
        {
          id: 'unit-1-7',
          name: 'Manajemen Sistem Informasi Digital (SIMPUS / RME)',
          personInCharge: 'Maria Yosefina Iengu, A.Md.RMIK',
          roleTitle: 'PJ SIMPUS & Rekam Medis Elektronik'
        },
        {
          id: 'unit-1-8',
          name: 'Manajemen Jejaring Pelayanan & Fasilitas Kesehatan',
          personInCharge: 'Kornelia P.K. Daro, A.Md.Keb',
          roleTitle: 'PJ Jejaring Faskes'
        },
        {
          id: 'unit-1-9',
          name: 'Manajemen Pemberdayaan Masyarakat & Promkes',
          personInCharge: 'Veronika Dua Mitan, S.KM',
          roleTitle: 'PJ Promkes & Pemberdayaan'
        }
      ]
    },
    {
      id: 'cluster-2',
      code: 'KLASTER_2',
      title: 'KLASTER 2: IBU DAN ANAK',
      shortTitle: 'Klaster 2: Ibu & Anak',
      colorTheme: 'rose',
      coordinator: {
        name: 'Maria Elina Dayuarti Boruk, A.Md.Keb',
        title: 'Penanggung Jawab Klaster 2 (Kesehatan Ibu & Anak)'
      },
      units: [
        {
          id: 'unit-2-1',
          name: 'Pelayanan Ibu Hamil, Bersalin, atau Nifas (KIA/VK)',
          personInCharge: 'Maria Elina Dayuarti Boruk, A.Md.Keb',
          roleTitle: 'PJ ANC, Bersalin & Nifas'
        },
        {
          id: 'unit-2-2',
          name: 'Pelayanan Kesehatan Bayi dan Balita (Imunisasi & MTBS)',
          personInCharge: 'Kornelia P.K. Daro, A.Md.Keb',
          roleTitle: 'PJ Bayi & Balita'
        },
        {
          id: 'unit-2-3',
          name: 'Pelayanan Kesehatan Anak Pra Sekolah (PAUD/TK)',
          personInCharge: 'Fransiska Oktoviani Weri, S.Kep., Ns',
          roleTitle: 'PJ Anak Pra Sekolah'
        },
        {
          id: 'unit-2-4',
          name: 'Pelayanan Kesehatan Anak Usia Sekolah (UKS / SD / SMP)',
          personInCharge: 'Fransiska Oktoviani Weri, S.Kep., Ns',
          roleTitle: 'PJ UKS & Usia Sekolah'
        },
        {
          id: 'unit-2-5',
          name: 'Pelayanan Kesehatan Remaja (Posyandu Remaja & PKPR)',
          personInCharge: 'Hermiana Dua Wisang, A.Md.Keb',
          roleTitle: 'PJ Kesehatan Remaja / PKPR'
        }
      ]
    },
    {
      id: 'cluster-3',
      code: 'KLASTER_3',
      title: 'KLASTER 3: USIA DEWASA DAN LANSIA',
      shortTitle: 'Klaster 3: Dewasa & Lansia',
      colorTheme: 'amber',
      coordinator: {
        name: 'Markus Nusa, S.Kep., Ns',
        title: 'Penanggung Jawab Klaster 3 (Usia Dewasa & Lansia)'
      },
      units: [
        {
          id: 'unit-3-1',
          name: 'Pelayanan Kesehatan Usia Dewasa (Skrining PTM & Produktif)',
          personInCharge: 'Helena Lestari Leba, S.Kep., Ns',
          roleTitle: 'PJ Pelayanan Usia Produktif'
        },
        {
          id: 'unit-3-2',
          name: 'Pelayanan Kesehatan Lanjut Usia (Lansia / Posbindu / Geriatri)',
          personInCharge: 'Stefhiane Yolanda Sita, A.Md.Keb',
          roleTitle: 'PJ Pelayanan Kesehatan Lansia'
        }
      ]
    },
    {
      id: 'cluster-4',
      code: 'KLASTER_4',
      title: 'KLASTER 4: PENANGGULANGAN PENYAKIT MENULAR & KESLING',
      shortTitle: 'Klaster 4: P2P & Kesling',
      colorTheme: 'emerald',
      coordinator: {
        name: 'Agustinus Audakus, AMKL',
        title: 'Penanggung Jawab Klaster 4 (P2P & Kesehatan Lingkungan)'
      },
      units: [
        {
          id: 'unit-4-1',
          name: 'Surveilans dan Respons Penyakit Menular (termasuk SKD & Penanggulangan KLB / Wabah)',
          personInCharge: 'Yuliana Carolina Djawa Doren, S.Kep., Ns',
          roleTitle: 'PJ Surveilans & SKD-KLB'
        },
        {
          id: 'unit-4-2',
          name: 'Surveilans dan Respons Kesehatan Lingkungan (Vektor & Binatang Pembawa Penyakit)',
          personInCharge: 'Agustinus Audakus, AMKL',
          roleTitle: 'PJ Sanitasi & Vektor Kesling'
        }
      ]
    },
    {
      id: 'cluster-5',
      code: 'LINTAS_KLASTER',
      title: 'LINTAS KLASTER: PELAYANAN MEDIS & GAWAT DARURAT',
      shortTitle: 'Lintas Klaster: Penunjang & Gawat Darurat',
      colorTheme: 'indigo',
      coordinator: {
        name: 'Helena Lestari Leba, S.Kep., Ns',
        title: 'Koordinator Pelayanan Gawat Darurat & Penunjang'
      },
      units: [
        {
          id: 'unit-5-1',
          name: 'Pelayanan Gawat Darurat (UGD) 24 Jam & Ambulans Rujukan',
          personInCharge: 'Helena Lestari Leba, S.Kep., Ns',
          roleTitle: 'PJ UGD 24 Jam'
        },
        {
          id: 'unit-5-2',
          name: 'Pelayanan Rawat Inap Puskesmas',
          personInCharge: 'Felisima Yovita Magus, S.Kep., Ns',
          roleTitle: 'PJ Rawat Inap'
        },
        {
          id: 'unit-5-3',
          name: 'Pelayanan Kefarmasian & Gudang Obat',
          personInCharge: 'apt. Maria Ine Ali Djeen, S.Farm',
          roleTitle: 'Apoteker / PJ Farmasi'
        },
        {
          id: 'unit-5-4',
          name: 'Pelayanan Laboratorium Kesehatan Masyarakat',
          personInCharge: 'Theresia F.B. Gamun, A.Md.Kes',
          roleTitle: 'PJ Laboratorium Medis'
        },
        {
          id: 'unit-5-5',
          name: 'Pelayanan Kesehatan Gigi dan Mulut',
          personInCharge: 'Tim Pelayanan Gigi & Mulut',
          roleTitle: 'PJ Poli Gigi'
        },
        {
          id: 'unit-5-6',
          name: 'Penanggulangan Krisis Kesehatan & Bencana',
          personInCharge: 'Markus Nusa, S.Kep., Ns',
          roleTitle: 'PJ Tanggap Krisis Kesehatan'
        },
        {
          id: 'unit-5-7',
          name: 'Pelayanan Rehabilitasi Medik Dasar',
          personInCharge: 'Tim Pelayanan Medik Terpadu',
          roleTitle: 'PJ Rehabilitasi Medik'
        }
      ]
    }
  ]
};

export const INITIAL_PROFILE_TERRITORY_DATA: PuskesmasProfileData = {
  vision: 'Terwujudnya Masyarakat Wilayah Kerja UPT Puskesmas Boganatar yang Sehat, Mandiri, dan Berkeadilan Menuju Sikka Sejahtera 2026.',
  mission: [
    'Memberikan pelayanan kesehatan primer yang bermutu, terjangkau, merata, dan berkeadilan bagi seluruh masyarakat.',
    'Meningkatkan pemberdayaan masyarakat dan kemitraan lintas sektor dalam mewujudkan perilaku hidup bersih dan sehat (PHBS).',
    'Mengembangkan tata kelola Puskesmas yang akuntabel, transparan, profesional, serta didukung oleh tenaga kesehatan yang kompeten.',
    'Meningkatkan surveilans, pencegahan, pengendalian penyakit menular dan tidak menular serta percepatan penurunan stunting.',
    'Memperkuat sarana, prasarana, dan integrasi layanan primer (ILP) berbasis siklus hidup di tingkat Puskesmas, Pustu, dan Posyandu.'
  ],
  motto: 'Melayani dengan Kasih, Cepat, Tepat, dan Ramah (KASIH).',
  coreValues: {
    acronym: 'BOGANATAR',
    description: 'Tata Nilai Budaya Kerja UPT Puskesmas Boganatar',
    points: [
      { letter: 'B', word: 'Bersih', meaning: 'Menciptakan lingkungan kerja dan pelayanan yang higienis, rapi, dan bebas gratifikasi.' },
      { letter: 'O', word: 'Optimal', meaning: 'Memberikan kinerja dan pelayanan kesehatan dengan daya guna serta hasil yang terbaik.' },
      { letter: 'G', word: 'Gesit', meaning: 'Cepat, tanggap, dan sigap dalam menangani kegawatdaruratan dan keluhan pasien.' },
      { letter: 'A', word: 'Akuntabel', meaning: 'Setiap tindakan dan program kerja dapat dipertanggungjawabkan secara medis maupun administratif.' },
      { letter: 'N', word: 'Nyaman', meaning: 'Menghadirkan suasana pelayanan yang ramah, aman, dan menenangkan bagi pasien dan keluarga.' },
      { letter: 'A', word: 'Amanah', meaning: 'Menjunjung tinggi etika profesi dan integritas dalam menjalankan tugas kemanusiaan.' },
      { letter: 'T', word: 'Transparan', meaning: 'Keterbukaan informasi pelayanan, tarif, dan hak kewajiban pasien.' },
      { letter: 'A', word: 'Adil', meaning: 'Melayani seluruh lapisan masyarakat tanpa membeda-bedakan status sosial, suku, dan agama.' },
      { letter: 'R', word: 'Ramah', meaning: 'Senyum, Sapa, Salam, Sopan, dan Santun (5S) dalam setiap interaksi pelayanan.' }
    ]
  },
  overview: 'UPT Puskesmas Boganatar merupakan fasilitas pelayanan kesehatan tingkat pertama (FKTP) di bawah naungan Dinas Kesehatan Kabupaten Sikka, terletak di jalur strategis Trans Flores Maumere - Larantuka, Kecamatan Talibura. Puskesmas Boganatar mengampu 5 (lima) desa binaan dengan cakupan pelayanan promotif, preventif, kuratif, dan rehabilitatif serta Unit Gawat Darurat (UGD) dan Rawat Inap.',
  workingAreaDescription: 'Wilayah kerja UPT Puskesmas Boganatar mencakup 5 desa di bagian timur Kecamatan Talibura, Kabupaten Sikka dengan topografi kombinasi pesisir pantai utara Flores dan perbukitan. Akses antar desa terhubung melalui jalan negara Trans Flores dan jalan poros desa.',
  serviceHours: 'Pelayanan Rawat Jalan: Senin - Sabtu (08.00 - 14.00 WITA) | UGD & Persalinan: 24 Jam Non-Stop',
  facilities: DEFAULT_FACILITIES,
  organizationStructure: DEFAULT_ORGANIZATION_STRUCTURE,
  updatedAt: new Date().toISOString(),
  villages: [
    {
      id: 'desa-01',
      name: 'Desa Kringa',
      headOfVillage: 'Yohanes Don Bosco',
      phoneHeadOfVillage: '081339123401',
      areaKm2: 14.85,
      distanceToPuskesmasKm: 0.2,
      travelTimeMinutes: 2,
      geographicType: 'Dataran Rendah',
      pustuPoskesdes: 'Pustu Induk Kringa (Puskesmas Boganatar)',
      pustuStaff: 'Egidius S.Kep, Ns & Maria Fransiska, A.Md.Keb',
      population: {
        familyCount: 462,
        maleCount: 934,
        femaleCount: 986,
        totalPopulation: 1920,
        infantCount: 38,
        toddlerCount: 165,
        pregnantMotherCount: 28,
        nursingMotherCount: 34,
        elderlyCount: 245,
        productiveAgeCount: 1210,
        youthCount: 285,
        pusCount: 340,
        wusCount: 480,
        bpjsCoveredCount: 1785
      },
      posyanduList: [
        {
          id: 'pos-kr-01',
          name: 'Posyandu Mawar I',
          category: 'Posyandu Integrasi ILP',
          dusun: 'Dusun Kringa Barat',
          address: 'RT 002 / RW 001 Desa Kringa',
          cadreCount: 5,
          headOfPosyandu: 'Maria Magdalena Nona',
          phone: '081239847111',
          schedule: 'Setiap tanggal 8',
          notes: 'Melayani balita, ibu hamil, remaja, dan skrining lansia (ILP).'
        },
        {
          id: 'pos-kr-02',
          name: 'Posyandu Melati II',
          category: 'Posyandu Balita',
          dusun: 'Dusun Kringa Timur',
          address: 'RT 005 / RW 002 Desa Kringa',
          cadreCount: 5,
          headOfPosyandu: 'Theresia Imaculata',
          phone: '081338712902',
          schedule: 'Setiap tanggal 11',
          notes: 'Fokus penimbangan balita, PMT lokal, dan imunisasi rutin.'
        },
        {
          id: 'pos-kr-03',
          name: 'Posyandu Lansia Sejahtera',
          category: 'Posyandu Lansia',
          dusun: 'Dusun Kringa Tengah',
          address: 'Aula Balai Pertemuan Desa Kringa',
          cadreCount: 4,
          headOfPosyandu: 'Agustina Da Lopez',
          phone: '081246109333',
          schedule: 'Setiap tanggal 16',
          notes: 'Pemeriksaan tensi darah, gula darah, asam urat, dan senam lansia.'
        }
      ],
      notes: 'Desa lokasi utama berdirinya gedung UPT Puskesmas Boganatar.'
    },
    {
      id: 'desa-02',
      name: 'Desa Timutawa',
      headOfVillage: 'Fransiskus Xaverius Nong',
      phoneHeadOfVillage: '081237190002',
      areaKm2: 18.20,
      distanceToPuskesmasKm: 4.2,
      travelTimeMinutes: 8,
      geographicType: 'Pesisir / Pantai',
      pustuPoskesdes: 'Pustu Timutawa',
      pustuStaff: 'Bernadeta Bura, A.Md.Keb & Ns. Markus Nong, S.Kep',
      population: {
        familyCount: 518,
        maleCount: 1102,
        femaleCount: 1145,
        totalPopulation: 2247,
        infantCount: 44,
        toddlerCount: 189,
        pregnantMotherCount: 32,
        nursingMotherCount: 41,
        elderlyCount: 280,
        productiveAgeCount: 1410,
        youthCount: 345,
        pusCount: 395,
        wusCount: 550,
        bpjsCoveredCount: 2090
      },
      posyanduList: [
        {
          id: 'pos-tm-01',
          name: 'Posyandu Flamboyan I',
          category: 'Posyandu Integrasi ILP',
          dusun: 'Dusun Timutawa Pantai',
          address: 'RT 003 / RW 001 Desa Timutawa',
          cadreCount: 5,
          headOfPosyandu: 'Katarina Kewa',
          phone: '081337482910',
          schedule: 'Setiap tanggal 10',
          notes: 'Cakupan sasaran pesisir nelayan dan petani kebun.'
        },
        {
          id: 'pos-tm-02',
          name: 'Posyandu Anggrek II',
          category: 'Posyandu Balita',
          dusun: 'Dusun Timutawa Tengah',
          address: 'RT 007 / RW 003 Desa Timutawa',
          cadreCount: 5,
          headOfPosyandu: 'Yosefina Moa',
          phone: '081246981204',
          schedule: 'Setiap tanggal 14',
          notes: 'Pemberian vitamin A, penimbangan bulanan, dan edukasi stunting.'
        },
        {
          id: 'pos-tm-03',
          name: 'Posbindu PTM Timutawa',
          category: 'Posbindu PTM',
          dusun: 'Dusun Timutawa Darat',
          address: 'Pustu Timutawa',
          cadreCount: 4,
          headOfPosyandu: 'Elisabeth Dua',
          phone: '081339182049',
          schedule: 'Setiap tanggal 18',
          notes: 'Skrining faktor risiko penyakit tidak menular (hipertensi, diabetes).'
        }
      ],
      notes: 'Kawasan pesisir pantai dengan potensi perikanan dan perkebunan kelapa.'
    },
    {
      id: 'desa-03',
      name: 'Desa Hikong',
      headOfVillage: 'Antonius Nong Gabriel',
      phoneHeadOfVillage: '081337654321',
      areaKm2: 32.10,
      distanceToPuskesmasKm: 11.5,
      travelTimeMinutes: 20,
      geographicType: 'Perbukitan / Pegunungan',
      pustuPoskesdes: 'Pustu Hikong Perbukitan',
      pustuStaff: 'Klara Melania, A.Md.Keb & Paulus Pati, A.Md.Kep',
      population: {
        familyCount: 430,
        maleCount: 880,
        femaleCount: 915,
        totalPopulation: 1795,
        infantCount: 32,
        toddlerCount: 142,
        pregnantMotherCount: 24,
        nursingMotherCount: 30,
        elderlyCount: 220,
        productiveAgeCount: 1130,
        youthCount: 270,
        pusCount: 315,
        wusCount: 440,
        bpjsCoveredCount: 1620
      },
      posyanduList: [
        {
          id: 'pos-hk-01',
          name: 'Posyandu Kenanga I',
          category: 'Posyandu Integrasi ILP',
          dusun: 'Dusun Hikong Induk',
          address: 'RT 002 / RW 001 Desa Hikong',
          cadreCount: 5,
          headOfPosyandu: 'Veronika Dua Blolong',
          phone: '081237891234',
          schedule: 'Setiap tanggal 9',
          notes: 'Pelayanan terpadu ibu, balita, remaja dan lansia pegunungan.'
        },
        {
          id: 'pos-hk-02',
          name: 'Posyandu Cempaka II',
          category: 'Posyandu Balita',
          dusun: 'Dusun Watukrus',
          address: 'RT 005 / RW 002 Desa Hikong',
          cadreCount: 5,
          headOfPosyandu: 'Monika Nona Esi',
          phone: '081338192847',
          schedule: 'Setiap tanggal 13',
          notes: 'Akses perbukitan dengan pemantauan tumbuh kembang anak.'
        },
        {
          id: 'pos-hk-03',
          name: 'Posyandu Lansia Mawar Putih',
          category: 'Posyandu Lansia',
          dusun: 'Dusun Hikong Atas',
          address: 'Balai Dusun Hikong Atas',
          cadreCount: 4,
          headOfPosyandu: 'Yuliana Pareira',
          phone: '081246192837',
          schedule: 'Setiap tanggal 21',
          notes: 'Pemberian PMT lansia, cek tensi, dan bimbingan kesehatan.'
        }
      ],
      notes: 'Wilayah perbukitan dengan komoditas perkebunan kakao, kelapa, dan mente.'
    },
    {
      id: 'desa-04',
      name: 'Desa Udek Duen',
      headOfVillage: 'Siprianus Seke',
      phoneHeadOfVillage: '081338876543',
      areaKm2: 22.40,
      distanceToPuskesmasKm: 6.8,
      travelTimeMinutes: 12,
      geographicType: 'Perbukitan / Pegunungan',
      pustuPoskesdes: 'Poskesdes Udek Duen',
      pustuStaff: 'Maria Ose, A.Md.Keb & Kornelia Heni, S.Tr.Keb',
      population: {
        familyCount: 410,
        maleCount: 860,
        femaleCount: 890,
        totalPopulation: 1750,
        infantCount: 34,
        toddlerCount: 145,
        pregnantMotherCount: 26,
        nursingMotherCount: 32,
        elderlyCount: 215,
        productiveAgeCount: 1095,
        youthCount: 265,
        pusCount: 305,
        wusCount: 425,
        bpjsCoveredCount: 1580
      },
      posyanduList: [
        {
          id: 'pos-ud-01',
          name: 'Posyandu Kasih Kasih I',
          category: 'Posyandu Integrasi ILP',
          dusun: 'Dusun Udekduen Induk',
          address: 'RT 001 / RW 001 Desa Udekduen',
          cadreCount: 5,
          headOfPosyandu: 'Siti Fatima',
          phone: '081239019283',
          schedule: 'Setiap tanggal 12',
          notes: 'Pelayanan menyeluruh terintegrasi siklus hidup.'
        },
        {
          id: 'pos-ud-02',
          name: 'Posyandu Mawar Sehat II',
          category: 'Posyandu Balita',
          dusun: 'Dusun Udekduen Timur',
          address: 'RT 004 / RW 002 Desa Udekduen',
          cadreCount: 5,
          headOfPosyandu: 'Maria Fatima',
          phone: '081338291048',
          schedule: 'Setiap tanggal 15',
          notes: 'Penimbangan, pengukuran tinggi badan, konseling gizi balita.'
        },
        {
          id: 'pos-ud-03',
          name: 'Posbindu Lansia Udekduen',
          category: 'Posyandu Lansia',
          dusun: 'Dusun Udekduen Barat',
          address: 'Gedung Poskesdes Udekduen',
          cadreCount: 4,
          headOfPosyandu: 'Theresia Pareira',
          phone: '081339871029',
          schedule: 'Setiap tanggal 20',
          notes: 'Pemeriksaan kesehatan rutin lansia dan posyandu Usila.'
        }
      ],
      notes: 'Desa dengan perkebunan mente, kemiri, dan persawahan tadah hujan.'
    },
    {
      id: 'desa-05',
      name: 'Desa Ojang',
      headOfVillage: 'Petrus Marianus',
      phoneHeadOfVillage: '081239876512',
      areaKm2: 21.40,
      distanceToPuskesmasKm: 8.8,
      travelTimeMinutes: 16,
      geographicType: 'Perbukitan / Pegunungan',
      pustuPoskesdes: 'Poskesdes Ojang',
      pustuStaff: 'Maria Anastasia, A.Md.Keb',
      population: {
        familyCount: 360,
        maleCount: 740,
        femaleCount: 775,
        totalPopulation: 1515,
        infantCount: 26,
        toddlerCount: 118,
        pregnantMotherCount: 19,
        nursingMotherCount: 24,
        elderlyCount: 195,
        productiveAgeCount: 960,
        youthCount: 230,
        pusCount: 265,
        wusCount: 370,
        bpjsCoveredCount: 1390
      },
      posyanduList: [
        {
          id: 'pos-oj-01',
          name: 'Posyandu Kasih Ibu I',
          category: 'Posyandu Integrasi ILP',
          dusun: 'Dusun Ojang Tengah',
          address: 'RT 003 / RW 001 Desa Ojang',
          cadreCount: 5,
          headOfPosyandu: 'Apolonia Nona',
          phone: '081339182736',
          schedule: 'Setiap tanggal 11',
          notes: 'Posyandu utama desa dengan integrasi pelayanan ILP.'
        },
        {
          id: 'pos-oj-02',
          name: 'Posyandu Melati Ojang II',
          category: 'Posyandu Balita',
          dusun: 'Dusun Natarlajar',
          address: 'RT 006 / RW 002 Desa Ojang',
          cadreCount: 4,
          headOfPosyandu: 'Bernadetha Dua',
          phone: '081246819203',
          schedule: 'Setiap tanggal 16',
          notes: 'Pemantauan status gizi anak, imunisasi, dan kelas ibu hamil.'
        },
        {
          id: 'pos-oj-03',
          name: 'Posbindu Lansia Sehat',
          category: 'Posyandu Lansia',
          dusun: 'Dusun Ojang Bawah',
          address: 'Poskesdes Ojang',
          cadreCount: 4,
          headOfPosyandu: 'Maria Goreti',
          phone: '081338910293',
          schedule: 'Setiap tanggal 23',
          notes: 'Pemeriksaan kesehatan berkala bagi warga pra-lansia dan lansia.'
        }
      ],
      notes: 'Wilayah perkebunan dan pertanian dengan iklim sejuk perbukitan.'
    }
  ]
};
