/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Employee } from '../types/employee';
import { PuskesmasProfileData } from '../types/profileTerritory';
import { SPMIndicator } from '../types/spm';
import { EmployeeMonthlyAttendance } from '../types/attendance';
import {
  saveEmployeeToDb,
  deleteEmployeeFromDb,
  saveTerritoryToDb,
  saveSPMIndicatorToDb,
  saveAttendanceToDb,
  saveAttendanceBatch,
  saveEmployeesBatch,
  saveSPMBatch,
  testConnection,
  db
} from './firestoreDb';
import { collection, getDocs } from 'firebase/firestore';

export type SyncActionType = 
  | 'SAVE_EMPLOYEE'
  | 'DELETE_EMPLOYEE'
  | 'SAVE_TERRITORY'
  | 'SAVE_SPM'
  | 'SAVE_ATTENDANCE'
  | 'BATCH_ATTENDANCE'
  | 'BATCH_EMPLOYEES'
  | 'BATCH_SPM';

export interface PendingSyncItem {
  id: string;
  type: SyncActionType;
  title: string;
  payload: any;
  timestamp: string;
  attempts: number;
}

const QUEUE_STORAGE_KEY = 'simpeg_offline_sync_queue_v1';
const LAST_SYNC_KEY = 'simpeg_last_cloud_sync_timestamp';

/**
 * Get all queued offline mutations
 */
export function getPendingSyncQueue(): PendingSyncItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Error reading offline sync queue:', e);
    return [];
  }
}

/**
 * Save queue to localStorage
 */
function saveSyncQueue(queue: PendingSyncItem[]): void {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Error saving offline sync queue:', e);
  }
}

/**
 * Enqueue a mutation for later cloud synchronization
 */
export function enqueueSyncAction(type: SyncActionType, title: string, payload: any): void {
  const queue = getPendingSyncQueue();
  const newItem: PendingSyncItem = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    payload,
    timestamp: new Date().toISOString(),
    attempts: 0
  };

  // Optimization: If it's a SAVE_EMPLOYEE or SAVE_SPM for the same entity, replace previous pending item
  let filteredQueue = queue;
  if (type === 'SAVE_EMPLOYEE' && payload?.id) {
    filteredQueue = queue.filter(item => !(item.type === 'SAVE_EMPLOYEE' && item.payload?.id === payload.id));
  } else if (type === 'SAVE_SPM' && payload?.id) {
    filteredQueue = queue.filter(item => !(item.type === 'SAVE_SPM' && item.payload?.id === payload.id));
  } else if (type === 'SAVE_TERRITORY') {
    filteredQueue = queue.filter(item => item.type !== 'SAVE_TERRITORY');
  }

  filteredQueue.push(newItem);
  saveSyncQueue(filteredQueue);
}

/**
 * Clear the entire sync queue
 */
export function clearSyncQueue(): void {
  localStorage.removeItem(QUEUE_STORAGE_KEY);
}

/**
 * Get last synchronized timestamp
 */
export function getLastSyncTime(): string | null {
  return localStorage.getItem(LAST_SYNC_KEY);
}

/**
 * Update last synchronized timestamp
 */
export function recordLastSyncTime(): void {
  localStorage.setItem(LAST_SYNC_KEY, new Date().toISOString());
}

/**
 * Execute all pending offline actions against the cloud database
 */
export async function flushSyncQueue(
  onProgress?: (completed: number, total: number, currentItem: string) => void
): Promise<{ success: boolean; syncedCount: number; errors: any[] }> {
  const queue = getPendingSyncQueue();
  if (queue.length === 0) {
    recordLastSyncTime();
    return { success: true, syncedCount: 0, errors: [] };
  }

  const isOnline = await checkTrueOnlineStatus();
  if (!isOnline) {
    return { success: false, syncedCount: 0, errors: [new Error('Perangkat masih offline')] };
  }

  const remainingQueue: PendingSyncItem[] = [];
  const errors: any[] = [];
  let syncedCount = 0;

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    if (onProgress) {
      onProgress(i, queue.length, item.title);
    }

    try {
      switch (item.type) {
        case 'SAVE_EMPLOYEE':
          await saveEmployeeToDb(item.payload as Employee);
          break;
        case 'DELETE_EMPLOYEE':
          await deleteEmployeeFromDb(item.payload as string);
          break;
        case 'SAVE_TERRITORY':
          await saveTerritoryToDb(item.payload as PuskesmasProfileData);
          break;
        case 'SAVE_SPM':
          await saveSPMIndicatorToDb(item.payload as SPMIndicator);
          break;
        case 'SAVE_ATTENDANCE':
          await saveAttendanceToDb(item.payload as EmployeeMonthlyAttendance);
          break;
        case 'BATCH_ATTENDANCE':
          await saveAttendanceBatch(item.payload as EmployeeMonthlyAttendance[]);
          break;
        case 'BATCH_EMPLOYEES':
          await saveEmployeesBatch(item.payload as Employee[]);
          break;
        case 'BATCH_SPM':
          await saveSPMBatch(item.payload as SPMIndicator[]);
          break;
        default:
          break;
      }
      syncedCount++;
    } catch (err) {
      console.warn(`Failed to sync item ${item.id} (${item.title}):`, err);
      item.attempts += 1;
      remainingQueue.push(item);
      errors.push(err);
    }
  }

  saveSyncQueue(remainingQueue);
  if (remainingQueue.length === 0) {
    recordLastSyncTime();
  }

  if (onProgress) {
    onProgress(queue.length, queue.length, 'Sinkronisasi selesai');
  }

  return {
    success: remainingQueue.length === 0,
    syncedCount,
    errors
  };
}

/**
 * Check if the browser is truly connected to the internet & Firebase
 */
export async function checkTrueOnlineStatus(): Promise<boolean> {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return false;
  }
  try {
    return await testConnection();
  } catch {
    return false;
  }
}

/**
 * Pull fresh cloud data from Firestore to update local data for online users
 */
export async function fetchFreshCloudData(): Promise<{
  employees?: Employee[];
  territory?: PuskesmasProfileData;
  spm?: SPMIndicator[];
}> {
  const result: {
    employees?: Employee[];
    territory?: PuskesmasProfileData;
    spm?: SPMIndicator[];
  } = {};

  try {
    // 1. Fetch Employees
    const empSnap = await getDocs(collection(db, 'employees'));
    if (!empSnap.empty) {
      const empList: Employee[] = [];
      empSnap.forEach(docSnap => {
        const d = docSnap.data() as Employee;
        if (d && d.id && d.fullName) {
          empList.push(d);
        }
      });
      if (empList.length > 0) {
        result.employees = empList;
      }
    }

    // 2. Fetch Territory
    const terSnap = await getDocs(collection(db, 'territory'));
    if (!terSnap.empty) {
      terSnap.forEach(docSnap => {
        const d = docSnap.data() as PuskesmasProfileData;
        if (d && d.villages && d.villages.length > 0) {
          result.territory = d;
        }
      });
    }

    // 3. Fetch SPM
    const spmSnap = await getDocs(collection(db, 'spm'));
    if (!spmSnap.empty) {
      const spmList: SPMIndicator[] = [];
      spmSnap.forEach(docSnap => {
        const d = docSnap.data() as SPMIndicator;
        if (d && d.id && (d.name || d.shortTitle)) {
          spmList.push(d);
        }
      });
      if (spmList.length > 0) {
        spmList.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
        result.spm = spmList;
      }
    }

    recordLastSyncTime();
  } catch (err) {
    console.error('Error pulling fresh cloud data:', err);
    throw err;
  }

  return result;
}

/**
 * Setup event listeners for network changes & automatic sync
 */
export function setupNetworkListeners(
  onStatusChange: (isOnline: boolean) => void,
  onAutoSyncCompleted?: (syncedCount: number) => void
): () => void {
  const handleOnline = async () => {
    const isReallyOnline = await checkTrueOnlineStatus();
    onStatusChange(isReallyOnline);
    if (isReallyOnline) {
      // Auto flush pending queue
      const queue = getPendingSyncQueue();
      if (queue.length > 0) {
        const res = await flushSyncQueue();
        if (res.syncedCount > 0 && onAutoSyncCompleted) {
          onAutoSyncCompleted(res.syncedCount);
        }
      }
    }
  };

  const handleOffline = () => {
    onStatusChange(false);
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
