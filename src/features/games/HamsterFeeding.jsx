import { useEffect, useState } from 'react';
import { useApp } from '../../app/AppContext.jsx';
import styles from './Games.module.css';
const snacks = ['Hello Panda', 'Choco Banana', 'Woo Samgyup'];
const nextSnack = () => snacks[Math.floor(Math.random() * snacks.length)];
export default function HamsterFeeding() {
  const { state, dispatch } = useApp();
  const [wanted, setWanted] = useState(nextSnack); const [round, setRound] = useState(0); const [score, setScore] = useState(0); const [message, setMessage] = useState('');
  useEffect(() => { if (round === 10 && score > (state.scores.feeding || 0)) dispatch({ type: 'SCORE', game: 'feeding', score }); }, [round, score, state.scores.feeding, dispatch]);
  const feed = snack => { const right = snack === wanted; setScore(s => s + Number(right)); setRound(r => r + 1); setMessage(right ? 'A happy little nibble.' : `Our hamster wanted a ${wanted.toLowerCase()}.`); setWanted(nextSnack()); };
  return <div className={styles.game}><div className={styles.info}><div><h3>Snack time</h3><p>A pretend snack for a pretend hamster.</p></div><span className="badge">{Math.min(round + 1, 10)} / 10</span></div><div className={styles.feeding}><img src={`${import.meta.env.BASE_URL}images/hamster1.png`} alt="A playful hamster"/><p className={styles.bubble}>{round === 10 ? `Thank you! ${score} / 10 happy nibbles.` : `A ${wanted.toLowerCase()}, please!`}</p></div><div className={styles.snacks}>{snacks.map(snack => <button className="button" disabled={round === 10} key={snack} onClick={() => feed(snack)}>{snack}</button>)}</div><p className={styles.feedback} role="status">{message || 'Choose the snack our hamster asked for.'}</p><div className={styles.bottom}><span>Best: {state.scores.feeding || 0} / 10</span><button className="button small" onClick={() => { setRound(0); setScore(0); setMessage(''); setWanted(nextSnack()); }}>Play again</button></div></div>;
}
