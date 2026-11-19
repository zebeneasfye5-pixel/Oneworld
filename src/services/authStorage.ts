import type { UserProfile } from '../components/AuthModal';
import { getApiUrl } from '../config/env';

const AUTH_USER_KEY = 'oneworld_auth_user';
const SESSION_TOKEN_KEY = 'oneworld_session_token';
const LOGGED_OUT_KEY = 'oneworld_explicit_logout';
const IDB_NAME = 'oneworld_persistent_auth';
const IDB_STORE = 'session';
const IDB_RECORD_KEY = 'current_user';

function openAuthDB(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === 'undefined') return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function writeIdbAuth(payload: { profile: UserProfile; sessionToken?: string }): Promise<void> {
  const db = await openAuthDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).put(payload, IDB_RECORD_KEY);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      resolve();
    }
  });
}

async function readIdbAuth(): Promise<{ profile: UserProfile; sessionToken?: string } | null> {
  const db = await openAuthDB();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readonly');
      const req = tx.objectStore(IDB_STORE).get(IDB_RECORD_KEY);
      req.onsuccess = () => {
        db.close();
        resolve(req.result || null);
      };
      req.onerror = () => {
        db.close();
        resolve(null);
      };
    } catch {
      resolve(null);
    }
  });
}

async function clearIdbAuth(): Promise<void> {
  const db = await openAuthDB();
  if (!db) return;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, 'readwrite');
      tx.objectStore(IDB_STORE).delete(IDB_RECORD_KEY);
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        resolve();
      };
    } catch {
      resolve();
    }
  });
}

function isValidPersistedUser(parsed: any): parsed is UserProfile {
  return !!(
    parsed &&
    typeof parsed === 'object' &&
    !parsed.isGuest &&
    (parsed.phoneNumber || parsed.idNumber || parsed.fullName)
  );
}

/**
 * Synchronously restore authenticated user from localStorage on boot.
 * Guarantees zero login prompt flashes across reloads and restarts.
 */
export function loadSyncAuth(): UserProfile | null {
  try {
    if (localStorage.getItem(LOGGED_OUT_KEY) === '1') {
      return null;
    }
    const saved = localStorage.getItem(AUTH_USER_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (isValidPersistedUser(parsed)) {
        return { ...parsed, isGuest: false };
      }
    }
  } catch {}
  return null;
}

/**
 * Persist authenticated user permanently across localStorage, IndexedDB, and cookies
 * until the user explicitly chooses to log out.
 */
export function savePersistentAuth(profile: UserProfile, sessionToken?: string): void {
  const normalized: UserProfile = { ...profile, isGuest: false };
  try {
    localStorage.setItem(LOGGED_OUT_KEY, '0');
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(normalized));
    if (sessionToken) {
      localStorage.setItem(SESSION_TOKEN_KEY, sessionToken);
    }
    const maxAge = 60 * 60 * 24 * 365; // 1 year
    document.cookie = `ow_auth_uid=${encodeURIComponent(normalized.idNumber || normalized.phoneNumber)}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
  } catch {}

  const effectiveToken =
    sessionToken ||
    (() => {
      try {
        return localStorage.getItem(SESSION_TOKEN_KEY) || undefined;
      } catch {
        return undefined;
      }
    })();

  writeIdbAuth({ profile: normalized, sessionToken: effectiveToken }).catch(() => {});
}

/**
 * Fallback async restoration from IndexedDB or server session cookie/token
 * in case browser/WebView evicted localStorage after sleep or OS restart.
 */
export async function restorePersistentAuthAsync(): Promise<UserProfile | null> {
  try {
    if (localStorage.getItem(LOGGED_OUT_KEY) === '1') {
      return null;
    }
  } catch {}

  let token: string | null = null;
  try {
    token = localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {}

  // 1. Check IndexedDB backup
  const idbData = await readIdbAuth();
  if (idbData?.profile && isValidPersistedUser(idbData.profile)) {
    savePersistentAuth(idbData.profile, idbData.sessionToken || token || undefined);
    return { ...idbData.profile, isGuest: false };
  }

  // 2. Check persistent backend session cookie / Bearer token
  try {
    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(getApiUrl('/api/auth/session'), {
      credentials: 'include',
      headers
    });
    if (res.ok) {
      const data = await res.json().catch(() => null);
      if (data?.profile && isValidPersistedUser(data.profile)) {
        savePersistentAuth(data.profile, data.sessionToken || token || undefined);
        return { ...data.profile, isGuest: false };
      }
    }
  } catch {
    // Offline or unreachable — stay safe
  }

  return null;
}

/**
 * Only invoked when the user explicitly clicks Log Out.
 */
export function clearPersistentAuth(): void {
  let token: string | null = null;
  try {
    token = localStorage.getItem(SESSION_TOKEN_KEY);
    localStorage.setItem(LOGGED_OUT_KEY, '1');
    localStorage.removeItem(AUTH_USER_KEY);
    localStorage.removeItem(SESSION_TOKEN_KEY);
    localStorage.removeItem('oneworld_house_memberships');
    localStorage.removeItem('oneworld_user_seat');
    document.cookie = 'ow_auth_uid=; Path=/; Max-Age=0; SameSite=Lax';
  } catch {}

  clearIdbAuth().catch(() => {});

  fetch(getApiUrl('/api/auth/logout'), {
    method: 'POST',
    credentials: 'include',
    headers: token ? { Authorization: `Bearer ${token}` } : undefined
  }).catch(() => {});
}
