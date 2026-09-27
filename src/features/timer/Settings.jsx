import { useState } from 'react';
import { useApp } from '../../app/AppContext.jsx';
import Dialog from '../../components/Dialog.jsx';
export default function Settings({ onClose }) {
  const { state, dispatch } = useApp();
  const { settings, session } = state;
  const [changed, setChanged] = useState(false);
  const update = patch => dispatch({ type: 'SETTINGS', patch, defer: true });
  return <Dialog title="Timer settings" onClose={onClose}>
    <p className="muted">Make a rhythm that works for you.</p>
    <div className="settings-grid">{[['focus', 'Focus', 180], ['short', 'Short break', 180], ['long', 'Long break', 180], ['interval', 'Long break after', 8]].map(([key, label, max]) => <label className="setting" key={key}><span>{label}</span><div className="number-field"><input type="number" min={key === 'interval' ? 2 : 1} max={max} value={settings[key]} onChange={event => { const value = Number(event.target.value); if (Number.isInteger(value) && value >= (key === 'interval' ? 2 : 1) && value <= max) { update({ [key]: value }); if (key !== 'interval') setChanged(true); } }} /><span>{key === 'interval' ? 'sessions' : 'min'}</span></div></label>)}</div>
    {changed && <div className="notice"><p>New lengths apply to the next session. Apply now resets the current session to its full new length{session.running ? ' and keeps it running' : ''}.</p><button className="button small" onClick={() => { dispatch({ type: 'APPLY_LENGTH' }); setChanged(false); }}>Apply now</button></div>}
    <div className="setting-section"><h3>Session alert</h3><label className="toggle-row"><span>Sound after every session</span><input type="checkbox" checked={settings.sound} onChange={e => update({ sound: e.target.checked })} /></label><label className="setting"><span>Alert volume · {settings.alertVolume}%</span><input type="range" min="0" max="100" value={settings.alertVolume} onChange={e => update({ alertVolume: Number(e.target.value) })} /></label><p className="hint">A gentle chime repeats for 60 seconds. Stop it on the timer. Each next session waits for you to press Start.</p></div>
    <button className="button primary full" onClick={onClose}>Done</button>
  </Dialog>;
}
