import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Save, 
  User, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  Upload, 
  Trash2, 
  Image as ImageIcon, 
  Check,
  AlertCircle,
  Sparkles,
  Plus,
  Eye,
  FileCheck
} from 'lucide-react';
import { 
  Employee, 
  EmploymentStatus, 
  StaffCategory, 
  PositionType, 
  EducationLevel, 
  Gender, 
  Religion, 
  MaritalStatus,
  NipType,
  DigitalDocument
} from '../types/employee';
import { 
  WORK_UNITS, 
  EMPLOYMENT_STATUSES, 
  RANK_GRADES, 
  JOB_TITLES_SUGGESTIONS 
} from '../data/initialData';
import { DocumentViewerModal } from './DocumentViewerModal';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employeeData: Employee) => void;
  employeeToEdit?: Employee | null;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  employeeToEdit
}) => {
  const isEdit = Boolean(employeeToEdit);
  const [activeTab, setActiveTab] = useState<'personal' | 'employment' | 'education' | 'documents'>('personal');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [viewingDocument, setViewingDocument] = useState<DigitalDocument | null>(null);

  // New Document Upload State
  const [customDocType, setCustomDocType] = useState<DigitalDocument['type']>('SK');
  const [customDocTitle, setCustomDocTitle] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Employee>>({
    nipType: 'NIP',
    nip: '',
    nik: '',
    fullName: '',
    birthPlace: 'Maumere',
    birthDate: '1990-01-01',
    gender: 'P',
    religion: 'Katolik',
    maritalStatus: 'Menikah',
    address: 'Dusun Boganatar RT 01 / RW 01',
    village: 'Desa Boganatar, Kec. Talibura',
    phone: '',
    email: '',
    photoUrl: 'https://images.unsplash.com/photo-1594824813589-98013233c7f3?w=400&auto=format&fit=crop&q=80',
    employmentStatus: 'PNS',
    rankGrade: 'Penata Muda (III/a)',
    appointmentTMT: '2023-01-01',
    firstAppointmentTMT: '2020-01-01',
    jobTitle: 'Perawat Pertama',
    staffCategory: 'Nakes',
    department: 'UGD & Rawat Inap',
    positionType: 'Fungsional Tertentu',
    educationLevel: 'S-1 + Profesi',
    major: 'Ilmu Keperawatan & Ners',
    institution: 'Poltekkes Kemenkes Kupang',
    graduationYear: 2018,
    ijazahNumber: '',
    strNumber: '',
    strExpiryDate: '',
    strIsLifetime: true,
    sipNumber: '',
    sipExpiryDate: '',
    documents: [],
    notes: ''
  });

  // Load employee data on edit
  useEffect(() => {
    if (employeeToEdit) {
      setFormData({ ...employeeToEdit });
    } else {
      setFormData({
        id: `peg-${Date.now()}`,
        nipType: 'NIP',
        nip: '',
        nik: '',
        fullName: '',
        birthPlace: 'Maumere',
        birthDate: '1992-05-15',
        gender: 'P',
        religion: 'Katolik',
        maritalStatus: 'Menikah',
        address: 'Desa Boganatar RT 02 / RW 01',
        village: 'Desa Boganatar, Kec. Talibura',
        phone: '081234567890',
        email: '',
        photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
        employmentStatus: 'PNS',
        rankGrade: 'Penata Muda (III/a)',
        appointmentTMT: new Date().toISOString().split('T')[0],
        firstAppointmentTMT: new Date().toISOString().split('T')[0],
        jobTitle: 'Perawat Pelaksana',
        staffCategory: 'Nakes',
        department: 'UGD & Rawat Inap',
        positionType: 'Fungsional Tertentu',
        educationLevel: 'D-III',
        major: 'D-III Keperawatan',
        institution: 'Poltekkes Kemenkes Kupang',
        graduationYear: 2016,
        ijazahNumber: '',
        strNumber: '',
        strExpiryDate: '',
        strIsLifetime: true,
        sipNumber: '',
        sipExpiryDate: '',
        documents: [],
        notes: ''
      });
    }
    setErrors({});
    setActiveTab('personal');
  }, [employeeToEdit, isOpen]);

  if (!isOpen) return null;

  // Handle Input Changes
  const handleChange = (field: keyof Employee, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  // Photo Upload Handler (Local file reader to Base64)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran foto maksimal 2MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleChange('photoUrl', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Sample Avatar Selection
  const sampleAvatars = [
    { label: 'Dokter Wanita', url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80' },
    { label: 'Dokter Pria', url: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80' },
    { label: 'Bidan / Nakes P', url: 'https://images.unsplash.com/photo-1594824813589-98013233c7f3?w=400&auto=format&fit=crop&q=80' },
    { label: 'Tenaga Pria', url: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&auto=format&fit=crop&q=80' },
    { label: 'Staf Wanita', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80' },
    { label: 'Staf Pria', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  ];

  // Document Upload Mock & Real PDF Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUploadError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('Ukuran file maksimal 10MB.');
      return;
    }

    const sizeInKb = file.size / 1024;
    const formattedSize = sizeInKb > 1024 
      ? `${(sizeInKb / 1024).toFixed(1)} MB` 
      : `${Math.round(sizeInKb)} KB`;

    const title = customDocTitle.trim() || file.name.replace(/\.[^/.]+$/, "").replace(/_/g, ' ');

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const dataUrl = typeof uploadEvent.target?.result === 'string' ? uploadEvent.target.result : undefined;
      const newDoc: DigitalDocument = {
        id: `doc-${Date.now()}`,
        type: customDocType,
        title: title,
        fileName: file.name,
        fileSize: formattedSize,
        uploadDate: new Date().toISOString().split('T')[0],
        fileData: dataUrl
      };

      setFormData(prev => ({
        ...prev,
        documents: [...(prev.documents || []), newDoc]
      }));

      // Reset form
      setCustomDocTitle('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    };
    reader.readAsDataURL(file);
  };

  const handleAddMockDocument = (type: 'SK' | 'STR' | 'SIP' | 'Ijazah' | 'KTP') => {
    const docTitles: Record<string, string> = {
      SK: `SK Terakhir (${formData.employmentStatus || 'Pegawai'})`,
      STR: `STR Tenaga Kesehatan Resmi`,
      SIP: `Surat Izin Praktik Puskesmas Boganatar`,
      Ijazah: `Ijazah ${formData.educationLevel || 'Pendidikan'}`,
      KTP: `KTP & Kartu Identitas Pegawai`
    };

    const newDoc: DigitalDocument = {
      id: `doc-${Date.now()}`,
      type,
      title: docTitles[type] || `Dokumen ${type}`,
      fileName: `${type}_${formData.fullName?.split(' ')[0] || 'Pegawai'}.pdf`,
      fileSize: '1.2 MB',
      uploadDate: new Date().toISOString().split('T')[0]
    };

    setFormData(prev => ({
      ...prev,
      documents: [...(prev.documents || []), newDoc]
    }));
  };

  const handleRemoveDocument = (docId: string) => {
    setFormData(prev => ({
      ...prev,
      documents: (prev.documents || []).filter(d => d.id !== docId)
    }));
  };

  // Validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName || formData.fullName.trim().length < 3) {
      newErrors.fullName = 'Nama lengkap wajib diisi (minimal 3 karakter)';
    }

    if (!formData.nip || formData.nip.trim().length < 3) {
      newErrors.nip = 'Nomor NIP/NRPTT/NIK wajib diisi';
    }

    if (!formData.birthPlace) {
      newErrors.birthPlace = 'Tempat lahir wajib diisi';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'Tanggal lahir wajib diisi';
    }

    if (!formData.jobTitle) {
      newErrors.jobTitle = 'Nama jabatan wajib diisi';
    }

    if (formData.staffCategory === 'Nakes') {
      if (!formData.strNumber && !formData.strIsLifetime) {
        // Warning if non-lifetime STR has no date
      }
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      // Switch tab to first error
      if (newErrors.fullName || newErrors.nip || newErrors.birthPlace || newErrors.birthDate) {
        setActiveTab('personal');
      } else if (newErrors.jobTitle) {
        setActiveTab('employment');
      }
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const finalEmployee: Employee = {
      id: formData.id || `peg-${Date.now()}`,
      nip: formData.nip || '-',
      nipType: formData.nipType || 'NIP',
      nik: formData.nik || '-',
      fullName: formData.fullName || '',
      birthPlace: formData.birthPlace || 'Maumere',
      birthDate: formData.birthDate || '1990-01-01',
      gender: formData.gender || 'P',
      religion: formData.religion || 'Katolik',
      maritalStatus: formData.maritalStatus || 'Menikah',
      address: formData.address || '',
      village: formData.village || 'Desa Boganatar, Kec. Talibura',
      phone: formData.phone || '',
      email: formData.email || '',
      photoUrl: formData.photoUrl || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
      employmentStatus: formData.employmentStatus || 'PNS',
      rankGrade: formData.rankGrade || 'Penata Muda (III/a)',
      appointmentTMT: formData.appointmentTMT || new Date().toISOString().split('T')[0],
      firstAppointmentTMT: formData.firstAppointmentTMT || new Date().toISOString().split('T')[0],
      jobTitle: formData.jobTitle || 'Staf Pegawai',
      staffCategory: formData.staffCategory || 'Nakes',
      department: formData.department || 'Poli Umum',
      positionType: formData.positionType || 'Fungsional Tertentu',
      educationLevel: formData.educationLevel || 'D-III',
      major: formData.major || '',
      institution: formData.institution || '',
      graduationYear: Number(formData.graduationYear) || 2018,
      ijazahNumber: formData.ijazahNumber || '',
      strNumber: formData.strNumber || '',
      strExpiryDate: formData.strExpiryDate || '',
      strIsLifetime: Boolean(formData.strIsLifetime),
      sipNumber: formData.sipNumber || '',
      sipExpiryDate: formData.sipExpiryDate || '',
      documents: formData.documents || [],
      notes: formData.notes || '',
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    onSave(finalEmployee);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden">
      <div 
        id="modal-employee-form"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-white">
              {isEdit ? 'Edit Data Kepegawaian' : 'Input Data Pegawai Baru'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              UPT Puskesmas Boganatar &bull; Formulir Administrasi Kepegawaian Lengkap
            </p>
          </div>
          <button
            id="btn-close-form-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 flex flex-wrap gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg border-t-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'personal'
                ? 'bg-white text-blue-600 border-blue-600 shadow-2xs'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>1. Data Pribadi</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('employment')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg border-t-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'employment'
                ? 'bg-white text-blue-600 border-blue-600 shadow-2xs'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>2. Kepegawaian & Jabatan</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('education')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg border-t-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'education'
                ? 'bg-white text-blue-600 border-blue-600 shadow-2xs'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span>3. Pendidikan, STR & SIP</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg border-t-2 transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-white text-blue-600 border-blue-600 shadow-2xs'
                : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>4. Berkas Digital ({formData.documents?.length || 0})</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* TAB 1: DATA PRIBADI */}
          {activeTab === 'personal' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              {/* Photo and Identity Banner */}
              <div className="flex flex-col sm:flex-row gap-5 p-4 bg-slate-50 rounded-xl border border-slate-200 items-start">
                <div className="flex flex-col items-center gap-2 flex-shrink-0">
                  <div className="w-24 h-32 rounded-lg border-2 border-blue-600 overflow-hidden shadow-2xs bg-slate-200 relative group">
                    <img
                      src={formData.photoUrl}
                      alt="Pas Foto 3x4"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.fullName || 'Pegawai')}&background=2563eb&color=fff`;
                      }}
                    />
                    <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity text-[10px]">
                      <Upload className="w-4 h-4 mb-1" />
                      <span>Ubah Foto</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                  <span className="text-[10px] text-slate-700 font-medium">Pas Foto 3x4 Resmi</span>
                </div>

                <div className="flex-1 space-y-2">
                  <div className="text-xs font-semibold text-slate-700">Pilih Pas Foto Cepat atau Unggah:</div>
                  <div className="flex flex-wrap gap-2">
                    {sampleAvatars.map((av, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => handleChange('photoUrl', av.url)}
                        className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] transition-all cursor-pointer ${
                          formData.photoUrl === av.url 
                            ? 'bg-blue-50 border-blue-500 text-blue-700 font-semibold' 
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <img src={av.url} className="w-4 h-4 rounded-full object-cover" alt="" />
                        <span>{av.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="pt-2">
                    <label className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-100 cursor-pointer text-xs font-medium transition-colors">
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>Unggah Foto dari Komputer (JPG/PNG)</span>
                      <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              {/* Identity Fields Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap (Termasuk Gelar Depan & Belakang) <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="input-fullName"
                    type="text"
                    placeholder="Contoh: dr. Fransiska Saveria Nona, M.Kes / Ns. Yohanes, S.Kep"
                    value={formData.fullName || ''}
                    onChange={(e) => handleChange('fullName', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.fullName ? 'border-red-500 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.fullName && <p className="text-red-500 text-[11px] mt-1">{errors.fullName}</p>}
                </div>

                {/* NIP / Identity Type & Number */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Jenis Nomor Pegawai & Nomor Induk <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={formData.nipType || 'NIP'}
                      onChange={(e) => handleChange('nipType', e.target.value as NipType)}
                      className="w-36 px-2.5 py-2 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="NIP">NIP (PNS)</option>
                      <option value="NIP PPPK">NIP PPPK</option>
                      <option value="NIP PPPK PW">NIP PPPK PW</option>
                      <option value="NRPTT">NRPTT</option>
                      <option value="NIK">NIK / KTP</option>
                      <option value="THL">ID THL</option>
                      <option value="Honorer Daerah">Honorer Daerah</option>
                    </select>
                    <input
                      id="input-nip"
                      type="text"
                      placeholder="Contoh: 19870815 201101 1 003"
                      value={formData.nip || ''}
                      onChange={(e) => handleChange('nip', e.target.value)}
                      className={`flex-1 px-3 py-2 bg-white border rounded-lg font-mono focus:outline-none focus:ring-2 ${
                        errors.nip ? 'border-red-500 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-500'
                      }`}
                    />
                  </div>
                  {errors.nip && <p className="text-red-500 text-[11px] mt-1">{errors.nip}</p>}
                </div>

                {/* NIK (KTP 16 digit) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Induk Kependudukan (NIK - 16 Digit)
                  </label>
                  <input
                    type="text"
                    maxLength={16}
                    placeholder="Contoh: 5307041508870002"
                    value={formData.nik || ''}
                    onChange={(e) => handleChange('nik', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Tempat & Tanggal Lahir */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tempat Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Maumere, Watubaing, Larantuka"
                    value={formData.birthPlace || ''}
                    onChange={(e) => handleChange('birthPlace', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Tanggal Lahir <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.birthDate || ''}
                    onChange={(e) => handleChange('birthDate', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Jenis Kelamin & Agama */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === 'L'}
                        onChange={() => handleChange('gender', 'L')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-800">Laki-laki (L)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="gender"
                        checked={formData.gender === 'P'}
                        onChange={() => handleChange('gender', 'P')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-slate-800">Perempuan (P)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Agama</label>
                  <select
                    value={formData.religion || 'Katolik'}
                    onChange={(e) => handleChange('religion', e.target.value as Religion)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    <option value="Katolik">Katolik</option>
                    <option value="Kristen Protestan">Kristen Protestan</option>
                    <option value="Islam">Islam</option>
                    <option value="Hindu">Hindu</option>
                    <option value="Buddha">Buddha</option>
                    <option value="Konghucu">Konghucu</option>
                  </select>
                </div>

                {/* Status Pernikahan */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status Perkawinan</label>
                  <select
                    value={formData.maritalStatus || 'Menikah'}
                    onChange={(e) => handleChange('maritalStatus', e.target.value as MaritalStatus)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    <option value="Belum Menikah">Belum Menikah</option>
                    <option value="Menikah">Menikah</option>
                    <option value="Cerai Hidup">Cerai Hidup</option>
                    <option value="Cerai Mati">Cerai Mati</option>
                  </select>
                </div>

                {/* Phone / WA */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Telepon / WhatsApp</label>
                  <input
                    type="text"
                    placeholder="Contoh: 081234567890"
                    value={formData.phone || ''}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Resmi / Pribadi</label>
                  <input
                    type="email"
                    placeholder="nama.pegawai@gmail.com"
                    value={formData.email || ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>

                {/* Alamat Lengkap */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Alamat Domisili Lengkap</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jl. Trans Flores RT 002 / RW 001, Desa Boganatar, Kec. Talibura, Kab. Sikka"
                    value={formData.address || ''}
                    onChange={(e) => handleChange('address', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: KEPEGAWAIAN & JABATAN */}
          {activeTab === 'employment' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Status Kepegawaian */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Kepegawaian <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.employmentStatus || 'PNS'}
                    onChange={(e) => handleChange('employmentStatus', e.target.value as EmploymentStatus)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-slate-800"
                  >
                    {EMPLOYMENT_STATUSES.map(st => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                {/* Pangkat / Golongan Ruang */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pangkat / Golongan Ruang</label>
                  <select
                    value={formData.rankGrade || 'Penata Muda (III/a)'}
                    onChange={(e) => handleChange('rankGrade', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    {formData.rankGrade && !RANK_GRADES.includes(formData.rankGrade) && (
                      <option value={formData.rankGrade}>{formData.rankGrade}</option>
                    )}
                    {RANK_GRADES.map(rk => (
                      <option key={rk} value={rk}>{rk}</option>
                    ))}
                  </select>
                </div>

                {/* TMT SK Terakhir */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    TMT SK Pengangkatan / Jabatan Terakhir
                  </label>
                  <input
                    type="date"
                    value={formData.appointmentTMT || ''}
                    onChange={(e) => handleChange('appointmentTMT', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>

                {/* TMT Awal Bekerja / CPNS */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    TMT Awal Bekerja / CPNS (Hitung Masa Kerja)
                  </label>
                  <input
                    type="date"
                    value={formData.firstAppointmentTMT || ''}
                    onChange={(e) => handleChange('firstAppointmentTMT', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  />
                </div>

                {/* Kategori Tenaga (Nakes vs Non-Nakes) */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Kategori Personel <span className="text-red-500">*</span>
                  </label>
                  <div className="flex gap-4 pt-1">
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-blue-700">
                      <input
                        type="radio"
                        name="staffCategory"
                        checked={formData.staffCategory === 'Nakes'}
                        onChange={() => handleChange('staffCategory', 'Nakes')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Tenaga Kesehatan (Nakes)</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700">
                      <input
                        type="radio"
                        name="staffCategory"
                        checked={formData.staffCategory === 'Non-Nakes'}
                        onChange={() => handleChange('staffCategory', 'Non-Nakes')}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>Non-Tenaga Medis</span>
                    </label>
                  </div>
                </div>

                {/* Jenis Jabatan */}
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Jabatan</label>
                  <select
                    value={formData.positionType || 'Fungsional Tertentu'}
                    onChange={(e) => handleChange('positionType', e.target.value as PositionType)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    <option value="Fungsional Tertentu">Fungsional Tertentu (JF Medis/Kesehatan)</option>
                    <option value="Fungsional Umum">Fungsional Umum (Pelaksana Administrasi)</option>
                    <option value="Struktural / Manajemen">Struktural / Manajemen Puskesmas</option>
                  </select>
                </div>

                {/* Nama Jabatan & Saran */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Jabatan Utama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Dokter Umum Ahli Pertama / Bidan Koordinator / Sanitarian"
                    value={formData.jobTitle || ''}
                    onChange={(e) => handleChange('jobTitle', e.target.value)}
                    className={`w-full px-3 py-2 bg-white border rounded-lg focus:outline-none focus:ring-2 text-slate-800 ${
                      errors.jobTitle ? 'border-red-500 focus:ring-red-300' : 'border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                  {errors.jobTitle && <p className="text-red-500 text-[11px] mt-1">{errors.jobTitle}</p>}

                  {/* Quick Suggestions */}
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-500">Pilih Cepat:</span>
                    {JOB_TITLES_SUGGESTIONS.slice(0, 7).map(title => (
                      <button
                        key={title}
                        type="button"
                        onClick={() => handleChange('jobTitle', title)}
                        className="px-2 py-0.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded text-[11px] text-slate-600 transition-colors cursor-pointer"
                      >
                        {title}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ruangan Penempatan */}
                <div className="md:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Ruangan Penempatan <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.department || 'Poli Umum'}
                    onChange={(e) => handleChange('department', e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                  >
                    {WORK_UNITS.map(u => (
                      <option key={u} value={u}>{u}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PENDIDIKAN & STR / SIP */}
          {activeTab === 'education' && (
            <div className="space-y-5 animate-in fade-in duration-100">
              {/* Pendidikan Formal */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-blue-600" />
                  <span>Riwayat Pendidikan Formal Terakhir</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jenjang Pendidikan Terakhir</label>
                    <select
                      value={formData.educationLevel || 'D-III'}
                      onChange={(e) => handleChange('educationLevel', e.target.value as EducationLevel)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    >
                      <option value="SMA / SMK">SMA / SMK</option>
                      <option value="D-III">D-III</option>
                      <option value="D-IV">D-IV</option>
                      <option value="S-1">S-1</option>
                      <option value="S-1 + Profesi">S-1 + Profesi (Dokter / Ners / Apoteker / Bidan)</option>
                      <option value="S-2">S-2 (Magister)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Jurusan / Program Studi</label>
                    <input
                      type="text"
                      placeholder="Contoh: D-III Keperawatan, Pendidikan Dokter, S-1 Kesmas"
                      value={formData.major || ''}
                      onChange={(e) => handleChange('major', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Nama Universitas / Institusi Pendidikan</label>
                    <input
                      type="text"
                      placeholder="Contoh: Poltekkes Kemenkes Kupang / Universitas Udayana"
                      value={formData.institution || ''}
                      onChange={(e) => handleChange('institution', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tahun Kelulusan</label>
                    <input
                      type="number"
                      min={1970}
                      max={2030}
                      placeholder="2018"
                      value={formData.graduationYear || 2018}
                      onChange={(e) => handleChange('graduationYear', Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-semibold text-slate-700 mb-1">Nomor Ijazah</label>
                    <input
                      type="text"
                      placeholder="Contoh: 14201/UNUD/2018 atau No. DN-08/D3/004521"
                      value={formData.ijazahNumber || ''}
                      onChange={(e) => handleChange('ijazahNumber', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-slate-800"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      Nomor Ijazah sesuai lembar ijazah asli atau Surat Tanda Tamat Belajar (STTB).
                    </p>
                  </div>
                </div>
              </div>

              {/* STR & SIP (Khusus Tenaga Kesehatan) */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Legalitas Profesi Tenaga Kesehatan (STR & SIP)</span>
                  </h3>
                  <span className="text-[11px] text-blue-600 font-medium">
                    Sesuai UU Kesehatan No. 17 Tahun 2023
                  </span>
                </div>

                {formData.staffCategory !== 'Nakes' && (
                  <div className="p-3 bg-slate-100 rounded-lg text-slate-600 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-slate-400" />
                    <span>Pegawai ini berstatus <strong>Non-Nakes</strong>. Field STR & SIP bersifat opsional / tidak wajib.</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* STR Section */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                    <label className="block font-bold text-slate-800">
                      Surat Tanda Registrasi (STR)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 14.01.5.2.1.20.188492"
                      value={formData.strNumber || ''}
                      onChange={(e) => handleChange('strNumber', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />

                    <div className="pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-blue-700">
                        <input
                          type="checkbox"
                          checked={formData.strIsLifetime || false}
                          onChange={(e) => handleChange('strIsLifetime', e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                        />
                        <span>Berlaku Seumur Hidup (UU Baru)</span>
                      </label>
                    </div>

                    {!formData.strIsLifetime && (
                      <div className="pt-1">
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                          Tanggal Habis Berlaku STR
                        </label>
                        <input
                          type="date"
                          value={formData.strExpiryDate || ''}
                          onChange={(e) => handleChange('strExpiryDate', e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                        />
                      </div>
                    )}
                  </div>

                  {/* SIP Section */}
                  <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-2">
                    <label className="block font-bold text-slate-800">
                      Surat Izin Praktik (SIP Dinas Kesehatan/DPMPTSP)
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: 503/112/SIPP/DPMPTSP/2023"
                      value={formData.sipNumber || ''}
                      onChange={(e) => handleChange('sipNumber', e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                    />

                    <div className="pt-1">
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Tanggal Habis Berlaku SIP (Wajib Diperpanjang Berkala)
                      </label>
                      <input
                        type="date"
                        value={formData.sipExpiryDate || ''}
                        onChange={(e) => handleChange('sipExpiryDate', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: BERKAS DIGITAL & CATATAN */}
          {activeTab === 'documents' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    <span>Upload Berkas & Dokumen Digital Pegawai (.PDF)</span>
                  </h3>
                  <span className="text-[11px] text-slate-500">Arsip SIMPEG Puskesmas Boganatar</span>
                </div>

                {uploadError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}

                {/* Upload Form Box */}
                <div className="p-3.5 bg-white rounded-xl border border-slate-200 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Kategori Dokumen
                      </label>
                      <select
                        value={customDocType}
                        onChange={(e) => setCustomDocType(e.target.value as DigitalDocument['type'])}
                        className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="SK">SK (Surat Keputusan)</option>
                        <option value="STR">STR (Surat Tanda Registrasi)</option>
                        <option value="SIP">SIP (Surat Izin Praktik)</option>
                        <option value="Ijazah">Ijazah & Transkrip</option>
                        <option value="KTP">KTP / Kartu Keluarga</option>
                        <option value="Lainnya">Sertifikat / Lainnya</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        Judul / Keterangan Berkas
                      </label>
                      <input
                        type="text"
                        value={customDocTitle}
                        onChange={(e) => setCustomDocTitle(e.target.value)}
                        placeholder="Contoh: SK Kenaikan Pangkat Penata III/c, STR Seumur Hidup..."
                        className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* PDF File Picker input */}
                  <div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,application/pdf,image/png,image/jpeg"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="input-file-employee-doc"
                    />
                    <label
                      htmlFor="input-file-employee-doc"
                      className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-blue-300 hover:border-blue-500 bg-blue-50/50 hover:bg-blue-50 rounded-xl cursor-pointer transition-colors text-center"
                    >
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span className="text-xs font-bold text-blue-800">
                        Klik untuk Pilih & Upload File PDF dari Komputer / HP
                      </span>
                      <span className="text-[10px] text-blue-600 font-mono hidden sm:inline">
                        (Maks. 10MB)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Quick Add Document Buttons */}
                <div className="space-y-1">
                  <span className="text-[11px] font-semibold text-slate-500 block">Template Berkas Cepat:</span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleAddMockDocument('SK')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-blue-600" />
                      <span>+ SK Terakhir</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddMockDocument('STR')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-blue-600" />
                      <span>+ File STR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddMockDocument('SIP')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-teal-600" />
                      <span>+ File SIP</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddMockDocument('Ijazah')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-purple-600" />
                      <span>+ Ijazah & Transkrip</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddMockDocument('KTP')}
                      className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-slate-300 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-xs font-medium text-slate-700 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Plus className="w-3 h-3 text-amber-600" />
                      <span>+ KTP / KK</span>
                    </button>
                  </div>
                </div>

                {/* Uploaded Documents List */}
                <div className="mt-3 space-y-2">
                  <span className="text-xs font-bold text-slate-700 block">
                    Daftar Dokumen Terlampir ({formData.documents?.length || 0}):
                  </span>
                  {(!formData.documents || formData.documents.length === 0) ? (
                    <div className="p-4 text-center border border-dashed border-slate-300 rounded-xl text-slate-400 text-xs">
                      Belum ada dokumen digital yang dilampirkan. Pilih file PDF di atas untuk menambah lampiran berkas.
                    </div>
                  ) : (
                    formData.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs hover:border-blue-300 transition-colors gap-2"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                            {doc.type}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate">{doc.title}</p>
                            <p className="text-[10px] text-slate-500 font-mono truncate">
                              {doc.fileName} &bull; {doc.fileSize} &bull; Diunggah: {doc.uploadDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            type="button"
                            onClick={() => setViewingDocument(doc)}
                            className="px-2 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                            title="Lihat Berkas PDF"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Lihat</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveDocument(doc.id)}
                            className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus Berkas"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Catatan Khusus */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1 text-xs">
                  Catatan Tambahan / Keterangan Khusus Kepegawaian
                </label>
                <textarea
                  rows={3}
                  placeholder="Contoh: Sertifikasi BTCLS aktif, penugasan khusus stunting, tugas belajar, atau catatan mutasi..."
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-slate-800 text-xs"
                />
              </div>
            </div>
          )}

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
            <div className="text-[11px] text-slate-600">
              {activeTab === 'personal' && <span>Langkah 1 dari 4: Data Pribadi</span>}
              {activeTab === 'employment' && <span>Langkah 2 dari 4: Status Kepegawaian</span>}
              {activeTab === 'education' && <span>Langkah 3 dari 4: Pendidikan & Legalitas</span>}
              {activeTab === 'documents' && <span>Langkah 4 dari 4: Berkas Digital</span>}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                id="btn-cancel-form"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Batal
              </button>

              <button
                type="submit"
                id="btn-save-employee"
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-2xs transition-all transform active:scale-95 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Data Pegawai</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Viewer Modal for Documents inside Form */}
      {viewingDocument && (
        <DocumentViewerModal
          isOpen={Boolean(viewingDocument)}
          onClose={() => setViewingDocument(null)}
          document={viewingDocument}
          employee={formData as Employee}
        />
      )}
    </div>
  );
};
