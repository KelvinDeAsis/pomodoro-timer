import { useState } from 'react';
import { useApp } from '../../app/AppContext.jsx';
import Dialog from '../../components/Dialog.jsx';
export default function Appearance({ onClose }) {
  const { state, dispatch, assets, updateAsset } = useApp();
  const [error, setError] = useState('');
  const themeDefaults = { light: '#fff8ef', dark: '#302421', mono: '#111315' };
  const currentColor = state.appearance[state.settings.theme]?.color || themeDefaults[state.settings.theme];
  const upload = (key, file) => {
    if (!file) return;
    if (!['image/png', 'image/jpeg', 'image/gif', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) { setError('Choose a PNG, JPG, GIF, or WebP image under 5 MB.'); return; }
    const reader = new FileReader(); reader.onload = () => { updateAsset(key, reader.result); setError(''); }; reader.onerror = () => setError('This file could not be read.'); reader.readAsDataURL(file);
  };
  return <Dialog title="Make yourself at home" onClose={onClose}><p className="muted">A soft palette, or a quieter corner.</p><div className="theme-options" aria-label="Color palette">{[['light', 'Pink & cream', 'Soft, playful, and a little rosy.'], ['dark', 'Quiet cocoa', 'Warm brown with gentle contrast.'], ['mono', 'Midnight mono', 'Black, charcoal, and cool gray.']].map(([theme, title, hint]) => <button key={theme} className={`theme-option ${state.settings.theme === theme ? 'selected' : ''}`} aria-pressed={state.settings.theme === theme} onClick={() => dispatch({ type: 'SETTINGS', patch: { theme }, defer: true })}><span className={`theme-sample ${theme}`} /><strong>{title}</strong><span>{hint}</span></button>)}</div>
    <label className="toggle-row"><span>Show hamster artwork</span><input type="checkbox" checked={state.settings.showArt} onChange={e => dispatch({ type: 'SETTINGS', patch: { showArt: e.target.checked }, defer: true })} /></label>
    <div className="setting-section"><h3>Page color</h3><div className="color-control"><input type="color" aria-label="Page background color" value={/^#[0-9a-f]{6}$/i.test(currentColor) ? currentColor : themeDefaults.light} onChange={e => dispatch({ type: 'APPEARANCE', value: { color: e.target.value } })} /><button className="text-button" onClick={() => dispatch({ type: 'APPEARANCE', value: null })}>Reset this theme’s color</button></div><label className="setting"><span>Backdrop opacity · {state.settings.pageBgOpacity}%</span><input type="range" min="0" max="100" value={state.settings.pageBgOpacity} onChange={e => dispatch({ type: 'SETTINGS', patch: { pageBgOpacity: Number(e.target.value) }, defer: true })} /></label></div>
    <div className="setting-section"><h3>Your own artwork</h3><p className="hint">Uploads save on this device and work offline. Linked images imported from an older save still require their original connection.</p>{[['focus', 'Focus hamster'], ['short', 'Short-break hamster'], ['long', 'Long-break hamster'], ['logo', 'Header mark'], ['background', 'Page backdrop'], ['panel', 'Timer backdrop']].map(([key, title]) => <div className="asset-row" key={key}><label>{title}<input type="file" accept="image/png,image/jpeg,image/gif,image/webp" aria-label={`Upload ${title}`} onChange={e => upload(key, e.target.files[0])} /></label>{assets[key] && <button className="text-button" onClick={() => updateAsset(key, null)}>Reset</button>}</div>)}</div>
    {error && <p className="error" role="status">{error}</p>}<button className="button primary full" onClick={onClose}>Done</button>
  </Dialog>;
}
