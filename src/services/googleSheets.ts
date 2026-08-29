import { Employee, PuskesmasInfo, NipType, Gender, Religion, MaritalStatus, EmploymentStatus, StaffCategory, PositionType, EducationLevel } from '../types/employee';

export interface DriveSpreadsheetFile {
  id: string;
  name: string;
  modifiedTime?: string;
  webViewLink?: string;
}

export const SPREADSHEET_HEADERS = [
  'No',
  'ID Pegawai',
  'Nama Lengkap & Gelar',
  'Jenis Nomor Pegawai',
  'NIP / Nomor Pegawai',
  'NIK (16 Digit)',
  'Tempat Lahir',
  'Tanggal Lahir',
  'Jenis Kelamin',
  'Agama',
  'Status Perkawinan',
  'Status Kepegawaian',
  'Pangkat / Golongan Ruang',
  'TMT SK Terakhir',
  'TMT Awal CPNS/Bekerja',
  'Nama Jabatan',
  'Unit Kerja / Ruangan',
  'Kategori Personel (Nakes / Non-Nakes)',
  'Jenis Jabatan',
  'Jenjang Pendidikan',
  'Jurusan / Program Studi',
  'Nama Kampus / Institusi',
  'Tahun Lulus',
  'Nomor STR',
  'Masa Berlaku STR',
  'STR Seumur Hidup',
  'Nomor SIP',
  'Masa Berlaku SIP',
  'Nomor HP / WhatsApp',
  'Email',
  'Alamat Domisili',
  'Catatan Khusus',
  'Terakhir Diperbarui'
];

/**
 * Converts an Employee object to a row array for Google Sheets
 */
export function employeeToSheetRow(employee: Employee, index: number): (string | number)[] {
  return [
    index + 1,
    employee.id || '',
    employee.fullName || '',
    employee.nipType || 'NIP',
    employee.nip || '',
    employee.nik || '',
    employee.birthPlace || '',
    employee.birthDate || '',
    employee.gender || 'L',
    employee.religion || 'Katolik',
    employee.maritalStatus || 'Menikah',
    employee.employmentStatus || 'PNS',
    employee.rankGrade || '',
    employee.appointmentTMT || '',
    employee.firstAppointmentTMT || '',
    employee.jobTitle || '',
    employee.department || '',
    employee.staffCategory || 'Nakes',
    employee.positionType || 'Fungsional Tertentu',
    employee.educationLevel || 'D-III',
    employee.major || '',
    employee.institution || '',
    employee.graduationYear || '',
    employee.strNumber || '',
    employee.strExpiryDate || '',
    employee.strIsLifetime ? 'Ya (Seumur Hidup)' : 'Tidak',
    employee.sipNumber || '',
    employee.sipExpiryDate || '',
    employee.phone || '',
    employee.email || '',
    employee.address || '',
    employee.notes || '',
    employee.updatedAt || new Date().toISOString()
  ];
}

/**
 * Parses a Google Sheets row into an Employee object
 */
export function sheetRowToEmployee(row: (string | number)[], existingId?: string): Employee {
  // Defensive helper
  const getCol = (idx: number): string => {
    const val = row[idx];
    return val !== undefined && val !== null ? String(val).trim() : '';
  };

  const id = existingId || getCol(1) || `emp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const fullName = getCol(2) || 'Pegawai Puskesmas';
  const nipType = (getCol(3) || 'NIP') as NipType;
  const nip = getCol(4);
  const nik = getCol(5);
  const birthPlace = getCol(6);
  const birthDate = getCol(7);
  const gender = (getCol(8) === 'P' ? 'P' : 'L') as Gender;
  const religion = (getCol(9) || 'Katolik') as Religion;
  const maritalStatus = (getCol(10) || 'Menikah') as MaritalStatus;
  const employmentStatus = (getCol(11) || 'PNS') as EmploymentStatus;
  const rankGrade = getCol(12);
  const appointmentTMT = getCol(13);
  const firstAppointmentTMT = getCol(14);
  const jobTitle = getCol(15) || 'Staf Puskesmas';
  const department = getCol(16) || 'Unit Pelayanan';
  const staffCategory = (getCol(17).toLowerCase().includes('non') ? 'Non-Nakes' : 'Nakes') as StaffCategory;
  const positionType = (getCol(18) || 'Fungsional Tertentu') as PositionType;
  const educationLevel = (getCol(19) || 'D-III') as EducationLevel;
  const major = getCol(20);
  const institution = getCol(21);
  const graduationYear = parseInt(getCol(22), 10) || new Date().getFullYear();
  const strNumber = getCol(23);
  const strExpiryDate = getCol(24);
  const strIsLifetime = getCol(25).toLowerCase().includes('ya') || getCol(25).toLowerCase().includes('seumur');
  const sipNumber = getCol(26);
  const sipExpiryDate = getCol(27);
  const phone = getCol(28);
  const email = getCol(29);
  const address = getCol(30);
  const notes = getCol(31);

  return {
    id,
    fullName,
    nipType,
    nip,
    nik,
    birthPlace,
    birthDate,
    gender,
    religion,
    maritalStatus,
    address,
    village: 'Desa Kringa',
    phone,
    email,
    photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=2563eb&color=fff`,
    employmentStatus,
    rankGrade,
    appointmentTMT,
    firstAppointmentTMT,
    jobTitle,
    staffCategory,
    department,
    positionType,
    educationLevel,
    major,
    institution,
    graduationYear,
    strNumber,
    strExpiryDate,
    strIsLifetime,
    sipNumber,
    sipExpiryDate,
    documents: [],
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
}

/**
 * Creates a brand new Google Spreadsheet in the user's Drive with full SIMPEG formatting
 */
export async function createSimpegSpreadsheet(
  accessToken: string,
  puskesmasInfo: PuskesmasInfo,
  employees: Employee[]
): Promise<{ spreadsheetId: string; spreadsheetUrl: string; title: string }> {
  const title = `SIMPEG UPT Puskesmas Boganatar - Data Kepegawaian (${new Date().toLocaleDateString('id-ID')})`;

  // 1. Create Spreadsheet with Initial Sheet
  const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      properties: {
        title: title,
        locale: 'id_ID',
        timeZone: 'Asia/Makassar'
      },
      sheets: [
        {
          properties: {
            title: 'Data Pegawai',
            gridProperties: {
              frozenRowCount: 4,
              columnCount: SPREADSHEET_HEADERS.length + 2
            }
          }
        }
      ]
    })
  });

  if (!createRes.ok) {
    const errorData = await createRes.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Gagal membuat spreadsheet (${createRes.status})`);
  }

  const spreadsheet = await createRes.json();
  const spreadsheetId = spreadsheet.spreadsheetId;
  const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

  // 2. Populate Header Metadata & Data Rows
  const rows: (string | number)[][] = [
    [`UPT PUSKESMAS BOGANATAR - DINAS KESEHATAN KABUPATEN SIKKA`],
    [`Sistem Informasi Manajemen Kepegawaian (SIMPEG) | Tanggal Ekspor: ${new Date().toLocaleString('id-ID')}`],
    [`Alamat: ${puskesmasInfo.address} | Kepala: ${puskesmasInfo.headOfPuskesmas.name}`],
    SPREADSHEET_HEADERS,
    ...employees.map((emp, idx) => employeeToSheetRow(emp, idx))
  ];

  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Data%20Pegawai!A1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: 'Data Pegawai!A1',
      majorDimension: 'ROWS',
      values: rows
    })
  });

  // 3. Format header styling via batchUpdate
  try {
    await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        requests: [
          // Format Row 4 (Table Headers)
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 3,
                endRowIndex: 4,
                startColumnIndex: 0,
                endColumnIndex: SPREADSHEET_HEADERS.length
              },
              cell: {
                userEnteredFormat: {
                  backgroundColor: { red: 0.1, green: 0.18, blue: 0.36 }, // Dark Slate Navy
                  textFormat: {
                    foregroundColor: { red: 1.0, green: 1.0, blue: 1.0 },
                    bold: true,
                    fontSize: 10
                  },
                  horizontalAlignment: 'CENTER',
                  verticalAlignment: 'MIDDLE'
                }
              },
              fields: 'userEnteredFormat(backgroundColor,textFormat,horizontalAlignment,verticalAlignment)'
            }
          },
          // Format Row 1 (Title)
          {
            repeatCell: {
              range: {
                sheetId: 0,
                startRowIndex: 0,
                endRowIndex: 1,
                startColumnIndex: 0,
                endColumnIndex: 6
              },
              cell: {
                userEnteredFormat: {
                  textFormat: { bold: true, fontSize: 13 }
                }
              },
              fields: 'userEnteredFormat(textFormat)'
            }
          }
        ]
      })
    });
  } catch (e) {
    console.warn('Styling batchUpdate was skipped or partially applied:', e);
  }

  return { spreadsheetId, spreadsheetUrl, title };
}

/**
 * Updates an existing Google Spreadsheet with current employee data
 */
export async function syncEmployeesToSpreadsheet(
  accessToken: string,
  spreadsheetId: string,
  employees: Employee[],
  puskesmasInfo: PuskesmasInfo
): Promise<void> {
  // First, get the sheet name
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!metaRes.ok) {
    throw new Error('Spreadsheet tidak ditemukan atau Anda tidak memiliki akses ke spreadsheet tersebut.');
  }

  const meta = await metaRes.json();
  const firstSheetName = meta.sheets?.[0]?.properties?.title || 'Sheet1';

  // Clear existing content in the sheet
  await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${encodeURIComponent(firstSheetName)}'!A1:Z500:clear`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });

  // Prepare updated rows
  const rows: (string | number)[][] = [
    [`UPT PUSKESMAS BOGANATAR - DINAS KESEHATAN KABUPATEN SIKKA`],
    [`Sistem Informasi Kepegawaian (SIMPEG) | Diperbarui: ${new Date().toLocaleString('id-ID')}`],
    [`Alamat: ${puskesmasInfo.address} | Kepala: ${puskesmasInfo.headOfPuskesmas.name}`],
    SPREADSHEET_HEADERS,
    ...employees.map((emp, idx) => employeeToSheetRow(emp, idx))
  ];

  const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${encodeURIComponent(firstSheetName)}'!A1?valueInputOption=USER_ENTERED`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      range: `'${firstSheetName}'!A1`,
      majorDimension: 'ROWS',
      values: rows
    })
  });

  if (!updateRes.ok) {
    const err = await updateRes.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal memperbarui data di Google Sheets.');
  }
}

/**
 * Imports employees from a Google Spreadsheet
 */
export async function importEmployeesFromSpreadsheet(
  accessToken: string,
  spreadsheetId: string
): Promise<{ employees: Employee[]; sheetTitle: string; rowCount: number }> {
  // 1. Get metadata
  const metaRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!metaRes.ok) {
    throw new Error('Spreadsheet tidak ditemukan atau Anda tidak memiliki hak akses.');
  }

  const meta = await metaRes.json();
  const sheetTitle = meta.properties?.title || 'Spreadsheet Pegawai';
  const targetSheetName = meta.sheets?.[0]?.properties?.title || 'Sheet1';

  // 2. Fetch all values
  const valRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/'${encodeURIComponent(targetSheetName)}'!A1:AG300`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!valRes.ok) {
    throw new Error('Gagal mengambil baris data dari Google Sheets.');
  }

  const valData = await valRes.json();
  const rawRows: (string | number)[][] = valData.values || [];

  if (rawRows.length === 0) {
    throw new Error('Spreadsheet kosong, tidak ada data untuk diimpor.');
  }

  // Find header row (it could be row 1, 2, 3, or 4)
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(rawRows.length, 10); i++) {
    const rowStr = rawRows[i].map(c => String(c).toLowerCase()).join(' ');
    if (rowStr.includes('nama') || rowStr.includes('nip') || rowStr.includes('jabatan')) {
      headerRowIndex = i;
      break;
    }
  }

  if (headerRowIndex === -1) {
    headerRowIndex = 0; // Default to first row
  }

  const dataRows = rawRows.slice(headerRowIndex + 1);
  const parsedEmployees: Employee[] = [];

  for (const row of dataRows) {
    // Skip empty rows
    if (!row || row.length === 0 || !row.some(c => String(c).trim() !== '')) {
      continue;
    }
    // Check if row contains a name in column index 1 or 2
    const nameCandidate = row[2] || row[1] || row[0];
    if (!nameCandidate || String(nameCandidate).trim() === '') continue;

    parsedEmployees.push(sheetRowToEmployee(row));
  }

  return {
    employees: parsedEmployees,
    sheetTitle,
    rowCount: parsedEmployees.length
  };
}

/**
 * Lists user's spreadsheets from Google Drive
 */
export async function listUserSpreadsheets(accessToken: string): Promise<DriveSpreadsheetFile[]> {
  const query = encodeURIComponent("mimeType='application/vnd.google-apps.spreadsheet' and trashed=false");
  const res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}&orderBy=modifiedTime%20desc&pageSize=25&fields=files(id,name,modifiedTime,webViewLink)`, {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Gagal memuat daftar Google Spreadsheet dari Drive.');
  }

  const data = await res.json();
  return data.files || [];
}
