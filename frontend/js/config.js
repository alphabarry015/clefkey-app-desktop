/**
 * Configuration client (desktop Tauri / UI isolée).
 *
 * Sécurité : seules des bases API en allowlist sont acceptées
 * (évite qu’un XSS / override localStorage pointe vers un serveur pirate).
 *
 * Override runtime (hôte autorisé uniquement) :
 *   localStorage.setItem('clefkey_api_base', 'https://clefkey.vercel.app')
 */

/** API production (build téléchargeable). */
export const DEFAULT_DESKTOP_API_BASE = 'https://clefkey.vercel.app';

/** API locale quand on sert l’UI sur :1420. */
export const DEFAULT_DEV_API_BASE = 'http://localhost:8000';

/** Hôtes API autorisés (pas de wildcards). */
const ALLOWED_API_HOSTS = new Set([
  'clefkey.vercel.app',
  'localhost',
  '127.0.0.1',
]);

export function isDesktopOrIsolatedFrontend() {
  if (typeof window === 'undefined') return false;
  if (window.__TAURI_INTERNALS__ || window.__TAURI__) return true;
  const { protocol, hostname, port } = window.location;
  if (protocol === 'tauri:' || protocol === 'asset:') return true;
  if (hostname === 'tauri.localhost') return true;
  if ((hostname === 'localhost' || hostname === '127.0.0.1') && port === '1420') {
    return true;
  }
  return false;
}

function isLocalDevFrontend() {
  if (typeof window === 'undefined') return false;
  const { hostname, port } = window.location;
  return (hostname === 'localhost' || hostname === '127.0.0.1') && port === '1420';
}

/**
 * Valide une base API : schéma, hôte allowlist, pas de credentials/path/query.
 * @returns {string|null} URL normalisée sans slash final, ou null
 */
export function sanitizeApiBase(raw) {
  if (!raw || typeof raw !== 'string') return null;
  let parsed;
  try {
    parsed = new URL(raw.trim());
  } catch {
    return null;
  }
  if (parsed.username || parsed.password) return null;
  if (parsed.search || parsed.hash) return null;
  if (parsed.pathname && parsed.pathname !== '/') return null;
  if (!ALLOWED_API_HOSTS.has(parsed.hostname)) return null;

  const isLoopback = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1';
  if (isLoopback) {
    if (parsed.protocol !== 'http:') return null;
    const port = parsed.port || '80';
    if (port !== '8000') return null;
  } else if (parsed.protocol !== 'https:') {
    return null;
  }

  return `${parsed.protocol}//${parsed.host}`.replace(/\/$/, '');
}

/** Base URL de l’API (sans slash final). */
export function getApiBase() {
  try {
    const stored = localStorage.getItem('clefkey_api_base');
    const safe = sanitizeApiBase(stored);
    if (safe) return safe;
    if (stored) {
      try {
        localStorage.removeItem('clefkey_api_base');
      } catch {
        /* ignore */
      }
    }
  } catch {
    /* private mode / storage indisponible */
  }

  if (typeof window !== 'undefined' && window.__CLEFKEY_API_BASE__) {
    const safe = sanitizeApiBase(String(window.__CLEFKEY_API_BASE__));
    if (safe) return safe;
  }

  if (isDesktopOrIsolatedFrontend()) {
    return isLocalDevFrontend() ? DEFAULT_DEV_API_BASE : DEFAULT_DESKTOP_API_BASE;
  }

  return window.location.origin;
}

/** Ping rapide `/health/` — retourne true si l’API répond. */
export async function pingApi(timeoutMs = 2500) {
  const base = getApiBase();
  const ctrl = typeof AbortController !== 'undefined' ? new AbortController() : null;
  const timer = ctrl ? setTimeout(() => ctrl.abort(), timeoutMs) : null;
  try {
    const resp = await fetch(`${base}/health/`, {
      method: 'GET',
      signal: ctrl ? ctrl.signal : undefined,
      headers: { Accept: 'application/json' },
      cache: 'no-store',
      credentials: 'omit',
      mode: 'cors',
    });
    return resp.ok;
  } catch {
    return false;
  } finally {
    if (timer) clearTimeout(timer);
  }
}
