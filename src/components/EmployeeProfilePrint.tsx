import React from 'react';
import { Printer, X, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Employee, PuskesmasInfo } from '../types/employee';
import { formatDateIndonesian, calculateAge, calculateTenure, getCredentialStatus } from '../utils/helpers';
import { printDocumentElement } from '../utils/printDocument';

interface EmployeeProfilePrintProps {
  employee: Employee | null;
  puskesmasInfo: PuskesmasInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const EmployeeProfilePrint: React.FC<EmployeeProfilePrintProps> = ({
  employee,
  puskesmasInfo,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !employee) return null;

  const age = calculateAge(employee.birthDate);
  const tenure = calculateTenure(employee.appointmentTMT);
  const totalServiceTenure = calculateTenure(employee.firstAppointmentTMT);
  const strStatus = getCredentialStatus(employee.strExpiryDate, employee.strIsLifetime, employee.staffCategory === 'Nakes');
  const sipStatus = getCredentialStatus(employee.sipExpiryDate, false, employee.staffCategory === 'Nakes');

  const todayIndo = formatDateIndonesian(new Date().toISOString().split('T')[0]);

  const handlePrint = () => {
    printDocumentElement('official-print-document', {
      title: `Lembar Biodata Pegawai - ${employee.fullName}`,
      landscape: false
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-6 print:p-0 print:static print:bg-white print:overflow-visible">
      {/* Container Dialog */}
      <div 
        id="print-profile-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[96vh] overflow-y-auto flex flex-col print:max-h-none print:shadow-none print:border-none print:rounded-none print:w-full print:max-w-none print:overflow-visible"
      >
        {/* Floating Action Bar (Hidden during print) */}
        <div className="sticky top-0 z-20 bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between shadow-md print:hidden border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm text-white">Pratinjau Cetak Lembar Profil Pegawai (A4 Resmi)</span>
              <p className="text-[11px] text-slate-400">Siap cetak atau simpan sebagai PDF melalui menu print browser (Ctrl + P)</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              id="btn-trigger-print"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg shadow-2xs transition-all transform active:scale-95 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Sekarang / Simpan PDF</span>
            </button>
            <button
              id="btn-close-print-modal"
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINT DOCUMENT PAPER (A4 Standard Format) */}
        <div 
          id="official-print-document"
          className="p-8 sm:p-12 text-slate-900 font-serif leading-relaxed bg-white print:p-6 print:m-0"
          style={{ minHeight: '297mm' }}
        >
          {/* OFFICIAL GOVERNMENT KOP SURAT */}
          <div className="border-b-4 border-double border-slate-900 pb-3 mb-6 relative min-h-[95px] flex items-center justify-between">
            {/* LOGO KOP SURAT (KIRI) */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center pl-1">
              <img 
                src="/images/logo_kop.png" 
                alt="Logo Kop Surat" 
                className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://iili.io/Cmfrfbj.png";
                }}
              />
            </div>

            {/* TEKS KOP SURAT (TENGAH) */}
            <div className="w-full text-center px-16 sm:px-24">
              <h3 className="text-sm sm:text-base font-bold uppercase tracking-widest font-sans text-slate-900 leading-tight">
                PEMERINTAH KABUPATEN SIKKA
              </h3>
              <h2 className="text-base sm:text-lg font-extrabold uppercase tracking-wide font-sans text-slate-900 leading-tight">
                DINAS KESEHATAN
              </h2>
              <h1 className="text-lg sm:text-xl font-black uppercase tracking-wider font-sans text-slate-950 leading-tight mt-0.5">
                UPT PUSKESMAS BOGANATAR
              </h1>
              <p className="text-[11px] font-sans text-slate-700 mt-1">
                Jalan Raya Maumere – Larantuka, KM 65 KMKode Pos : 86183, Tlp ; 082341777140
              </p>
              <p className="text-[11px] font-sans text-slate-700 mt-0.5">
                Pos Elektonik : boganatar@gmail.com, Mobile :-
              </p>
            </div>
          </div>

          {/* DOCUMENT TITLE */}
          <div className="text-center mb-6">
            <h2 className="text-base font-bold uppercase underline tracking-wider font-sans text-slate-900">
              BIODATA DAN PROFIL LENGKAP PEGAWAI
            </h2>
            <p className="text-xs font-sans text-slate-600 mt-0.5">
              Nomor Induk Registrasi: <span className="font-mono font-bold text-slate-900">{employee.nip}</span>
            </p>
          </div>

          {/* TOP SECTION: PHOTO & QUICK SUMMARY */}
          <div className="flex flex-row justify-between items-start gap-6 mb-6 pb-4 border-b border-slate-200">
            <div className="flex-1 space-y-1 font-sans text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{employee.fullName}</span>
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-slate-100 border border-slate-300">
                  {employee.employmentStatus}
                </span>
              </div>
              <p className="text-slate-700 font-semibold">{employee.jobTitle}</p>
              <p className="text-slate-600">Unit Kerja: <strong>UPT PUSKESMAS BOGANATAR</strong></p>
              <p className="text-slate-500 text-[11px]">
                Status Keanggotaan: {employee.staffCategory === 'Nakes' ? 'Tenaga Kesehatan (Nakes Pelayanan)' : 'Non-Tenaga Medis'} &bull; Jabatan {employee.positionType}
              </p>
            </div>

            {/* Passport Photo 3x4 */}
            <div className="w-28 h-36 flex-shrink-0 border-2 border-slate-900 p-0.5 bg-slate-100 shadow-2xs flex flex-col items-center justify-center">
              <img
                src={employee.photoUrl}
                alt={employee.fullName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.fullName)}&background=2563eb&color=fff`;
                }}
              />
            </div>
          </div>

          {/* SECTION 1: IDENTITAS PRIBADI */}
          <div className="mb-5">
            <div className="bg-slate-100 px-3 py-1 font-sans font-bold text-xs uppercase tracking-wide border-l-4 border-blue-600 text-slate-900 mb-2">
              I. IDENTITAS PRIBADI PEGAWAI
            </div>
            <table className="w-full text-xs font-sans border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 w-44 font-semibold text-slate-700">Nama Lengkap & Gelar</td>
                  <td className="py-1.5 w-4 text-center">:</td>
                  <td className="py-1.5 font-bold text-slate-900">{employee.fullName}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">{employee.nipType}</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 font-mono text-slate-900">{employee.nip}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Nomor Induk Kependudukan (NIK)</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 font-mono text-slate-900">{employee.nik || '-'}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Tempat, Tanggal Lahir (Usia)</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 text-slate-900">
                    {employee.birthPlace}, {formatDateIndonesian(employee.birthDate)} ({age} Tahun)
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Jenis Kelamin / Agama</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 text-slate-900">
                    {employee.gender === 'L' ? 'Laki-laki' : 'Perempuan'} / {employee.religion}
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Status Perkawinan</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 text-slate-900">{employee.maritalStatus}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Alamat Domisili</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 text-slate-900">{employee.address} ({employee.village})</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Kontak Telepon / WhatsApp</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 font-mono text-slate-900">{employee.phone || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-semibold text-slate-700">Alamat Email</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 text-slate-900">{employee.email || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SECTION 2: STATUS KEPEGAWAIAN & JABATAN */}
          <div className="mb-5">
            <div className="bg-slate-100 px-3 py-1 font-sans font-bold text-xs uppercase tracking-wide border-l-4 border-blue-600 text-slate-900 mb-2">
              II. STATUS KEPEGAWAIAN & JABATAN
            </div>
            <table className="w-full text-xs font-sans border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 w-44 font-semibold text-slate-700">Status Kepegawaian</td>
                  <td className="py-1.5 w-4 text-center">:</td>
                  <td className="py-1.5 font-bold text-slate-900">{employee.employmentStatus}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Pangkat / Golongan Ruang</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 text-slate-900">{employee.rankGrade || '-'}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">TMT Pengangkatan Terakhir</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 text-slate-900">{formatDateIndonesian(employee.appointmentTMT)}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Masa Kerja Golongan / Total</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 text-slate-900">
                    {tenure} (TMT Awal: {formatDateIndonesian(employee.firstAppointmentTMT)})
                  </td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Nama Jabatan</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 font-bold text-slate-900">{employee.jobTitle}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Jenis Jabatan</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 text-slate-900">{employee.positionType}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-semibold text-slate-700">Unit Kerja Penempatan</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 font-bold text-slate-950">{employee.department}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SECTION 3: PENDIDIKAN FORMAL */}
          <div className="mb-5">
            <div className="bg-slate-100 px-3 py-1 font-sans font-bold text-xs uppercase tracking-wide border-l-4 border-blue-600 text-slate-900 mb-2">
              III. RIWAYAT PENDIDIKAN FORMAL
            </div>
            <table className="w-full text-xs font-sans border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 w-44 font-semibold text-slate-700">Jenjang Pendidikan Terakhir</td>
                  <td className="py-1.5 w-4 text-center">:</td>
                  <td className="py-1.5 font-bold text-slate-900">{employee.educationLevel}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Jurusan / Program Studi</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 text-slate-900">{employee.major || '-'}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Perguruan Tinggi / Sekolah</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 text-slate-900">{employee.institution || '-'}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-700">Tahun Kelulusan</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 font-mono text-slate-900">{employee.graduationYear || '-'}</td>
                </tr>
                <tr>
                  <td className="py-1.5 font-semibold text-slate-700">Nomor Ijazah / STTB</td>
                  <td className="py-1.5 text-center">:</td>
                  <td className="py-1.5 font-mono font-medium text-slate-900">{employee.ijazahNumber || '-'}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* SECTION 4: LEGALITAS PROFESI (STR & SIP) */}
          <div className="mb-5">
            <div className="bg-slate-100 px-3 py-1 font-sans font-bold text-xs uppercase tracking-wide border-l-4 border-blue-600 text-slate-900 mb-2">
              IV. LEGALITAS PROFESI & SURAT IZIN PRAKTIK (STR / SIP)
            </div>
            {employee.staffCategory === 'Nakes' ? (
              <table className="w-full text-xs font-sans border-collapse">
                <tbody>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 w-44 font-semibold text-slate-700">Nomor Registrasi STR</td>
                    <td className="py-1.5 w-4 text-center">:</td>
                    <td className="py-1.5 font-mono font-bold text-slate-900">{employee.strNumber || '-'}</td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-semibold text-slate-700">Masa Berlaku STR</td>
                    <td className="py-1.5 text-center">:</td>
                    <td className="py-1.5 text-slate-900">
                      {employee.strIsLifetime ? (
                        <span className="font-semibold text-blue-800">Berlaku Seumur Hidup (Sesuai UU No. 17/2023)</span>
                      ) : (
                        `${formatDateIndonesian(employee.strExpiryDate)} (${strStatus.label})`
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-semibold text-slate-700">Nomor SIP (Surat Izin Praktik)</td>
                    <td className="py-1.5 text-center">:</td>
                    <td className="py-1.5 font-mono font-bold text-slate-900">{employee.sipNumber || '-'}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold text-slate-700">Masa Berlaku SIP</td>
                    <td className="py-1.5 text-center">:</td>
                    <td className="py-1.5 text-slate-900">
                      {employee.sipExpiryDate ? (
                        `${formatDateIndonesian(employee.sipExpiryDate)} (${sipStatus.label})`
                      ) : (
                        '-'
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <p className="text-xs font-sans italic text-slate-500 py-1">
                Kategori Non-Tenaga Medis (Administrasi / Penunjang) tidak diwajibkan memiliki STR / SIP Tenaga Kesehatan.
              </p>
            )}
          </div>

          {/* SECTION 5: CATATAN TAMBAHAN (JIKA ADA) */}
          {employee.notes && (
            <div className="mb-6">
              <div className="bg-slate-100 px-3 py-1 font-sans font-bold text-xs uppercase tracking-wide border-l-4 border-blue-600 text-slate-900 mb-2">
                V. KETERANGAN / CATATAN KEPEGAWAIAN
              </div>
              <p className="text-xs font-sans text-slate-700 italic px-2">
                "{employee.notes}"
              </p>
            </div>
          )}

          {/* SIGNATURE BLOCK / LEMBAR PENGESAHAN */}
          <div className="mt-8 pt-4 border-t border-slate-300 font-sans text-xs flex flex-row justify-between items-start break-inside-avoid">
            {/* Pegawai */}
            <div className="w-56 text-center">
              <p className="text-slate-700">Yang Membuat Pernyataan,</p>
              <p className="text-slate-600 text-[11px] mb-16">Pegawai Bersangkutan</p>
              
              <div className="border-b border-slate-800 font-bold text-slate-900 pb-0.5">
                {employee.fullName}
              </div>
              <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                {employee.nipType}: {employee.nip}
              </p>
            </div>

            {/* Kepala Puskesmas */}
            <div className="w-64 text-center">
              <p className="text-slate-700">Kringa, {todayIndo}</p>
              <p className="text-slate-700 font-semibold mb-0.5">Mengetahui,</p>
              <p className="text-slate-900 font-bold text-xs mb-16">{puskesmasInfo.headOfPuskesmas.position}</p>

              <div className="border-b border-slate-800 font-bold text-slate-900 pb-0.5">
                {puskesmasInfo.headOfPuskesmas.name}
              </div>
              <p className="text-[11px] text-slate-800 mt-0.5">
                {puskesmasInfo.headOfPuskesmas.rankGrade || 'Pembina TK.1 /III d'}
              </p>
              <p className="text-[11px] text-slate-600 font-mono mt-0.5">
                NIP. {puskesmasInfo.headOfPuskesmas.nip}
              </p>
            </div>
          </div>

          {/* Official Footer Stamp note */}
          <div className="mt-8 text-center text-[10px] font-sans text-slate-400 border-t border-dotted border-slate-300 pt-2">
            Dokumen Biodata Resmi SIMPEG &bull; UPT Puskesmas Boganatar Kabupaten Sikka &bull; Dicetak secara digital pada {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })} WITA
          </div>
        </div>
      </div>
    </div>
  );
};
