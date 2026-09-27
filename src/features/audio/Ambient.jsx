import { useApp } from '../../app/AppContext.jsx';
import { useAudio } from './AudioContext.jsx';
import Icon from '../../components/Icon.jsx';
import styles from './Ambient.module.css';
export default function Ambient() {
  const { state, dispatch } = useApp();
  const { enabled, toggle, error } = useAudio();
  return <section className={`panel ${styles.ambient}`} aria-labelledby="ambient-title"><div className="section-title"><h2 id="ambient-title">Set the mood</h2><Icon name="music" /></div><p className="muted">A soft soundtrack for your thoughts.</p>
    {[['jazz', 'Jazz lofi', 'Warm keys & a slow groove', 'music'], ['brown', 'Brown noise', 'A low, steady hush', 'noise']].map(([key, title, caption, icon]) => <div className={styles.track} key={key}><div className={styles.row}><span className={styles.trackIcon}><Icon name={icon} /></span><div className={styles.label}><strong>{title}</strong><span>{caption}</span></div><button className={styles.toggle} aria-label={`${enabled[key] ? 'Pause' : 'Play'} ${title}`} aria-pressed={enabled[key]} onClick={() => toggle(key)}><Icon name={enabled[key] ? 'pause' : 'play'} size={17} /></button></div><div className={styles.volume}><input type="range" min="0" max="100" aria-label={`${title} volume`} value={state.settings[`${key}Volume`]} onChange={e => dispatch({ type: 'SETTINGS', patch: { [`${key}Volume`]: Number(e.target.value) }, defer: true })} /><span>{state.settings[`${key}Volume`]}%</span></div></div>)}
    {error && <p className="error" role="status">{error}</p>}
    <p className={styles.note}>Mix them together, or enjoy just one.</p>
    <details className={styles.credit}><summary>Music credit</summary><p>“Late Night Radio” by Kevin MacLeod (<a href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN2100003&Search=Search" target="_blank" rel="noreferrer">incompetech.com</a>). <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>. Soft low-pass processing applied for playback.</p></details>
  </section>;
}
