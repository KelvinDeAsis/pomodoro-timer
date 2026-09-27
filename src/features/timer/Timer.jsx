import { useEffect } from 'react';
import { useApp } from '../../app/AppContext.jsx';
import useClock from '../../hooks/useClock.js';
import { formatTime, localDay, modeLabels, remainingTime } from '../../utils/timer.js';
import Icon from '../../components/Icon.jsx';
import ArtImage from '../../components/ArtImage.jsx';
import styles from './Timer.module.css';

export default function Timer({ openSettings }) {
  const { state, dispatch, assets } = useApp();
  const now = useClock();
  const { session, settings } = state;
  const seconds = remainingTime(session, now);
  const progress = Math.max(0, Math.min(1, 1 - seconds / session.length));
  const alerting = state.alertUntil > now;
  useEffect(() => { document.title = `${formatTime(seconds)} · Hamster Pomodoro`; }, [seconds]);
  const art = assets[session.mode] || `${import.meta.env.BASE_URL}images/${{ focus: 'hamsterstudying.gif', short: 'hamstershortbreak.gif', long: 'hamstermakeup.gif' }[session.mode]}`;
  const caption = session.running
    ? (session.mode === 'focus' ? 'One small thing at a time.' : 'You have time to take a breath.')
    : session.lastCompletedMode
      ? `${modeLabels[session.lastCompletedMode]} complete. Ready when you are.`
      : session.mode === 'focus'
        ? 'A little focus goes a long way.'
        : 'You have time to take a breath.';
  return <section id="focus" className={`panel ${styles.timer}`} aria-label="Pomodoro timer">
    <div className={styles.topline}><span className="eyebrow">YOUR LITTLE FOCUS CORNER</span><button className="icon-button" onClick={openSettings} aria-label="Timer settings"><Icon name="settings" /></button></div>
    <div className={styles.tabs} role="group" aria-label="Session mode">{Object.entries(modeLabels).map(([mode, label]) => <button key={mode} aria-pressed={session.mode === mode} className={session.mode === mode ? styles.active : ''} onClick={() => dispatch({ type: 'MODE', mode })}>{label}</button>)}</div>
    <div className={styles.scene}>
      <span className={styles.sceneNote}>{session.mode === 'focus' ? 'shh… studying' : 'a well-earned rest'}</span>
      <div className={`${styles.artWindow} ${session.running ? styles.running : ''}`} style={{ '--progress': `${progress * 360}deg` }}>
        {settings.showArt ? <ArtImage src={art} alt={session.mode === 'focus' ? 'A hamster studying' : 'A hamster resting'} /> : <Icon name="music" size={52} />}
      </div>
      <span className={styles.sessionNumber}>session {Math.min(session.cycleCount + 1, settings.interval)} / {settings.interval}</span>
    </div>
    <div className={styles.clock} role="timer" aria-label={`${modeLabels[session.mode]}: ${formatTime(seconds)} remaining`}>{formatTime(seconds)}</div>
    <p className={styles.caption} aria-live="polite">{caption}</p>
    <div className={styles.controls}><button className="button primary" onClick={() => dispatch({ type: session.running ? 'PAUSE' : 'START' })}><Icon name={session.running ? 'pause' : 'play'} />{session.running ? 'Pause' : 'Start focus'.replace('focus', session.mode === 'focus' ? 'focus' : 'break')}</button><button className="icon-button" aria-label="Reset timer" onClick={() => dispatch({ type: 'RESET' })}><Icon name="reset" /></button></div>
    {alerting && <div className={styles.alert} role="status"><span>Session complete</span><button className="button" onClick={() => dispatch({ type: 'STOP_ALERT' })}>Stop alert</button></div>}
    <div className={styles.footer}><span className={styles.pips} aria-hidden="true">{Array.from({ length: settings.interval }, (_, i) => <i className={i < session.cycleCount ? styles.filled : ''} key={i} />)}</span><span><strong>{state.totals[localDay()] || 0}</strong> focus sessions today</span></div>
  </section>;
}
