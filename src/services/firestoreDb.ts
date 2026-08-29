import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot, 
  writeBatch,
  getDocFromServer
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { Employee } from '../types/employee';
import { PuskesmasProfileData } from '../types/profileTerritory';
import { SPMIndicator } from '../types/spm';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Use named database if specified in config, otherwise default
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export const auth = getAuth(app);

const EMPLOYEES_COLLECTION = 'employees';
const TERRITORY_COLLECTION = 'territory';
const TERRITORY_DOC_ID = 'main_profile_territory';
const SPM_COLLECTION = 'spm';

export type SyncStatus = 'connected' | 'syncing' | 'offline' | 'error';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Log:', JSON.stringify(errInfo));
  return errInfo;
}

// Test Cloud Database connectivity on boot
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'employees', '_test_conn_ping'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Firestore status: Client is offline or network restricted.");
    }
    return false;
  }
}

/**
 * Real-time listener for Employee records with automatic failover
 */
export function subscribeEmployees(
  onSuccess: (employees: Employee[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, EMPLOYEES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: Employee[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as Employee;
          if (data && data.id && data.fullName) {
            list.push(data);
          }
        });
        if (list.length > 0) {
          onSuccess(list);
        }
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, EMPLOYEES_COLLECTION);
      if (onError) onError(err);
    }
  );
}

/**
 * Save / Update a single employee with data locking
 */
export async function saveEmployeeToDb(employee: Employee): Promise<void> {
  const docPath = `${EMPLOYEES_COLLECTION}/${employee.id}`;
  try {
    const docRef = doc(db, EMPLOYEES_COLLECTION, employee.id);
    await setDoc(docRef, {
      ...employee,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
    throw err;
  }
}

/**
 * Delete an employee record
 */
export async function deleteEmployeeFromDb(employeeId: string): Promise<void> {
  const docPath = `${EMPLOYEES_COLLECTION}/${employeeId}`;
  try {
    const docRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, docPath);
    throw err;
  }
}

/**
 * Batch save all employees (for imports, initial sync, or mass update)
 */
export async function saveEmployeesBatch(employees: Employee[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    employees.forEach((emp) => {
      const docRef = doc(db, EMPLOYEES_COLLECTION, emp.id);
      batch.set(docRef, {
        ...emp,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, EMPLOYEES_COLLECTION);
    throw err;
  }
}

/**
 * Real-time listener for Territory & Profile
 */
export function subscribeTerritory(
  onSuccess: (data: PuskesmasProfileData) => void,
  onError?: (err: Error) => void
) {
  const docPath = `${TERRITORY_COLLECTION}/${TERRITORY_DOC_ID}`;
  const docRef = doc(db, TERRITORY_COLLECTION, TERRITORY_DOC_ID);
  return onSnapshot(
    docRef,
    (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as PuskesmasProfileData;
        if (data && data.villages && data.villages.length > 0) {
          onSuccess(data);
        }
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, docPath);
      if (onError) onError(err);
    }
  );
}

/**
 * Save Territory Profile
 */
export async function saveTerritoryToDb(data: PuskesmasProfileData): Promise<void> {
  const docPath = `${TERRITORY_COLLECTION}/${TERRITORY_DOC_ID}`;
  try {
    const docRef = doc(db, TERRITORY_COLLECTION, TERRITORY_DOC_ID);
    await setDoc(docRef, {
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
    throw err;
  }
}

/**
 * Real-time listener for 12 SPM Indicators
 */
export function subscribeSPM(
  onSuccess: (indicators: SPMIndicator[]) => void,
  onError?: (err: Error) => void
) {
  const colRef = collection(db, SPM_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      if (!snapshot.empty) {
        const list: SPMIndicator[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as SPMIndicator;
          if (data && data.id && (data.name || data.shortTitle)) {
            list.push(data);
          }
        });
        if (list.length > 0) {
          list.sort((a, b) => a.id.localeCompare(b.id, undefined, { numeric: true }));
          onSuccess(list);
        }
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, SPM_COLLECTION);
      if (onError) onError(err);
    }
  );
}

/**
 * Save / Update a single SPM Indicator
 */
export async function saveSPMIndicatorToDb(indicator: SPMIndicator): Promise<void> {
  const docPath = `${SPM_COLLECTION}/${indicator.id}`;
  try {
    const docRef = doc(db, SPM_COLLECTION, indicator.id);
    await setDoc(docRef, {
      ...indicator,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, docPath);
    throw err;
  }
}

/**
 * Batch save all SPM Indicators
 */
export async function saveSPMBatch(indicators: SPMIndicator[]): Promise<void> {
  try {
    const batch = writeBatch(db);
    indicators.forEach((ind) => {
      const docRef = doc(db, SPM_COLLECTION, ind.id);
      batch.set(docRef, {
        ...ind,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    });
    await batch.commit();
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, SPM_COLLECTION);
    throw err;
  }
}

/**
 * Seed initial database records if collections are empty on first run
 */
export async function seedInitialDatabaseIfEmpty(
  initialEmployees: Employee[],
  initialTerritory: PuskesmasProfileData,
  initialSPM: SPMIndicator[]
): Promise<void> {
  try {
    // Check employees collection
    const empSnap = await getDocs(collection(db, EMPLOYEES_COLLECTION));
    if (empSnap.empty && initialEmployees.length > 0) {
      console.log('Seeding initial employees to Cloud Database...');
      await saveEmployeesBatch(initialEmployees);
    }

    // Check SPM collection
    const spmSnap = await getDocs(collection(db, SPM_COLLECTION));
    if (spmSnap.empty && initialSPM.length > 0) {
      console.log('Seeding initial 12 SPM data to Cloud Database...');
      await saveSPMBatch(initialSPM);
    }

    // Check Territory doc
    const territorySnap = await getDocs(collection(db, TERRITORY_COLLECTION));
    if (territorySnap.empty) {
      console.log('Seeding initial territory profile to Cloud Database...');
      await saveTerritoryToDb(initialTerritory);
    }
  } catch (err) {
    console.warn('Auto-seed check note:', err);
  }
}

