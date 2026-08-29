/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Employee, 
  PuskesmasInfo,
  DigitalDocument
} from './types/employee';
import { 
  INITIAL_EMPLOYEES, 
  PUSKESMAS_BOGANATAR_INFO 
} from './data/initialData';
import { 
  PuskesmasProfileData, 
  VillageTerritory, 
  PosyanduInfo 
} from './types/profileTerritory';
import { INITIAL_PROFILE_TERRITORY_DATA } from './data/initialProfileTerritoryData';
import { 
  exportEmployeesToCSV, 
  exportBackupJSON, 
  getCredentialStatus 
} from './utils/helpers';

// Components
import { Header, MainViewType } from './components/Header';
import { DashboardSummary } from './components/DashboardSummary';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeFormModal } from './components/EmployeeFormModal';
import { EmployeeProfilePrint } from './components/EmployeeProfilePrint';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EmployeeDetailDrawer } from './components/EmployeeDetailDrawer';
import { STRSIPMonitoringModal } from './components/STRSIPMonitoringModal';
import { PrintRekapModal } from './components/PrintRekapModal';
import { GoogleSheetsModal } from './components/GoogleSheetsModal';
import { PCInstallGuideModal } from './components/PCInstallGuideModal';
import { UploadDocumentModal } from './components/UploadDocumentModal';
import { DocumentViewerModal } from './components/DocumentViewerModal';

// Territory & Profile Components
import { PuskesmasProfileView } from './components/PuskesmasProfileView';
import { VisionMissionView } from './components/VisionMissionView';
import { VillagesTerritoryView } from './components/VillagesTerritoryView';
import { PosyanduView } from './components/PosyanduView';
import { ProfileTerritoryView } from './components/ProfileTerritoryView';
import { EditProfileModal } from './components/EditProfileModal';
import { EditVillageModal } from './components/EditVillageModal';
import { EditPosyanduModal } from './components/EditPosyanduModal';
import { PrintProfileTerritoryModal } from './components/PrintProfileTerritoryModal';

// 12 SPM Components & Types
import { SPMIndicator } from './types/spm';
import { INITIAL_SPM_INDICATORS } from './data/initialSPMData';
import { SPMView } from './components/SPMView';
import { EditSPMModal } from './components/EditSPMModal';
import { PrintSPMModal } from './components/PrintSPMModal';

// Authentication
import { AuthUser, REGISTERED_CREDENTIALS, isUserAdmin } from './types/auth';
import { LoginModal } from './components/LoginModal';
import { LoginScreen } from './components/LoginScreen';

import {
  subscribeEmployees,
  saveEmployeeToDb,
  deleteEmployeeFromDb,
  saveEmployeesBatch,
  subscribeTerritory,
  saveTerritoryToDb,
  subscribeSPM,
  saveSPMIndicatorToDb,
  saveSPMBatch,
  seedInitialDatabaseIfEmpty,
  SyncStatus
} from './services/firestoreDb';

import { 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  LayoutDashboard, 
  UserPlus, 
  ShieldAlert, 
  Printer, 
  Download, 
  X,
  FileSpreadsheet,
  Monitor,
  Users,
  MapPin,
  Target,
  HeartHandshake,
  LogOut,
  Lock
} from 'lucide-react';

const STORAGE_KEY = 'simpeg_puskesmas_boganatar_v2';
const TERRITORY_STORAGE_KEY = 'simpeg_profile_territory_data_v2';
const SPM_STORAGE_KEY = 'simpeg_spm_12_indicators_v2';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved employees', e);
    }
    return INITIAL_EMPLOYEES;
  });

  // Profile & Territory State
  const [profileTerritoryData, setProfileTerritoryData] = useState<PuskesmasProfileData>(() => {
    try {
      const saved = localStorage.getItem(TERRITORY_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.villages) && parsed.villages.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading territory data', e);
    }
    return INITIAL_PROFILE_TERRITORY_DATA;
  });

  // 12 SPM Indicators State
  const [spmIndicators, setSpmIndicators] = useState<SPMIndicator[]>(() => {
    try {
      const saved = localStorage.getItem(SPM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading SPM indicators data', e);
    }
    return INITIAL_SPM_INDICATORS;
  });

  // Cloud Database Sync Status
  const [syncStatus, setSyncStatus] = useState<SyncStatus>('connected');
  const [isCloudSyncing, setIsCloudSyncing] = useState(false);

  // User Authentication State (Credentials: shyllpb@2026 / Boganatar@2026)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const savedLocal = localStorage.getItem('simpeg_auth_user');
      if (savedLocal) return JSON.parse(savedLocal);
      const savedSession = sessionStorage.getItem('simpeg_auth_user');
      if (savedSession) return JSON.parse(savedSession);
    } catch (e) {
      console.warn('Error reading stored auth user:', e);
    }
    // Default to null so guests/users can view all modules with locked Edit/Tambah menus
    return null;
  });
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Determine if current user has Admin privileges (can edit/delete)
  const isAdmin = isUserAdmin(currentUser);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    showToast(`Selamat datang, ${user.fullName}! Data terkunci & siap digunakan.`, 'success');
  };

  const handleLogout = () => {
    localStorage.removeItem('simpeg_auth_user');
    sessionStorage.removeItem('simpeg_auth_user');
    setCurrentUser(null);
    showToast('Anda telah logout. Seluruh data pegawai, 5 desa, dan SPM tetap terkunci & tersimpan aman.', 'info');
  };

  const puskesmasInfo = PUSKESMAS_BOGANATAR_INFO;

  // Real-time Cloud Database Integration (Firestore)
  useEffect(() => {
    // 1. Initial seed check if database is empty on first startup
    seedInitialDatabaseIfEmpty(INITIAL_EMPLOYEES, INITIAL_PROFILE_TERRITORY_DATA, INITIAL_SPM_INDICATORS);

    // 2. Subscribe to Employees real-time updates
    const unsubEmployees = subscribeEmployees(
      (cloudEmployees) => {
        if (cloudEmployees && cloudEmployees.length > 0) {
          setEmployees(cloudEmployees);
          setSyncStatus('connected');
        }
      },
      (err) => {
        console.warn('Firestore employee listener error:', err);
        setSyncStatus('offline');
      }
    );

    // 3. Subscribe to Territory & 5 Villages real-time updates
    const unsubTerritory = subscribeTerritory(
      (cloudTerritory) => {
        if (cloudTerritory && cloudTerritory.villages && cloudTerritory.villages.length > 0) {
          setProfileTerritoryData(cloudTerritory);
        }
      },
      (err) => {
        console.warn('Firestore territory listener error:', err);
      }
    );

    // 4. Subscribe to 12 SPM indicators real-time updates
    const unsubSPM = subscribeSPM(
      (cloudSPM) => {
        if (cloudSPM && cloudSPM.length > 0) {
          setSpmIndicators(cloudSPM);
        }
      },
      (err) => {
        console.warn('Firestore SPM listener error:', err);
      }
    );

    return () => {
      unsubEmployees();
      unsubTerritory();
      unsubSPM();
    };
  }, []);

  // Manual Force Cloud Synchronization handler
  const handleManualCloudSync = async () => {
    try {
      setIsCloudSyncing(true);
      await Promise.all([
        saveEmployeesBatch(employees),
        saveTerritoryToDb(profileTerritoryData),
        saveSPMBatch(spmIndicators)
      ]);
      setSyncStatus('connected');
      showToast('Seluruh data SIMPEG, 5 Desa & 12 SPM berhasil disinkronkan ke Cloud Database!', 'success');
    } catch (error) {
      console.error('Manual sync error:', error);
      showToast('Gagal melakukan sinkronisasi cloud.', 'error');
    } finally {
      setIsCloudSyncing(false);
    }
  };

  // Main Active View: 'employees' | 'profile' | 'vision-mission' | 'villages' | 'posyandu' | 'spm'
  const [currentMainView, setCurrentMainView] = useState<MainViewType>('employees');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [unitFilter, setUnitFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Sidebar mobile toggle
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Modals & Drawers States for Employees
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);

  const [isPrintProfileOpen, setIsPrintProfileOpen] = useState(false);
  const [employeeToPrint, setEmployeeToPrint] = useState<Employee | null>(null);

  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedDetailEmployee, setSelectedDetailEmployee] = useState<Employee | null>(null);

  // Document Upload & View States
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [employeeForDocUpload, setEmployeeForDocUpload] = useState<Employee | null>(null);
  const [isViewDocModalOpen, setIsViewDocModalOpen] = useState(false);
  const [documentToView, setDocumentToView] = useState<DigitalDocument | null>(null);
  const [employeeForDocView, setEmployeeForDocView] = useState<Employee | null>(null);

  const [isMonitoringOpen, setIsMonitoringOpen] = useState(false);
  const [isPrintRekapOpen, setIsPrintRekapOpen] = useState(false);
  const [isGoogleSheetsOpen, setIsGoogleSheetsOpen] = useState(false);
  const [isPCGuideOpen, setIsPCGuideOpen] = useState(false);
  const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

  // Territory & Profile Modals State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isEditVillageOpen, setIsEditVillageOpen] = useState(false);
  const [villageToEdit, setVillageToEdit] = useState<VillageTerritory | null>(null);
  
  const [isEditPosyanduOpen, setIsEditPosyanduOpen] = useState(false);
  const [posyanduToEdit, setPosyanduToEdit] = useState<PosyanduInfo | null>(null);
  const [selectedVillageIdForPosyandu, setSelectedVillageIdForPosyandu] = useState<string>('');

  const [isPrintProfileTerritoryOpen, setIsPrintProfileTerritoryOpen] = useState(false);

  // 12 SPM Modals State
  const [isEditSPMOpen, setIsEditSPMOpen] = useState(false);
  const [indicatorToEdit, setIndicatorToEdit] = useState<SPMIndicator | null>(null);
  const [isPrintSPMOpen, setIsPrintSPMOpen] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPromptEvent(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const triggerPCInstall = async () => {
    if (installPromptEvent) {
      installPromptEvent.prompt();
      const choice = await installPromptEvent.userChoice;
      if (choice.outcome === 'accepted') {
        showToast('Aplikasi PC berhasil dipasang ke desktop!', 'success');
      }
      setInstallPromptEvent(null);
      setIsPCGuideOpen(false);
    }
  };

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'info' | 'error' } | null>(null);

  // Save to LocalStorage whenever employees state changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(employees));
    } catch (e) {
      console.error('Failed to persist to localStorage', e);
    }
  }, [employees]);

  // Save territory data to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(TERRITORY_STORAGE_KEY, JSON.stringify(profileTerritoryData));
    } catch (e) {
      console.error('Failed to persist territory data', e);
    }
  }, [profileTerritoryData]);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Handlers for Employee CRUD
  const handleAddNew = () => {
    if (!isAdmin) {
      showToast('Akses dibatasi: Hanya Administrator yang berwenang menambah data pegawai baru.', 'info');
      setIsLoginModalOpen(true);
      return;
    }
    setEmployeeToEdit(null);
    setIsFormModalOpen(true);
    setIsMobileSidebarOpen(false);
  };

  const handleEdit = (employee: Employee) => {
    if (!isAdmin) {
      showToast('Akses dibatasi: Hanya Administrator yang berwenang mengubah data pegawai.', 'info');
      setIsLoginModalOpen(true);
      return;
    }
    setEmployeeToEdit(employee);
    setIsFormModalOpen(true);
    setIsDetailDrawerOpen(false);
    setIsMonitoringOpen(false);
  };

  const handleSaveEmployee = async (savedEmployee: Employee) => {
    if (!isAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang berwenang menyimpan data ke database.', 'error');
      setIsLoginModalOpen(true);
      return;
    }

    // 1. Update local state & immediate storage lock
    let updatedList: Employee[] = [];
    setEmployees(prev => {
      const exists = prev.some(e => e.id === savedEmployee.id);
      if (exists) {
        updatedList = prev.map(e => (e.id === savedEmployee.id ? savedEmployee : e));
      } else {
        updatedList = [savedEmployee, ...prev];
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {
        console.error('Storage lock write error:', e);
      }
      return updatedList;
    });

    setIsFormModalOpen(false);
    showToast(`Data "${savedEmployee.fullName}" terkunci & tersimpan aman!`, 'success');

    // 2. Persist to Cloud Database (Firestore)
    try {
      await saveEmployeeToDb(savedEmployee);
    } catch (err) {
      console.warn('Failed to sync employee to Cloud Database:', err);
    }
  };

  const handleDeleteRequest = (employee: Employee) => {
    if (!isAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang berwenang menghapus data pegawai.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    setEmployeeToDelete(employee);
    setIsDeleteModalOpen(true);
    setIsDetailDrawerOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!isAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang berwenang menghapus data.', 'error');
      setIsDeleteModalOpen(false);
      return;
    }
    if (employeeToDelete) {
      const toDelete = employeeToDelete;
      setEmployees(prev => prev.filter(e => e.id !== toDelete.id));
      showToast(`Data pegawai "${toDelete.fullName}" telah berhasil dihapus.`, 'info');
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);

      // Persist deletion to Cloud Database
      try {
        await deleteEmployeeFromDb(toDelete.id);
      } catch (err) {
        console.warn('Failed to delete employee from Cloud Database:', err);
      }
    }
  };

  const handleViewDetail = (employee: Employee) => {
    setSelectedDetailEmployee(employee);
    setIsDetailDrawerOpen(true);
  };

  const handlePrintEmployee = (employee: Employee) => {
    setEmployeeToPrint(employee);
    setIsPrintProfileOpen(true);
    setIsDetailDrawerOpen(false);
  };

  // Document Management Handlers
  const handleOpenUploadDocument = (emp: Employee) => {
    if (!isAdmin) {
      showToast('Akses dibatasi: Hanya Administrator yang berwenang mengunggah berkas digital pegawai.', 'info');
      setIsLoginModalOpen(true);
      return;
    }
    setEmployeeForDocUpload(emp);
    setIsUploadDocModalOpen(true);
  };

  const handleSaveUploadedDocument = async (employeeId: string, newDocument: DigitalDocument) => {
    if (!isAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang berwenang menyimpan berkas.', 'error');
      return;
    }

    let updatedTargetEmp: Employee | null = null;

    setEmployees(prev => {
      const updated = prev.map(emp => {
        if (emp.id === employeeId) {
          const docs = [...(emp.documents || []), newDocument];
          const newEmp = { ...emp, documents: docs, updatedAt: new Date().toISOString() };
          updatedTargetEmp = newEmp;
          return newEmp;
        }
        return emp;
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Storage lock write error on document upload:', e);
      }
      return updated;
    });

    if (selectedDetailEmployee && selectedDetailEmployee.id === employeeId && updatedTargetEmp) {
      setSelectedDetailEmployee(updatedTargetEmp);
    }

    setIsUploadDocModalOpen(false);
    setEmployeeForDocUpload(null);
    showToast(`Berkas "${newDocument.title}" berhasil diunggah dan disimpan ke arsip digital!`, 'success');

    if (updatedTargetEmp) {
      try {
        await saveEmployeeToDb(updatedTargetEmp);
      } catch (err) {
        console.warn('Failed to sync uploaded document to Cloud Database:', err);
      }
    }
  };

  const handleDeleteDocument = async (employeeId: string, docId: string) => {
    if (!isAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang berwenang menghapus berkas.', 'error');
      return;
    }

    let updatedTargetEmp: Employee | null = null;

    setEmployees(prev => {
      const updated = prev.map(emp => {
        if (emp.id === employeeId) {
          const docs = (emp.documents || []).filter(d => d.id !== docId);
          const newEmp = { ...emp, documents: docs, updatedAt: new Date().toISOString() };
          updatedTargetEmp = newEmp;
          return newEmp;
        }
        return emp;
      });

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Storage lock write error on document delete:', e);
      }
      return updated;
    });

    if (selectedDetailEmployee && selectedDetailEmployee.id === employeeId && updatedTargetEmp) {
      setSelectedDetailEmployee(updatedTargetEmp);
    }

    showToast('Berkas digital telah dihapus dari arsip pegawai.', 'info');

    if (updatedTargetEmp) {
      try {
        await saveEmployeeToDb(updatedTargetEmp);
      } catch (err) {
        console.warn('Failed to sync deleted document in Cloud Database:', err);
      }
    }
  };

  const handleViewDocument = (doc: DigitalDocument, emp: Employee) => {
    setDocumentToView(doc);
    setEmployeeForDocView(emp);
    setIsViewDocModalOpen(true);
  };

  // Profile & Territory CRUD Handlers
  const handleSaveProfile = async (updatedProfile: PuskesmasProfileData) => {
    if (!isAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang dapat mengubah profil Puskesmas.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    setProfileTerritoryData(updatedProfile);
    try {
      localStorage.setItem(TERRITORY_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Storage lock write error:', e);
    }
    setIsEditProfileOpen(false);
    showToast('Profil, Visi, Misi & Tata Nilai Puskesmas berhasil disimpan & terkunci!', 'success');

    try {
      await saveTerritoryToDb(updatedProfile);
    } catch (err) {
      console.warn('Failed to sync territory to cloud:', err);
    }
  };

  const handleSaveVillage = async (updatedVillage: VillageTerritory) => {
    if (!isAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang dapat mengubah data desa.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    const updatedData: PuskesmasProfileData = {
      ...profileTerritoryData,
      villages: profileTerritoryData.villages.map(v => v.id === updatedVillage.id ? updatedVillage : v)
    };
    setProfileTerritoryData(updatedData);
    try {
      localStorage.setItem(TERRITORY_STORAGE_KEY, JSON.stringify(updatedData));
    } catch (e) {
      console.error('Storage lock write error:', e);
    }
    setIsEditVillageOpen(false);
    showToast(`Data Desa ${updatedVillage.name} berhasil disimpan & terkunci!`, 'success');

    try {
      await saveTerritoryToDb(updatedData);
    } catch (err) {
      console.warn('Failed to sync village to cloud:', err);
    }
  };

  const handleOpenAddPosyandu = (villageId?: string) => {
    if (!isAdmin) {
      showToast('Akses dibatasi: Hanya Administrator yang dapat menambah Posyandu baru.', 'info');
      setIsLoginModalOpen(true);
      return;
    }
    setPosyanduToEdit(null);
    setSelectedVillageIdForPosyandu(villageId || profileTerritoryData.villages[0]?.id || '');
    setIsEditPosyanduOpen(true);
  };

  const handleOpenEditPosyandu = (villageId: string, posyandu: PosyanduInfo) => {
    if (!isAdmin) {
      showToast('Akses dibatasi: Hanya Administrator yang dapat mengedit data Posyandu.', 'info');
      setIsLoginModalOpen(true);
      return;
    }
    setPosyanduToEdit(posyandu);
    setSelectedVillageIdForPosyandu(villageId);
    setIsEditPosyanduOpen(true);
  };

  const handleSavePosyandu = async (targetVillageId: string, posyanduData: PosyanduInfo) => {
    if (!isAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang dapat menyimpan data Posyandu.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    // First remove posyandu from any previous village if editing across
    const cleanVillages = profileTerritoryData.villages.map(v => ({
      ...v,
      posyanduList: v.posyanduList.filter(p => p.id !== posyanduData.id)
    }));

    // Add into target village
    const updatedVillages = cleanVillages.map(v => {
      if (v.id === targetVillageId) {
        return {
          ...v,
          posyanduList: [...v.posyanduList, posyanduData]
        };
      }
      return v;
    });

    const updatedProfile: PuskesmasProfileData = {
      ...profileTerritoryData,
      villages: updatedVillages
    };

    setProfileTerritoryData(updatedProfile);
    try {
      localStorage.setItem(TERRITORY_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Storage lock write error:', e);
    }
    setIsEditPosyanduOpen(false);
    showToast(`Data Posyandu "${posyanduData.name}" berhasil disimpan & terkunci!`, 'success');

    try {
      await saveTerritoryToDb(updatedProfile);
    } catch (err) {
      console.warn('Failed to sync posyandu to cloud:', err);
    }
  };

  const handleDeletePosyandu = async (villageId: string, posyanduId: string) => {
    if (!isAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang dapat menghapus Posyandu.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    const updatedProfile: PuskesmasProfileData = {
      ...profileTerritoryData,
      villages: profileTerritoryData.villages.map(v => {
        if (v.id === villageId) {
          return {
            ...v,
            posyanduList: v.posyanduList.filter(p => p.id !== posyanduId)
          };
        }
        return v;
      })
    };
    setProfileTerritoryData(updatedProfile);
    try {
      localStorage.setItem(TERRITORY_STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch (e) {
      console.error('Storage lock write error:', e);
    }
    showToast('Posyandu berhasil dihapus.', 'info');

    try {
      await saveTerritoryToDb(updatedProfile);
    } catch (err) {
      console.warn('Failed to sync delete posyandu to cloud:', err);
    }
  };

  const handleResetProfileTerritoryData = async () => {
    if (!isAdmin) {
      showToast('Akses ditolak: Reset data wilayah hanya dapat dilakukan oleh Administrator.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    setProfileTerritoryData(INITIAL_PROFILE_TERRITORY_DATA);
    try {
      localStorage.setItem(TERRITORY_STORAGE_KEY, JSON.stringify(INITIAL_PROFILE_TERRITORY_DATA));
    } catch (e) {
      console.error('Storage lock write error:', e);
    }
    showToast('Data Profil & 5 Desa dikembalikan ke setelan awal.', 'info');

    try {
      await saveTerritoryToDb(INITIAL_PROFILE_TERRITORY_DATA);
    } catch (err) {
      console.warn('Failed to reset territory in cloud:', err);
    }
  };

  // 12 SPM Handlers
  useEffect(() => {
    try {
      localStorage.setItem(SPM_STORAGE_KEY, JSON.stringify(spmIndicators));
    } catch (e) {
      console.error('Error saving SPM indicators to localStorage', e);
    }
  }, [spmIndicators]);

  const handleSaveSPMIndicator = async (updated: SPMIndicator) => {
    if (!isAdmin) {
      showToast('Akses ditolak: Hanya Administrator yang dapat memperbarui capaian SPM.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    let updatedList: SPMIndicator[] = [];
    setSpmIndicators((prev) => {
      updatedList = prev.map((item) => (item.id === updated.id ? updated : item));
      try {
        localStorage.setItem(SPM_STORAGE_KEY, JSON.stringify(updatedList));
      } catch (e) {
        console.error('Storage lock write error:', e);
      }
      return updatedList;
    });
    showToast(`Data SPM Indikator #${updated.number} (${updated.shortTitle}) berhasil disimpan & terkunci!`, 'success');

    try {
      await saveSPMIndicatorToDb(updated);
    } catch (err) {
      console.warn('Failed to sync SPM indicator to cloud:', err);
    }
  };

  const handleOpenEditSPM = (indicator: SPMIndicator) => {
    if (!isAdmin) {
      showToast('Akses dibatasi: Hanya Administrator yang berwenang mengedit target & capaian SPM.', 'info');
      setIsLoginModalOpen(true);
      return;
    }
    setIndicatorToEdit(indicator);
    setIsEditSPMOpen(true);
  };

  const handleResetSPMData = async () => {
    if (!isAdmin) {
      showToast('Akses ditolak: Reset data SPM hanya dapat dilakukan oleh Administrator.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    if (window.confirm('Kembalikan 12 Standar Pelayanan Minimal (SPM) ke data simulasi resmi Permenkes bawaan?')) {
      setSpmIndicators(INITIAL_SPM_INDICATORS);
      localStorage.removeItem(SPM_STORAGE_KEY);
      showToast('Data 12 SPM berhasil dikembalikan ke standar awal.', 'info');

      try {
        await saveSPMBatch(INITIAL_SPM_INDICATORS);
      } catch (err) {
        console.warn('Failed to reset SPM in cloud:', err);
      }
    }
  };

  // Export handlers
  const handleExportCSV = () => {
    exportEmployeesToCSV(employees);
    showToast('Data pegawai berhasil diekspor ke format CSV Excel!', 'success');
  };

  const handleExportJSON = () => {
    exportBackupJSON(employees);
    showToast('File backup database JSON berhasil diunduh.', 'success');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isAdmin) {
      showToast('Akses ditolak: Pemulihan data dari backup JSON hanya dapat dilakukan oleh Administrator.', 'error');
      setIsLoginModalOpen(true);
      e.target.value = '';
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEmployees(parsed);
          showToast(`Berhasil memulihkan ${parsed.length} data pegawai dari backup!`, 'success');
          try {
            await saveEmployeesBatch(parsed);
          } catch (cloudErr) {
            console.warn('Failed to sync imported employees to cloud:', cloudErr);
          }
        } else {
          showToast('Format file backup tidak valid.', 'error');
        }
      } catch (err) {
        showToast('Gagal membaca file JSON backup.', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleResetData = async () => {
    if (!isAdmin) {
      showToast('Akses ditolak: Reset seluruh database hanya dapat dilakukan oleh Administrator.', 'error');
      setIsLoginModalOpen(true);
      return;
    }
    if (window.confirm('Apakah Anda yakin ingin mengembalikan data ke daftar bawaan Puskesmas Boganatar?')) {
      setEmployees(INITIAL_EMPLOYEES);
      localStorage.removeItem(STORAGE_KEY);
      showToast('Data pegawai telah dikembalikan ke data awal bawaan.', 'info');

      try {
        await saveEmployeesBatch(INITIAL_EMPLOYEES);
      } catch (err) {
        console.warn('Failed to reset employees in cloud:', err);
      }
    }
  };

  // Quick expiring count for badge
  const expiringCount = employees.filter(e => {
    if (e.staffCategory !== 'Nakes') return false;
    const str = getCredentialStatus(e.strExpiryDate, e.strIsLifetime, true);
    const sip = getCredentialStatus(e.sipExpiryDate, false, true);
    return str.status === 'warning' || str.status === 'expired' || sip.status === 'warning' || sip.status === 'expired';
  }).length;

  // Header & Main Dashboard Render
  return (
    <div id="app-root" className="min-h-screen bg-slate-100 flex flex-col lg:flex-row antialiased font-sans text-slate-800 selection:bg-blue-600 selection:text-white">
      {/* Toast Notification Alert Banner */}
      {toastMessage && (
        <div 
          id="toast-notification"
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl shadow-2xl border flex items-center space-x-3 text-xs font-semibold animate-in fade-in slide-in-from-bottom-5 duration-200 ${
            toastMessage.type === 'success' 
              ? 'bg-slate-900 text-white border-slate-700' 
              : toastMessage.type === 'error'
              ? 'bg-red-900 text-red-50 border-red-700'
              : 'bg-blue-900 text-blue-50 border-blue-700'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          )}
          <span>{toastMessage.text}</span>
          <button 
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white ml-2 text-sm cursor-pointer"
          >
            &times;
          </button>
        </div>
      )}

      {/* Backdrop for Mobile Sidebar */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <aside 
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-white flex flex-col border-r border-slate-800 transition-transform duration-200 lg:static lg:translate-x-0 print:hidden ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 p-1 border border-white/20 flex items-center justify-center shadow-md shrink-0 overflow-hidden">
              <img 
                src="/images/logo_sidebar.png" 
                alt="Logo Puskesmas" 
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://iili.io/CmfDQtt.png";
                }}
              />
            </div>
            <div>
              <h1 id="sidebar-app-title" className="text-sm font-black leading-tight tracking-tight text-white flex items-center gap-1.5">
                <span>SIMPEG UPT PUSKESMAS BOGANATAR</span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Kabupaten Sikka &bull; NTT</p>
            </div>
          </div>
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Links */}
        <nav className="flex-1 p-3.5 space-y-4 overflow-y-auto custom-scrollbar text-xs">
          {/* Group 1: MODUL UTAMA */}
          <div className="space-y-1">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 pb-1 flex items-center justify-between">
              <span>Modul Utama</span>
              <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded font-mono">6 Modul</span>
            </div>

            {/* 1. SIMPEG Pegawai */}
            <button
              id="sidebar-nav-employees"
              onClick={() => {
                setCurrentMainView('employees');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                currentMainView === 'employees'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 ring-1 ring-blue-500'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Users className={`w-4 h-4 ${currentMainView === 'employees' ? 'text-white' : 'text-blue-400'}`} />
                <span>SIMPEG Pegawai</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-black ${
                currentMainView === 'employees' ? 'bg-blue-800 text-white' : 'bg-slate-800 text-blue-300'
              }`}>
                {employees.length} Nakes
              </span>
            </button>

            {/* 2. Profil Puskesmas */}
            <button
              id="sidebar-nav-profile"
              onClick={() => {
                setCurrentMainView('profile');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                currentMainView === 'profile'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-500'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Building2 className={`w-4 h-4 ${currentMainView === 'profile' ? 'text-white' : 'text-emerald-400'}`} />
                <span>Profil Puskesmas</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                currentMainView === 'profile' ? 'bg-emerald-800 text-white' : 'bg-slate-800 text-emerald-300'
              }`}>
                Lembaga
              </span>
            </button>

            {/* 3. Visi & Misi */}
            <button
              id="sidebar-nav-vision-mission"
              onClick={() => {
                setCurrentMainView('vision-mission');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                currentMainView === 'vision-mission'
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/30 ring-1 ring-teal-500'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Target className={`w-4 h-4 ${currentMainView === 'vision-mission' ? 'text-white' : 'text-teal-400'}`} />
                <span>Visi & Misi</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                currentMainView === 'vision-mission' ? 'bg-teal-800 text-white' : 'bg-slate-800 text-teal-300'
              }`}>
                Tata Nilai
              </span>
            </button>

            {/* 4. 5 Desa Binaan */}
            <button
              id="sidebar-nav-villages"
              onClick={() => {
                setCurrentMainView('villages');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                currentMainView === 'villages'
                  ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/30 ring-1 ring-cyan-500'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <MapPin className={`w-4 h-4 ${currentMainView === 'villages' ? 'text-white' : 'text-cyan-400'}`} />
                <span>5 Desa Binaan</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                currentMainView === 'villages' ? 'bg-cyan-800 text-white' : 'bg-slate-800 text-cyan-300'
              }`}>
                5 Desa
              </span>
            </button>

            {/* 5. Data Posyandu */}
            <button
              id="sidebar-nav-posyandu"
              onClick={() => {
                setCurrentMainView('posyandu');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                currentMainView === 'posyandu'
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-600/30 ring-1 ring-pink-500'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <HeartHandshake className={`w-4 h-4 ${currentMainView === 'posyandu' ? 'text-white' : 'text-pink-400'}`} />
                <span>Data Posyandu</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                currentMainView === 'posyandu' ? 'bg-pink-800 text-white' : 'bg-slate-800 text-pink-300'
              }`}>
                16 Pos
              </span>
            </button>

            {/* 6. 12 SPM Kesehatan */}
            <button
              id="sidebar-nav-spm"
              onClick={() => {
                setCurrentMainView('spm');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center justify-between p-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                currentMainView === 'spm'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-500'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Target className={`w-4 h-4 ${currentMainView === 'spm' ? 'text-white' : 'text-indigo-400'}`} />
                <span>12 SPM Kesehatan</span>
              </div>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                currentMainView === 'spm' ? 'bg-indigo-800 text-white' : 'bg-slate-800 text-indigo-300'
              }`}>
                12 Indikator
              </span>
            </button>
          </div>

          {/* Group 2: TINDAKAN & INPUT CEPAT */}
          <div className="space-y-1 pt-1 border-t border-slate-800/80">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 pb-1">
              Tindakan Cepat
            </div>

            {/* Input Pegawai Baru Button */}
            <button
              id="btn-sidebar-add-new"
              onClick={() => {
                handleAddNew();
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center space-x-2.5 p-2.5 rounded-xl transition-all cursor-pointer font-bold shadow-xs ${
                isAdmin
                  ? 'bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 hover:border-blue-500'
                  : 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}
              title={isAdmin ? "Input Pegawai Baru" : "Hanya Admin yang berwenang menambah pegawai (Klik untuk Login)"}
            >
              {isAdmin ? <UserPlus className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-400" />}
              <span>{isAdmin ? '+ Input Pegawai Baru' : '+ Input Pegawai (Admin)'}</span>
            </button>

            {/* Monitoring STR/SIP */}
            <button
              id="btn-sidebar-monitoring"
              onClick={() => { 
                setIsMonitoringOpen(true); 
                setIsMobileSidebarOpen(false); 
              }}
              className="w-full flex items-center justify-between p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <ShieldAlert className={`w-4 h-4 ${expiringCount > 0 ? 'text-amber-400' : 'text-slate-400'}`} />
                <span>Monitoring STR/SIP</span>
              </div>
              {expiringCount > 0 && (
                <span className="px-2 py-0.5 bg-amber-500 text-slate-900 rounded-md text-[10px] font-black animate-pulse">
                  {expiringCount} Kadaluarsa
                </span>
              )}
            </button>
          </div>

          {/* Group 3: DOKUMEN & CETAK */}
          <div className="space-y-1 pt-1 border-t border-slate-800/80">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 pb-1">
              Cetak Dokumen & Rekap
            </div>

            {/* Cetak Rekap Pegawai */}
            <button
              id="btn-sidebar-print-rekap"
              onClick={() => { 
                setIsPrintRekapOpen(true); 
                setIsMobileSidebarOpen(false); 
              }}
              className="w-full flex items-center space-x-2.5 p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-blue-400" />
              <span>Cetak Rekap Pegawai</span>
            </button>

            {/* Cetak Profil & 5 Desa */}
            <button
              id="sidebar-nav-print-territory"
              onClick={() => {
                setIsPrintProfileTerritoryOpen(true);
                setIsMobileSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-2.5 p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Cetak Profil & 5 Desa</span>
            </button>

            {/* Cetak 12 SPM */}
            <button
              id="sidebar-nav-print-spm"
              onClick={() => {
                setIsPrintSPMOpen(true);
                setIsMobileSidebarOpen(false);
              }}
              className="w-full flex items-center space-x-2.5 p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-indigo-400" />
              <span>Cetak Laporan 12 SPM</span>
            </button>
          </div>

          {/* Group 4: INTEGRASI & SISTEM */}
          <div className="space-y-1 pt-1 border-t border-slate-800/80">
            <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 pb-1">
              Integrasi & Utilitas
            </div>

            {/* Google Sheets */}
            <button
              id="btn-sidebar-google-sheets"
              onClick={() => { setIsGoogleSheetsOpen(true); setIsMobileSidebarOpen(false); }}
              className="w-full flex items-center justify-between p-2.5 text-emerald-300 hover:bg-emerald-950/30 hover:text-emerald-200 rounded-xl transition-colors cursor-pointer font-medium"
            >
              <div className="flex items-center space-x-2.5">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Google Sheets Sync</span>
              </div>
              <span className="px-1.5 py-0.2 bg-emerald-900/80 text-emerald-300 text-[9px] rounded font-mono">
                Cloud
              </span>
            </button>

            {/* Aplikasi PC Desktop */}
            <button
              id="btn-sidebar-pc-mode"
              onClick={() => { setIsPCGuideOpen(true); setIsMobileSidebarOpen(false); }}
              className="w-full flex items-center space-x-2.5 p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <Monitor className="w-4 h-4 text-blue-400" />
              <span>Aplikasi PC Desktop</span>
            </button>

            {/* Unduh Excel CSV */}
            <button
              id="btn-sidebar-export-csv"
              onClick={() => { handleExportCSV(); setIsMobileSidebarOpen(false); }}
              className="w-full flex items-center space-x-2.5 p-2.5 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Unduh Excel Pegawai (CSV)</span>
            </button>
          </div>
        </nav>

        {/* Sidebar Footer User Profile */}
        <div 
          id="sidebar-user-profile" 
          className="p-3.5 mt-auto border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-2"
        >
          {currentUser ? (
            <>
              <div 
                onClick={() => setIsLoginModalOpen(true)}
                className="flex items-center space-x-2.5 min-w-0 flex-1 cursor-pointer group"
                title="Klik untuk membuka detail akun petugas"
              >
                <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-800 border border-blue-400/40 flex items-center justify-center font-black text-xs text-white shadow-2xs shrink-0 ring-2 ring-blue-400/30">
                  <img 
                    src="/images/user_avatar.jpg" 
                    alt="Foto Profil Petugas" 
                    className="w-full h-full object-cover object-top"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://iili.io/Cmfynls.jpg";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p id="sidebar-user-name" className="text-xs font-bold text-slate-200 truncate group-hover:text-blue-300 transition-colors">
                      {currentUser.fullName}
                    </p>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Sesi Login Aktif"></span>
                  </div>
                  <p id="sidebar-user-role" className="text-[10px] text-slate-400 truncate">
                    {currentUser.role || 'Administrator'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-sidebar-logout"
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-white hover:bg-red-600 rounded-xl transition-all cursor-pointer shrink-0 border border-slate-800 hover:border-red-600 shadow-2xs"
                title="Keluar dari Akun Admin (Logout)"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              id="btn-sidebar-login-action"
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full flex items-center justify-between p-2 rounded-xl bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/40 transition-all cursor-pointer group shadow-xs"
              title="Klik untuk Login Admin (shyllpb@2026)"
            >
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600/40 group-hover:bg-blue-700 flex items-center justify-center text-blue-200 group-hover:text-white transition-colors">
                  <Lock className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold leading-tight">Mode Pengguna</div>
                  <div className="text-[10px] text-blue-300/80 group-hover:text-blue-100">Klik Login Admin</div>
                </div>
              </div>
              <span className="text-[11px] font-bold bg-blue-600 group-hover:bg-white text-white group-hover:text-blue-900 px-2 py-0.5 rounded-lg transition-colors">
                Login
              </span>
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Top Header Component */}
        <Header
          puskesmasInfo={puskesmasInfo}
          totalEmployees={employees.length}
          expiringCount={expiringCount}
          currentView={currentMainView}
          currentUser={currentUser}
          isAdmin={isAdmin}
          onOpenLogin={() => setIsLoginModalOpen(true)}
          onLogout={handleLogout}
          syncStatus={syncStatus}
          isCloudSyncing={isCloudSyncing}
          onManualCloudSync={handleManualCloudSync}
          onViewChange={setCurrentMainView}
          onAddNew={handleAddNew}
          onPrintRekap={() => setIsPrintRekapOpen(true)}
          onOpenMonitoring={() => setIsMonitoringOpen(true)}
          onOpenGoogleSheets={() => setIsGoogleSheetsOpen(true)}
          onOpenPCGuide={() => setIsPCGuideOpen(true)}
          onExportCSV={handleExportCSV}
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
          onResetData={handleResetData}
          onToggleSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        />

        {/* Main Dashboard & Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 print:p-0">
          {currentMainView === 'employees' ? (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* KPI & Summary Dashboard Cards */}
              <DashboardSummary
                employees={employees}
                activeFilterStatus={statusFilter}
                activeFilterCategory={categoryFilter}
                onSelectStatusFilter={(st) => setStatusFilter(st)}
                onSelectCategoryFilter={(cat) => setCategoryFilter(cat)}
                onOpenMonitoring={() => setIsMonitoringOpen(true)}
              />

              {/* Main Employee Table */}
              <EmployeeTable
                employees={employees}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                unitFilter={unitFilter}
                onUnitFilterChange={setUnitFilter}
                categoryFilter={categoryFilter}
                onCategoryFilterChange={setCategoryFilter}
                isAdmin={isAdmin}
                onViewEmployee={handleViewDetail}
                onPrintEmployee={handlePrintEmployee}
                onEditEmployee={handleEdit}
                onDeleteEmployee={handleDeleteRequest}
                onUploadDocument={handleOpenUploadDocument}
                onAddNew={handleAddNew}
              />
            </div>
          ) : currentMainView === 'profile' ? (
            <div className="animate-in fade-in duration-150">
              <PuskesmasProfileView
                profileData={profileTerritoryData}
                puskesmasInfo={puskesmasInfo}
                employees={employees}
                isAdmin={isAdmin}
                onUpdateProfile={handleSaveProfile}
                onOpenEditProfile={() => setIsEditProfileOpen(true)}
                onOpenPrintModal={() => setIsPrintProfileTerritoryOpen(true)}
                onResetDefaultData={handleResetProfileTerritoryData}
                onRequireAdmin={() => {
                  showToast('Akses dibatasi: Hanya Administrator yang dapat mengubah data profil, struktur organisasi & fasilitas.', 'info');
                  setIsLoginModalOpen(true);
                }}
              />
            </div>
          ) : currentMainView === 'vision-mission' ? (
            <div className="animate-in fade-in duration-150">
              <VisionMissionView
                profileData={profileTerritoryData}
                puskesmasInfo={puskesmasInfo}
                isAdmin={isAdmin}
                onOpenEditProfile={() => setIsEditProfileOpen(true)}
                onOpenPrintModal={() => setIsPrintProfileTerritoryOpen(true)}
                onResetDefaultData={handleResetProfileTerritoryData}
              />
            </div>
          ) : currentMainView === 'villages' ? (
            <div className="animate-in fade-in duration-150">
              <VillagesTerritoryView
                profileData={profileTerritoryData}
                puskesmasInfo={puskesmasInfo}
                isAdmin={isAdmin}
                onOpenEditVillage={(village) => {
                  setVillageToEdit(village);
                  setIsEditVillageOpen(true);
                }}
                onOpenPrintModal={() => setIsPrintProfileTerritoryOpen(true)}
                onNavigateToPosyandu={() => setCurrentMainView('posyandu')}
                onResetDefaultData={handleResetProfileTerritoryData}
              />
            </div>
          ) : currentMainView === 'posyandu' ? (
            <div className="animate-in fade-in duration-150">
              <PosyanduView
                profileData={profileTerritoryData}
                puskesmasInfo={puskesmasInfo}
                isAdmin={isAdmin}
                onOpenAddPosyandu={handleOpenAddPosyandu}
                onOpenEditPosyandu={handleOpenEditPosyandu}
                onDeletePosyandu={handleDeletePosyandu}
                onOpenPrintModal={() => setIsPrintProfileTerritoryOpen(true)}
              />
            </div>
          ) : (
            <div className="animate-in fade-in duration-150">
              <SPMView
                indicators={spmIndicators}
                puskesmasInfo={puskesmasInfo}
                employees={employees}
                isAdmin={isAdmin}
                onEditIndicator={handleOpenEditSPM}
                onOpenPrintModal={() => setIsPrintSPMOpen(true)}
                onResetDefaultData={handleResetSPMData}
              />
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-5 mt-auto text-xs text-slate-500 print:hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-slate-600">
              <Building2 className="w-4 h-4 text-blue-600 flex-shrink-0" />
              <div>
                <span className="font-semibold text-slate-800">UPT Puskesmas Boganatar</span> &bull; Dinas Kesehatan Kabupaten Sikka
                <span className="text-slate-400 hidden sm:inline"> &bull; {puskesmasInfo.address}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span id="footer-creator-tag" className="font-semibold text-slate-600 tracking-wide">Createt By @shyllpb</span>
              <span>&bull;</span>
              <span>Wilayah Kerja 5 Desa Binaan</span>
            </div>
          </div>
        </footer>
      </div>

      {/* MODALS & DRAWERS */}
      {/* 1. Employee Form Modal (Input & Edit) */}
      <EmployeeFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveEmployee}
        employeeToEdit={employeeToEdit}
      />

      {/* 2. Employee Profile Print Modal (Official A4 Kop Surat) */}
      <EmployeeProfilePrint
        isOpen={isPrintProfileOpen}
        employee={employeeToPrint}
        puskesmasInfo={puskesmasInfo}
        onClose={() => setIsPrintProfileOpen(false)}
      />

      {/* 3. Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        employee={employeeToDelete}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* 4. Detail Drawer */}
      <EmployeeDetailDrawer
        isOpen={isDetailDrawerOpen}
        employee={selectedDetailEmployee}
        isAdmin={isAdmin}
        onClose={() => setIsDetailDrawerOpen(false)}
        onEdit={handleEdit}
        onPrint={handlePrintEmployee}
        onDelete={handleDeleteRequest}
        onUploadDocument={(emp) => handleOpenUploadDocument(emp)}
        onViewDocument={(doc, emp) => handleViewDocument(doc, emp)}
        onDeleteDocument={(empId, docId) => handleDeleteDocument(empId, docId)}
      />

      {/* 4a. Upload Document PDF Modal */}
      <UploadDocumentModal
        isOpen={isUploadDocModalOpen}
        employee={employeeForDocUpload}
        onClose={() => {
          setIsUploadDocModalOpen(false);
          setEmployeeForDocUpload(null);
        }}
        onSaveDocument={handleSaveUploadedDocument}
      />

      {/* 4b. Document Viewer & Print Modal */}
      <DocumentViewerModal
        isOpen={isViewDocModalOpen}
        document={documentToView}
        employee={employeeForDocView}
        onClose={() => {
          setIsViewDocModalOpen(false);
          setDocumentToView(null);
          setEmployeeForDocView(null);
        }}
      />

      {/* 5. STR & SIP Monitoring Console Modal */}
      <STRSIPMonitoringModal
        isOpen={isMonitoringOpen}
        onClose={() => setIsMonitoringOpen(false)}
        employees={employees}
        isAdmin={isAdmin}
        onEditEmployee={handleEdit}
        onPrintEmployee={handlePrintEmployee}
      />

      {/* 6. Print Full Roster Rekap Modal */}
      <PrintRekapModal
        isOpen={isPrintRekapOpen}
        onClose={() => setIsPrintRekapOpen(false)}
        employees={employees}
        puskesmasInfo={puskesmasInfo}
      />

      {/* 7. Google Sheets & Workspace Sync Modal */}
      <GoogleSheetsModal
        isOpen={isGoogleSheetsOpen}
        onClose={() => setIsGoogleSheetsOpen(false)}
        employees={employees}
        puskesmasInfo={puskesmasInfo}
        onUpdateEmployees={(newEmployees) => {
          setEmployees(newEmployees);
        }}
        showToast={showToast}
      />

      {/* 8. PC Desktop App Installation & Guide Modal */}
      <PCInstallGuideModal
        isOpen={isPCGuideOpen}
        onClose={() => setIsPCGuideOpen(false)}
        onTriggerInstall={triggerPCInstall}
        canInstallPrompt={Boolean(installPromptEvent)}
      />

      {/* 9. Edit Profile, Visi & Misi Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profileData={profileTerritoryData}
        onSave={handleSaveProfile}
      />

      {/* 10. Edit Village Territory & Population Modal */}
      <EditVillageModal
        isOpen={isEditVillageOpen}
        onClose={() => setIsEditVillageOpen(false)}
        village={villageToEdit}
        onSave={handleSaveVillage}
      />

      {/* 11. Edit / Add Posyandu Modal */}
      <EditPosyanduModal
        isOpen={isEditPosyanduOpen}
        onClose={() => setIsEditPosyanduOpen(false)}
        posyandu={posyanduToEdit}
        selectedVillageId={selectedVillageIdForPosyandu}
        villages={profileTerritoryData.villages}
        isAdmin={isAdmin}
        onSave={handleSavePosyandu}
        onDelete={handleDeletePosyandu}
      />

      {/* 12. Print Official Profile & Territory 5 Villages Modal */}
      <PrintProfileTerritoryModal
        isOpen={isPrintProfileTerritoryOpen}
        onClose={() => setIsPrintProfileTerritoryOpen(false)}
        profileData={profileTerritoryData}
        puskesmasInfo={puskesmasInfo}
      />

      {/* 13. Edit SPM Indicator Modal */}
      <EditSPMModal
        isOpen={isEditSPMOpen}
        onClose={() => setIsEditSPMOpen(false)}
        indicator={indicatorToEdit}
        employees={employees}
        onSave={handleSaveSPMIndicator}
      />

      {/* 14. Print Official 12 SPM Document Modal */}
      <PrintSPMModal
        isOpen={isPrintSPMOpen}
        onClose={() => setIsPrintSPMOpen(false)}
        indicators={spmIndicators}
        puskesmasInfo={puskesmasInfo}
      />

      {/* 15. User Authentication / Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        currentUser={currentUser}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />
    </div>
  );
}
