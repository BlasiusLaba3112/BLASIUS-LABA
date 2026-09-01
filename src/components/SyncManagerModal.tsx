/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Cloud,
  CloudOff,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowDownToLine,
  ArrowUpToLine,
  Database,
  Wifi,
  WifiOff,
  ShieldCheck,
  Clock,
  HardDrive,
  Users,
  Building2,
  Target,
  Sparkles,
  Info,
  X
} from 'lucide-react';
import {
  getPendingSyncQueue,
  flushSyncQueue,
  fetchFreshCloudData,
  checkTrueOnlineStatus,
  getLastSyncTime,
  PendingSyncItem
} from '../services/offlineSync';
import { Employee } from '../types/employee';
import { PuskesmasProfileData } from '../types/profileTerritory';
import { SPMIndicator } from '../types/spm';

interface SyncManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  isOnline: boolean;
  isAdmin: boolean;
  totalEmployees: number;
  totalVillages: number;
  totalSPM: number;
  onSyncComplete?: (message: string, type: 'success' | 'info' | 'error') => void;
  onApplyCloudData?: (data: {
    employees?: Employee[];
    territory?: PuskesmasProfileData;
    spm?: SPMIndicator[];
  }) => void;
}

export const SyncManagerModal: React.FC<SyncManagerModalProps> = ({
  isOpen,
  onClose,
  isOnline,
  isAdmin,
  totalEmployees,
  totalVillages,
  totalSPM,
  onSyncComplete,
  onApplyCloudData
}) => {
  const [queue, setQueue] = useState<PendingSyncItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [pingResult, setPingResult] = useState<'success' | 'failed' | null>(null);
  const [syncProgress, setSyncProgress] = useState<{ completed: number; total: number; title: string } | null>(null);
  const [lastSyncStr, setLastSyncStr] = useState<string>('Belum pernah disinkronkan');

  const refreshQueueAndStatus = () => {
    const q = getPendingSyncQueue();
    setQueue(q);
    const last = getLastSyncTime();
    if (last) {
      try {
        const d = new Date(last);
        setLastSyncStr(
          d.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) + ' WITA'
        );
      } catch {
        setLastSyncStr(last);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      refreshQueueAndStatus();
      setPingResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePushSync = async () => {
    setIsProcessing(true);
    setSyncProgress(null);
    try {
      const result = await flushSyncQueue((completed, total, currentItem) => {
        setSyncProgress({ completed, total, title: currentItem });
      });

      refreshQueueAndStatus();

      if (result.success) {
        if (onSyncComplete) {
          onSyncComplete(
            `Sinkronisasi berhasil! ${result.syncedCount} perubahan offline telah diunggah ke Cloud Database.`,
            'success'
          );
        }
      } else {
        if (onSyncComplete) {
          onSyncComplete(
            `Sebagian data belum berhasil disinkronkan. Periksa koneksi internet Anda.`,
            'error'
          );
        }
      }
    } catch (err) {
      console.error('Push sync failed:', err);
      if (onSyncComplete) {
        onSyncComplete('Gagal melakukan sinkronisasi cloud.', 'error');
      }
    } finally {
      setIsProcessing(false);
      setSyncProgress(null);
    }
  };

  const handlePullFreshCloudData = async () => {
    setIsPulling(true);
    try {
      const cloudData = await fetchFreshCloudData();
      if (onApplyCloudData) {
        onApplyCloudData(cloudData);
      }
      refreshQueueAndStatus();
      if (onSyncComplete) {
        onSyncComplete('Data terbaru dari Cloud Database berhasil dimuat ke aplikasi!', 'success');
      }
    } catch (err) {
      console.error('Pull fresh data failed:', err);
      if (onSyncComplete) {
        onSyncComplete('Gagal memuat data dari Cloud. Pastikan koneksi internet aktif.', 'error');
      }
    } finally {
      setIsPulling(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTestingPing(true);
    setPingResult(null);
    try {
      const ok = await checkTrueOnlineStatus();
      setPingResult(ok ? 'success' : 'failed');
    } catch {
      setPingResult('failed');
    } finally {
      setIsTestingPing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div 
        id="sync-manager-modal"
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl ${isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {isOnline ? <Cloud className="w-5 h-5" /> : <CloudOff className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                Pusat Sinkronisasi Online & Offline
              </h3>
              <p className="text-xs text-slate-300">
                Manajemen Data Cloud Firestore & Penyimpanan Lokal Puskesmas Boganatar
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Real-time Connection Status Card */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
            isOnline 
              ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950' 
              : 'bg-amber-50/80 border-amber-200 text-amber-950'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${isOnline ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'}`}>
                {isOnline ? <Wifi className="w-5 h-5" /> : <WifiOff className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">
                    {isOnline ? 'Status: ONLINE (Terhubung ke Cloud)' : 'Status: OFFLINE (Bekerja Tanpa Internet)'}
                  </span>
                  <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
                </div>
                <p className="text-xs mt-0.5 text-slate-600">
                  {isOnline 
                    ? 'Perangkat terhubung ke internet. Data baru disinkronkan secara otomatis dan real-time.' 
                    : 'Admin tetap dapat menginput/mengedit data secara penuh. Semua perubahan tersimpan aman di perangkat dan akan diunggah otomatis saat online.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTestingPing}
              className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
              <span>{isTestingPing ? 'Menguji...' : 'Uji Koneksi'}</span>
            </button>
          </div>

          {pingResult && (
            <div className={`p-2.5 rounded-lg text-xs font-medium flex items-center gap-2 ${
              pingResult === 'success' 
                ? 'bg-emerald-100/80 text-emerald-800 border border-emerald-300' 
                : 'bg-red-100/80 text-red-800 border border-red-300'
            }`}>
              {pingResult === 'success' ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Koneksi ke server Google Cloud Firestore Berhasil & Aktif!</span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>Koneksi Cloud tidak dapat dijangkau. Periksa jaringan internet atau WiFi Anda.</span>
                </>
              )}
            </div>
          )}

          {/* Sync Queue Summary Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600" />
                <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                  Antrean Sinkronisasi Offline ({queue.length})
                </h4>
              </div>
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Terakhir Sync: {lastSyncStr}</span>
              </span>
            </div>

            {queue.length === 0 ? (
              <div className="p-4 rounded-lg bg-emerald-50/50 border border-emerald-100 text-center text-xs text-emerald-800 flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Seluruh data telah tersinkronkan 100% dengan Cloud Database. Tidak ada data pending!</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                {queue.map((item, idx) => (
                  <div 
                    key={item.id || idx}
                    className="p-2.5 bg-white rounded-lg border border-amber-200 text-xs flex items-center justify-between gap-2 shadow-2xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-100 text-amber-800">
                        {item.type.replace('_', ' ')}
                      </span>
                      <span className="font-medium text-slate-800 truncate">{item.title}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                      {new Date(item.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Data Counts in Local Device */}
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100">
              <Users className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <div className="text-lg font-black text-blue-900">{totalEmployees}</div>
              <div className="text-[10px] font-semibold text-blue-700">Data Pegawai</div>
            </div>
            <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100">
              <Building2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <div className="text-lg font-black text-emerald-900">{totalVillages} Desa</div>
              <div className="text-[10px] font-semibold text-emerald-700">Wilayah Binaan</div>
            </div>
            <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100">
              <Target className="w-4 h-4 text-indigo-600 mx-auto mb-1" />
              <div className="text-lg font-black text-indigo-900">{totalSPM} Indikator</div>
              <div className="text-[10px] font-semibold text-indigo-700">Standar SPM</div>
            </div>
          </div>

          {/* Sync Progress Bar if running */}
          {syncProgress && (
            <div className="p-3 bg-blue-50 rounded-xl border border-blue-200 space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-blue-900">
                <span>Mengunggah data ke cloud: {syncProgress.title}</span>
                <span>{syncProgress.completed} / {syncProgress.total}</span>
              </div>
              <div className="w-full bg-blue-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-600 h-2 transition-all duration-300"
                  style={{ width: `${(syncProgress.completed / syncProgress.total) * 100}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Explanation Banner: How Offline & Online Works */}
          <div className="p-3.5 bg-slate-900 text-slate-200 rounded-xl text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Cara Kerja Sistem Input Offline & Online:</span>
            </div>
            <ul className="space-y-1.5 text-slate-300 text-[11px] list-disc list-inside">
              <li>
                <strong>Input Offline oleh Admin:</strong> Saat berada di Pustu/Poskesdes tanpa sinyal internet, Admin tetap bisa bebas menambah, mengedit, dan menghapus data. Perubahan langsung tersimpan otomatis di memori lokal laptop/HP.
              </li>
              <li>
                <strong>Sinkronisasi Otomatis saat Online:</strong> Begitu perangkat terhubung kembali ke internet/WiFi, seluruh data antrean akan otomatis terunggah ke Cloud Firestore.
              </li>
              <li>
                <strong>Melihat Data Baru Secara Online oleh User:</strong> Staf, Kepala Puskesmas, atau instansi lain yang membuka aplikasi secara online akan langsung melihat data terbaru secara real-time.
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer with Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <HardDrive className="w-3.5 h-3.5 text-slate-400" />
            <span>Penyimpanan: Offline Storage + Cloud Firestore</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Pull Online Button for Users & Admins */}
            <button
              type="button"
              onClick={handlePullFreshCloudData}
              disabled={isPulling || isProcessing}
              className="px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
              title="Tarik & perbarui data terbaru yang tersimpan di cloud"
            >
              <ArrowDownToLine className={`w-4 h-4 ${isPulling ? 'animate-bounce text-blue-600' : 'text-slate-600'}`} />
              <span>{isPulling ? 'Memuat Data Cloud...' : 'Tarik Data Terbaru Online'}</span>
            </button>

            {/* Push Sync Button for Admin */}
            {isAdmin && (
              <button
                type="button"
                onClick={handlePushSync}
                disabled={isProcessing || isPulling}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs transition-all shadow-md shadow-blue-600/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                title="Unggah seluruh perubahan lokal ke Cloud Database"
              >
                <ArrowUpToLine className={`w-4 h-4 ${isProcessing ? 'animate-bounce' : ''}`} />
                <span>{isProcessing ? 'Menyinkronkan...' : 'Unggah & Sinkronkan ke Cloud'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
