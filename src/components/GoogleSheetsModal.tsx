import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Upload, 
  Download, 
  RefreshCw, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Search, 
  Plus, 
  Database,
  ArrowRight,
  ShieldCheck,
  LogOut,
  FolderOpen
} from 'lucide-react';
import { User } from 'firebase/auth';
import { Employee, PuskesmasInfo } from '../types/employee';
import { 
  googleSignIn, 
  logoutGoogle, 
  getAccessToken, 
  setAccessTokenInMemory 
} from '../services/firebaseAuth';
import { 
  createSimpegSpreadsheet, 
  syncEmployeesToSpreadsheet, 
  importEmployeesFromSpreadsheet, 
  listUserSpreadsheets, 
  DriveSpreadsheetFile 
} from '../services/googleSheets';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
  puskesmasInfo: PuskesmasInfo;
  onUpdateEmployees: (employees: Employee[]) => void;
  showToast: (text: string, type?: 'success' | 'info' | 'error') => void;
}

const STORAGE_ACTIVE_SHEET_KEY = 'simpeg_active_google_sheet_info';

interface ActiveSheetInfo {
  id: string;
  name: string;
  url: string;
  lastSyncedAt?: string;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  employees,
  puskesmasInfo,
  onUpdateEmployees,
  showToast
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Active connected spreadsheet
  const [activeSheet, setActiveSheet] = useState<ActiveSheetInfo | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ACTIVE_SHEET_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Tab: 'overview' | 'drive_picker' | 'import_preview'
  const [activeTab, setActiveTab] = useState<'overview' | 'drive_picker' | 'import_preview'>('overview');
  
  // Drive files state
  const [driveFiles, setDriveFiles] = useState<DriveSpreadsheetFile[]>([]);
  const [isLoadingDrive, setIsLoadingDrive] = useState(false);
  const [driveSearch, setDriveSearch] = useState('');
  const [manualSheetInput, setManualSheetInput] = useState('');

  // Loading states for actions
  const [isExporting, setIsExporting] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Import preview state
  const [importPreview, setImportPreview] = useState<{
    employees: Employee[];
    sheetTitle: string;
    rowCount: number;
  } | null>(null);

  // Error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Check auth state on open
  useEffect(() => {
    if (isOpen) {
      getAccessToken().then(token => {
        if (token) {
          setAccessToken(token);
        }
      });
    }
  }, [isOpen]);

  // Persist active sheet info
  useEffect(() => {
    if (activeSheet) {
      localStorage.setItem(STORAGE_ACTIVE_SHEET_KEY, JSON.stringify(activeSheet));
    } else {
      localStorage.removeItem(STORAGE_ACTIVE_SHEET_KEY);
    }
  }, [activeSheet]);

  if (!isOpen) return null;

  // Handle Google Sign In
  const handleSignIn = async () => {
    setErrorMessage(null);
    setIsAuthenticating(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        setAccessTokenInMemory(res.accessToken);
        showToast(`Berhasil terhubung dengan Google (${res.user.email})`, 'success');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal melakukan otentikasi Google';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Handle Sign Out
  const handleSignOut = async () => {
    try {
      await logoutGoogle();
      setCurrentUser(null);
      setAccessToken(null);
      setAccessTokenInMemory(null);
      showToast('Telah keluar dari akun Google', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  // Helper to ensure valid token
  const requireToken = async (): Promise<string | null> => {
    let token = accessToken;
    if (!token) {
      const res = await googleSignIn();
      if (res) {
        setCurrentUser(res.user);
        setAccessToken(res.accessToken);
        token = res.accessToken;
      }
    }
    return token;
  };

  // 1. Create New Spreadsheet
  const handleCreateNewSheet = async () => {
    setErrorMessage(null);
    setIsCreatingNew(true);
    try {
      const token = await requireToken();
      if (!token) return;

      const result = await createSimpegSpreadsheet(token, puskesmasInfo, employees);
      const newSheetInfo: ActiveSheetInfo = {
        id: result.spreadsheetId,
        name: result.title,
        url: result.spreadsheetUrl,
        lastSyncedAt: new Date().toISOString()
      };
      setActiveSheet(newSheetInfo);
      showToast(`Spreadsheet SIMPEG baru berhasil dibuat di Google Drive!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal membuat Google Spreadsheet';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsCreatingNew(false);
    }
  };

  // 2. Export / Push to Active Spreadsheet
  const handleExportToSheet = async () => {
    if (!activeSheet) {
      showToast('Pilih atau buat spreadsheet target terlebih dahulu', 'info');
      return;
    }
    setErrorMessage(null);
    setIsExporting(true);
    try {
      const token = await requireToken();
      if (!token) return;

      await syncEmployeesToSpreadsheet(token, activeSheet.id, employees, puskesmasInfo);
      const updated: ActiveSheetInfo = {
        ...activeSheet,
        lastSyncedAt: new Date().toISOString()
      };
      setActiveSheet(updated);
      showToast(`Berhasil menyinkronkan ${employees.length} data pegawai ke Google Sheets!`, 'success');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal mengekspor data ke Google Sheets';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  // 3. Fetch & Preview Import from Active Sheet
  const handleFetchForImport = async (targetId?: string) => {
    const sheetId = targetId || activeSheet?.id;
    if (!sheetId) {
      showToast('Pilih spreadsheet yang akan diimpor', 'info');
      return;
    }

    setErrorMessage(null);
    setIsImporting(true);
    try {
      const token = await requireToken();
      if (!token) return;

      const result = await importEmployeesFromSpreadsheet(token, sheetId);
      setImportPreview(result);
      setActiveTab('import_preview');
      showToast(`Ditemukan ${result.rowCount} data pegawai di spreadsheet!`, 'info');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal membaca data dari Google Sheets';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsImporting(false);
    }
  };

  // 4. Confirm Import (User Confirmation for Destructive Action)
  const handleConfirmImport = () => {
    if (!importPreview || importPreview.employees.length === 0) return;

    onUpdateEmployees(importPreview.employees);
    showToast(`Berhasil mengimpor ${importPreview.employees.length} data pegawai dari Google Sheets!`, 'success');
    
    if (activeSheet) {
      setActiveSheet({
        ...activeSheet,
        lastSyncedAt: new Date().toISOString()
      });
    }

    setImportPreview(null);
    setActiveTab('overview');
    onClose();
  };

  // 5. Load Drive Spreadsheets
  const handleLoadDriveFiles = async () => {
    setErrorMessage(null);
    setIsLoadingDrive(true);
    try {
      const token = await requireToken();
      if (!token) return;

      const files = await listUserSpreadsheets(token);
      setDriveFiles(files);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Gagal memuat file dari Google Drive';
      setErrorMessage(msg);
      showToast(msg, 'error');
    } finally {
      setIsLoadingDrive(false);
    }
  };

  // Select file from Drive picker
  const handleSelectDriveFile = (file: DriveSpreadsheetFile) => {
    setActiveSheet({
      id: file.id,
      name: file.name,
      url: file.webViewLink || `https://docs.google.com/spreadsheets/d/${file.id}/edit`,
      lastSyncedAt: undefined
    });
    setActiveTab('overview');
    showToast(`Terhubung ke spreadsheet "${file.name}"`, 'success');
  };

  // Manual URL / ID parser
  const handleConnectManual = () => {
    if (!manualSheetInput.trim()) return;

    let id = manualSheetInput.trim();
    // Extract ID from URL if full URL is pasted
    const match = id.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (match && match[1]) {
      id = match[1];
    }

    setActiveSheet({
      id: id,
      name: `Google Spreadsheet (${id.substring(0, 8)}...)`,
      url: `https://docs.google.com/spreadsheets/d/${id}/edit`
    });
    setManualSheetInput('');
    setActiveTab('overview');
    showToast('Spreadsheet berhasil dihubungkan!', 'success');
  };

  const filteredDriveFiles = driveFiles.filter(f => 
    f.name.toLowerCase().includes(driveSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 print:hidden">
      <div 
        id="modal-google-sheets-sync"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2 text-white">
                Google Sheets Integration & Sync
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Sinkronisasi Dua Arah Data SIMPEG Puskesmas Boganatar &bull; Google Workspace
              </p>
            </div>
          </div>
          <button
            id="btn-close-google-sheets-modal"
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Google Account Status Banner */}
        <div className="bg-slate-100 border-b border-slate-200 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          {accessToken ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {currentUser?.displayName ? currentUser.displayName[0].toUpperCase() : 'G'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-800">
                    {currentUser?.displayName || currentUser?.email || 'Akun Google Terhubung'}
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-full text-[10px] font-bold">
                    <ShieldCheck className="w-3 h-3" />
                    Terhubung
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">Izin Akses Google Sheets & Drive aktif</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Otentikasi dengan Google untuk mengakses dan menyinkronkan spreadsheet.</span>
            </div>
          )}

          <div>
            {accessToken ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-500" />
                <span>Keluar Akun</span>
              </button>
            ) : (
              <button
                id="btn-sign-in-google"
                type="button"
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-lg text-xs font-semibold shadow-2xs transition-all cursor-pointer disabled:opacity-50"
              >
                {/* Official Google Icon */}
                <svg className="w-4 h-4" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                </svg>
                <span>{isAuthenticating ? 'Menghubungkan...' : 'Sign in with Google'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Sub-Tabs */}
        <div className="bg-white border-b border-slate-200 px-6 flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Dashboard Sinkronisasi
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('drive_picker');
              if (driveFiles.length === 0) handleLoadDriveFiles();
            }}
            className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'drive_picker'
                ? 'text-blue-600 border-blue-600'
                : 'text-slate-600 border-transparent hover:text-slate-900'
            }`}
          >
            Pilih dari Google Drive
          </button>
          {importPreview && (
            <button
              type="button"
              onClick={() => setActiveTab('import_preview')}
              className={`px-3 py-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === 'import_preview'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              Konfirmasi Impor ({importPreview.rowCount} Pegawai)
            </button>
          )}
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh] space-y-5">
          {/* Error notification */}
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
              <button 
                onClick={() => setErrorMessage(null)} 
                className="text-red-500 hover:text-red-800 text-sm font-bold"
              >
                &times;
              </button>
            </div>
          )}

          {/* TAB 1: OVERVIEW & ACTIONS */}
          {activeTab === 'overview' && (
            <div className="space-y-5 animate-in fade-in duration-100">
              {/* Active Connected Spreadsheet Card */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                      Spreadsheet Terhubung
                    </h3>
                  </div>
                  {activeSheet && (
                    <span className="text-[11px] text-slate-500">
                      {activeSheet.lastSyncedAt 
                        ? `Terakhir sinkron: ${new Date(activeSheet.lastSyncedAt).toLocaleString('id-ID')}`
                        : 'Belum pernah disinkronkan'
                      }
                    </span>
                  )}
                </div>

                {activeSheet ? (
                  <div className="p-3.5 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 flex-shrink-0">
                        <FileSpreadsheet className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">
                          {activeSheet.name}
                        </h4>
                        <p className="text-[11px] text-slate-400 font-mono truncate">
                          ID: {activeSheet.id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={activeSheet.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <span>Buka di Sheets</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      <button
                        type="button"
                        onClick={() => setActiveSheet(null)}
                        className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-slate-100 transition-colors"
                        title="Putuskan sambungan spreadsheet ini"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 bg-white rounded-lg border border-dashed border-slate-300 text-center space-y-2">
                    <p className="text-xs text-slate-600 font-medium">
                      Belum ada Google Spreadsheet yang dihubungkan ke SIMPEG Puskesmas Boganatar.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleCreateNewSheet}
                        disabled={isCreatingNew}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-2xs cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>{isCreatingNew ? 'Membuat Spreadsheet...' : 'Buat Spreadsheet SIMPEG Baru'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('drive_picker');
                          handleLoadDriveFiles();
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded-lg text-xs font-medium hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <FolderOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span>Pilih dari Google Drive</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Sync Actions Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. Push to Google Sheets */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Upload className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Ekspor ke Google Sheets
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Kirim dan perbarui seluruh <strong>{employees.length} data pegawai</strong> saat ini ke Google Spreadsheet. Format tabel dan kolom akan tertata rapi otomatis.
                    </p>
                  </div>

                  <button
                    id="btn-sync-export-sheets"
                    type="button"
                    onClick={handleExportToSheet}
                    disabled={isExporting || !activeSheet}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isExporting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Menyinkronkan ke Sheets...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Kirim {employees.length} Data ke Sheets</span>
                      </>
                    )}
                  </button>
                </div>

                {/* 2. Pull from Google Sheets */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-emerald-300 transition-all flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <Download className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900">
                        Impor dari Google Sheets
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
                      Tarik data pegawai terbaru dari Google Spreadsheet ke dalam aplikasi SIMPEG. Anda akan dapat meninjau data terlebih dahulu sebelum diterapkan.
                    </p>
                  </div>

                  <button
                    id="btn-sync-import-sheets"
                    type="button"
                    onClick={() => handleFetchForImport()}
                    disabled={isImporting || !activeSheet}
                    className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white rounded-lg text-xs font-semibold transition-all shadow-2xs cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isImporting ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Membaca dari Sheets...</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-3.5 h-3.5" />
                        <span>Tarik & Periksa Data dari Sheets</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Tips & Guidance */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                  <span>Keuntungan Integrasi Google Sheets:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5 text-slate-600 pl-1">
                  <li>Data dapat diakses bersama dan diedit oleh tim kepegawaian melalui Google Workspace.</li>
                  <li>Mendukung formula, filter, dan pivot table bawaan Google Spreadsheet untuk pelaporan dinas.</li>
                  <li>Cadangan cloud otomatis aman di Google Drive Anda.</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: DRIVE SPREADSHEET PICKER */}
          {activeTab === 'drive_picker' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Cari nama spreadsheet..."
                    value={driveSearch}
                    onChange={(e) => setDriveSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={handleLoadDriveFiles}
                    disabled={isLoadingDrive}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-lg text-xs font-medium transition-colors cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 text-slate-500 ${isLoadingDrive ? 'animate-spin' : ''}`} />
                    <span>Segarkan</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleCreateNewSheet}
                    disabled={isCreatingNew}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Buat Baru</span>
                  </button>
                </div>
              </div>

              {/* Spreadsheet List */}
              <div className="space-y-2">
                {isLoadingDrive ? (
                  <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                    <span>Memuat daftar spreadsheet dari Google Drive...</span>
                  </div>
                ) : filteredDriveFiles.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-300 rounded-xl text-slate-500 text-xs">
                    Tidak ditemukan Google Spreadsheet. Buat spreadsheet baru atau masukkan ID secara manual di bawah.
                  </div>
                ) : (
                  filteredDriveFiles.map((file) => (
                    <div
                      key={file.id}
                      className="p-3 bg-white border border-slate-200 hover:border-blue-400 rounded-lg flex items-center justify-between gap-3 shadow-2xs transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <FileSpreadsheet className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-900 truncate">{file.name}</p>
                          <p className="text-[10px] text-slate-400">
                            Diperbarui: {file.modifiedTime ? new Date(file.modifiedTime).toLocaleDateString('id-ID') : '-'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() => handleSelectDriveFile(file)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          Pilih File
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Manual URL / ID input */}
              <div className="pt-3 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Atau Hubungkan Menggunakan URL / ID Spreadsheet:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Tempel tautan https://docs.google.com/spreadsheets/d/... atau ID"
                    value={manualSheetInput}
                    onChange={(e) => setManualSheetInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleConnectManual}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Hubungkan
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMPORT CONFIRMATION & PREVIEW (MANDATORY USER CONFIRMATION) */}
          {activeTab === 'import_preview' && importPreview && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>Konfirmasi Pembaruan Data Kepegawaian (Impor Google Sheets)</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Apakah Anda yakin ingin menggantikan data kepegawaian lokal dengan <strong>{importPreview.rowCount} baris data pegawai</strong> dari spreadsheet <em>&quot;{importPreview.sheetTitle}&quot;</em>?
                </p>
              </div>

              {/* Preview Table of incoming employees */}
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Pratinjau Data yang Akan Diimpor ({importPreview.rowCount} Pegawai):</span>
                  <span className="text-slate-400 font-normal">Menampilkan maks. 6 baris</span>
                </div>
                <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
                  {importPreview.employees.slice(0, 6).map((emp, i) => (
                    <div key={emp.id || i} className="p-3 text-xs flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-slate-900">{emp.fullName}</div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          {emp.nipType}: {emp.nip || '-'} &bull; {emp.jobTitle}
                        </div>
                      </div>
                      <div className="text-right text-[11px]">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded border border-slate-200 font-medium">
                          {emp.department}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Explicit Confirmation Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setImportPreview(null);
                    setActiveTab('overview');
                  }}
                  className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  id="btn-confirm-import-sheets"
                  type="button"
                  onClick={handleConfirmImport}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Konfirmasi & Terapkan Data ({importPreview.rowCount} Pegawai)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-2">
            <span>UPT Puskesmas Boganatar</span>
            <span>&bull;</span>
            <span>Google Drive & Sheets API</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
