import { clamp, localDay, settle } from '../utils/timer.js';

export const STORAGE_KEY = 'hamsterPomodoro.react.v1';
export const legacyKeys = ['burrowClub.v1', 'hollowbackApiary.v1', 'hamsterPomodoro.v3'];
export const freshState = () => ({
  settings: { focus: 25, short: 5, long: 15, interval: 4, sound: true, alertVolume: 50, jazzVolume: 35, brownVolume: 25, theme: 'light', showArt: true, pageBgOpacity: 25 },
  session: { mode: 'focus', remaining: 1500, length: 1500, running: false, deadline: null, completed: 0, cycleCount: 0 },
  tasks: [], totals: {}, scores: {}, appearance: { light: null, dark: null, mono: null }, alertUntil: null,
});

export function normalize(raw, legacy = false) {
  const base = freshState();
  if (!raw || typeof raw !== 'object') return base;
  const source = raw.settings || {};
  const settings = { ...base.settings, ...source };
  for (const key of ['focus', 'short', 'long']) settings[key] = clamp(settings[key], 1, 180, base.settings[key]);
  settings.interval = clamp(settings.interval, 2, 8, 4);
  for (const key of ['alertVolume', 'jazzVolume', 'brownVolume', 'pageBgOpacity']) settings[key] = clamp(settings[key], 0, 100, base.settings[key]);
  settings.theme = legacy ? (source.darkMode ? 'dark' : 'light') : ['light', 'dark', 'mono'].includes(settings.theme) ? settings.theme : 'light';
  settings.showArt = settings.showArt !== false;
  settings.sound = settings.sound !== false;
  const s = raw.session || {};
  const mode = ['focus', 'short', 'long'].includes(s.mode) ? s.mode : 'focus';
  const session = { ...base.session, ...s, mode, remaining: clamp(s.remaining ?? settings[mode] * 60, 1, 10800, settings[mode] * 60), length: clamp(s.length ?? Math.max(s.remaining || 0, settings[mode] * 60), 1, 10800, settings[mode] * 60),
    running: !legacy && s.running === true && Number.isFinite(s.deadline),
    deadline: !legacy && Number.isFinite(s.deadline) ? s.deadline : null,
    completed: clamp(s.completed ?? 0, 0, 1000000, 0), cycleCount: clamp(s.cycleCount ?? 0, 0, 8, 0) };
  const tasks = Array.isArray(raw.tasks) ? raw.tasks.filter(t => t && typeof t.text === 'string').map((t, i) => ({ id: String(t.id || `legacy-${i}`), text: t.text.slice(0, 120), done: Boolean(t.done) })) : [];
  const totals = Object.fromEntries(Object.entries(raw.totals || {}).filter(([key, value]) => /^\d{4}-\d{1,2}-\d{1,2}$/.test(key) && Number.isFinite(value) && value >= 0));
  if (legacy && session.completed) totals[localDay()] = session.completed;
  return { ...base, settings, session, tasks, totals, scores: raw.scores || {}, appearance: { ...base.appearance, ...(raw.appearance || raw.bgColor || {}) },
    alertUntil: !legacy && Number.isFinite(raw.alertUntil) ? raw.alertUntil : null };
}

export function readState(storage = globalThis.localStorage) {
  let issue = '';
  try {
    const saved = storage.getItem(STORAGE_KEY);
    if (saved) return { state: settle(normalize(JSON.parse(saved))), issue };
    for (const key of legacyKeys) {
      const old = storage.getItem(key);
      if (old) { const parsed = JSON.parse(old); return { state: normalize(parsed, true), legacyAssets: parsed.assets || {}, issue }; }
    }
  } catch { issue = 'Saved data could not be read. Changes may not survive a reload.'; }
  return { state: freshState(), issue };
}

export function writeState(state) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return ''; }
  catch { return 'Storage is unavailable or full. Current changes may not survive a reload.'; }
}

let database;
function db() {
  if (!database) database = new Promise((resolve, reject) => {
    const request = indexedDB.open('hamster-pomodoro-assets', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('assets');
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => { database = null; reject(request.error); };
  });
  return database;
}
export async function assetGet(key) {
  const database = await db();
  return new Promise((resolve, reject) => { const r = database.transaction('assets').objectStore('assets').get(key); r.onsuccess = () => resolve(r.result); r.onerror = () => reject(r.error); });
}
export async function assetPut(key, value) {
  const database = await db();
  return new Promise((resolve, reject) => {
    const tx = database.transaction('assets', 'readwrite');
    if (value == null) tx.objectStore('assets').delete(key); else tx.objectStore('assets').put(value, key);
    tx.oncomplete = () => resolve(); tx.onerror = () => reject(tx.error);
  });
}
