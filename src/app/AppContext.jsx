import { createContext, useContext, useEffect, useReducer, useState } from 'react';
import { assetGet, assetPut, readState, writeState } from '../services/storage.js';
import { settle, timerAction } from '../utils/timer.js';

const Context = createContext(null);
function reducer(state, action) {
  const settled = settle(state, action.now ?? Date.now());
  if (action.type === 'TICK') return settled.alertUntil && settled.alertUntil <= Date.now() ? { ...settled, alertUntil: null } : settled;
  if (action.type === 'TASKS') return { ...settled, tasks: action.tasks };
  if (action.type === 'SCORE') return { ...settled, scores: { ...settled.scores, [action.game]: action.score } };
  if (action.type === 'APPEARANCE') return { ...settled, appearance: { ...settled.appearance, [settled.settings.theme]: action.value } };
  return timerAction(settled, action, action.now ?? Date.now());
}
export function AppProvider({ children }) {
  const [initial] = useState(() => readState());
  const [state, dispatch] = useReducer(reducer, initial.state);
  const [storageIssue, setStorageIssue] = useState(initial.issue);
  const [assets, setAssets] = useState({});
  useEffect(() => { const error = writeState(state); if (error) setStorageIssue(error); }, [state]);
  useEffect(() => {
    const tick = () => dispatch({ type: 'TICK' });
    const id = setInterval(tick, 500);
    document.addEventListener('visibilitychange', tick);
    return () => { clearInterval(id); document.removeEventListener('visibilitychange', tick); };
  }, []);
  useEffect(() => {
    let active = true;
    (async () => {
      const mapping = { 'hamster-focus-img': 'focus', 'comb-focus-img': 'focus', 'burrow-focus-img': 'focus', 'hamster-short-img': 'short', 'comb-short-img': 'short', 'burrow-short-img': 'short', 'hamster-long-img': 'long', 'comb-long-img': 'long', 'burrow-long-img': 'long', 'logo-img': 'logo', 'header-logo-img': 'logo', 'page-bg-image': 'background', 'panel-bg': 'panel' };
      try {
        for (const [key, value] of Object.entries(initial.legacyAssets || {})) if (mapping[key] && !(await assetGet(mapping[key]))) await assetPut(mapping[key], value);
        const result = {};
        for (const key of ['focus', 'short', 'long', 'logo', 'background', 'panel']) result[key] = await assetGet(key);
        if (active) setAssets(result);
      } catch { if (active) setStorageIssue('Artwork storage is unavailable. The default artwork still works.'); }
    })();
    return () => { active = false; };
  }, [initial]);
  const updateAsset = async (key, value) => {
    try { await assetPut(key, value); setAssets(current => ({ ...current, [key]: value })); }
    catch { setStorageIssue('The image could not be saved. Storage may be full.'); }
  };
  return <Context.Provider value={{ state, dispatch, storageIssue, assets, updateAsset }}>{children}</Context.Provider>;
}
export const useApp = () => useContext(Context);
