import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useApp } from '../../app/AppContext.jsx';
import AudioEngine from '../../services/audio.js';
const Context = createContext(null);
export function AudioProvider({ children }) {
  const { state } = useApp();
  const engine = useRef(null);
  const [enabled, setEnabled] = useState({ jazz: false, brown: false });
  const [error, setError] = useState('');
  useEffect(() => { engine.current = new AudioEngine(); return () => { engine.current?.destroy(); }; }, []);
  useEffect(() => { engine.current?.setVolumes(state.settings); }, [state.settings]);
  useEffect(() => {
    if (state.alertUntil > Date.now()) engine.current?.startAlert(state.alertUntil);
    else engine.current?.stopAlert();
  }, [state.alertUntil]);
  useEffect(() => {
    const unlock = () => { engine.current?.unlock().then(() => { if (state.alertUntil > Date.now() && !engine.current.alertTimer) engine.current.startAlert(state.alertUntil); }).catch(() => {}); };
    document.addEventListener('pointerdown', unlock);
    document.addEventListener('keydown', unlock);
    return () => { document.removeEventListener('pointerdown', unlock); document.removeEventListener('keydown', unlock); };
  }, [state.alertUntil]);
  const toggle = async key => {
    try { setEnabled(await engine.current.toggle(key)); setError(''); }
    catch { setError(key === 'jazz' ? 'Music could not start. Check the audio file or connection, then try again.' : 'Audio could not start. Tap the control again or check browser permissions.'); }
  };
  return <Context.Provider value={{ enabled, toggle, error }}>{children}</Context.Provider>;
}
export const useAudio = () => useContext(Context);
