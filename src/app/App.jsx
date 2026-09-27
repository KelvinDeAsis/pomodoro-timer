import { useEffect, useState } from 'react';
import { useApp } from './AppContext.jsx';
import { AudioProvider } from '../features/audio/AudioContext.jsx';
import Timer from '../features/timer/Timer.jsx';
import Settings from '../features/timer/Settings.jsx';
import Tasks from '../features/tasks/Tasks.jsx';
import Ambient from '../features/audio/Ambient.jsx';
import PlayCorner from '../features/games/PlayCorner.jsx';
import Appearance from '../features/appearance/Appearance.jsx';
import Icon from '../components/Icon.jsx';
import ArtImage from '../components/ArtImage.jsx';
import usePwa from '../hooks/usePwa.js';

export default function App() {
  const { state, dispatch, storageIssue, assets } = useApp();
  const [dialog, setDialog] = useState(null);
  const pwa = usePwa();
  const darkTheme = state.settings.theme !== 'light';
  useEffect(() => {
    document.documentElement.dataset.theme = state.settings.theme;
    const colors = { light: '#f8d6dc', dark: '#302421', mono: '#111315' };
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', colors[state.settings.theme]);
  }, [state.settings.theme]);
  const pageColor = state.appearance[state.settings.theme]?.color;
  return <AudioProvider><a className="skip-link" href="#focus">Skip to timer</a><div className="app-shell" style={pageColor ? { backgroundColor: pageColor } : undefined}>
    {assets.background && <div className="custom-backdrop" style={{ opacity: state.settings.pageBgOpacity / 100 }}><ArtImage src={assets.background} alt="" /></div>}
    <header className="site-header"><a className="brand" href="#focus"><span className="brand-image"><ArtImage src={assets.logo || `${import.meta.env.BASE_URL}images/hamster1.png`} alt="" /></span><span>Hamster<br className="mobile-brand-break" /> Pomodoro<span className="brand-period">.</span></span></a><nav aria-label="Main navigation"><a className="nav-link" href="#focus">Focus</a><a className="nav-link" href="#play">Play corner</a><span className="nav-divider"/><button className="icon-button" aria-label={darkTheme ? 'Switch to pink and cream theme' : 'Switch to black and gray theme'} title={darkTheme ? 'Pink & cream' : 'Midnight mono'} onClick={() => dispatch({ type: 'SETTINGS', patch: { theme: darkTheme ? 'light' : 'mono' }, defer: true })}><Icon name={darkTheme ? 'sun' : 'moon'} /></button><button className="icon-button" onClick={() => setDialog('appearance')} aria-label="Customize appearance" title="Make yourself at home"><Icon name="brush" /></button></nav></header>
    <main className="main"><div className="welcome"><div><span className="eyebrow">A SOFTER WAY TO STUDY</span><h1>Time to focus, avoid distractions<span className="headline-period">.</span></h1><p>Settle in. Pick a task. We’ll keep you company.</p></div><div className="welcome-note" aria-hidden="true"><span>one small thing<br />at a time.</span></div></div>
      {storageIssue && <p className="notice" role="status">{storageIssue}</p>}
      <div className="workspace"><div className="timer-column">{assets.panel && <div className="timer-custom-art" style={{ opacity: state.settings.pageBgOpacity / 100 }}><ArtImage src={assets.panel} alt="" /></div>}<Timer openSettings={() => setDialog('settings')} /></div><aside className="side-column"><Tasks /><Ambient /></aside></div>
      <div className="gentle-note"><span className="note-rule"/><p>A break is part of the work, too.</p><span className="note-rule"/></div>
      <PlayCorner />
    </main>
    <footer className="site-footer"><span>A little focus. A little rest.</span><div className="footer-actions"><span className="connection-state">{!pwa.online ? (pwa.offlineReady ? 'Offline · ready to study' : 'Offline · setup incomplete') : pwa.offlineReady ? 'Offline ready' : import.meta.env.DEV ? 'Development preview' : 'Preparing offline mode…'}</span>{pwa.installPrompt && <button className="text-button" onClick={pwa.install}>Install app</button>}</div></footer>
    {pwa.error && <p className="pwa-message" role="status">{pwa.error}</p>}
    {pwa.updateAvailable && <div className="update-banner" role="status"><span>{state.session.running || state.alertUntil > Date.now() ? 'An update is ready. Finish your session first.' : 'A fresh version is ready.'}</span><button className="button small" disabled={state.session.running || state.alertUntil > Date.now()} onClick={pwa.update}>Update</button></div>}
    {dialog === 'settings' && <Settings onClose={() => setDialog(null)} />}{dialog === 'appearance' && <Appearance onClose={() => setDialog(null)} />}
  </div></AudioProvider>;
}
