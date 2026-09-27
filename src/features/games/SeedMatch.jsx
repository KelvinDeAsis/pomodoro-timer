import { useEffect, useRef, useState } from 'react';
import { useApp } from '../../app/AppContext.jsx';
import styles from './Games.module.css';
import { createDeck, isPair } from '../../utils/games.js';
export default function SeedMatch() {
  const { state, dispatch } = useApp();
  const [cards, setCards] = useState(createDeck); const [open, setOpen] = useState([]); const [matched, setMatched] = useState([]); const [moves, setMoves] = useState(0);
  const timer = useRef();
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (matched.length === 12 && (!state.scores.match || moves < state.scores.match)) dispatch({ type: 'SCORE', game: 'match', score: moves }); }, [matched.length, moves, state.scores.match, dispatch]);
  const reveal = id => {
    if (open.length === 2 || open.includes(id) || matched.includes(id)) return;
    const next = [...open, id]; setOpen(next);
    if (next.length === 2) {
      setMoves(n => n + 1);
      if (isPair(cards, next)) { setMatched(m => [...m, ...next]); setOpen([]); }
      else timer.current = setTimeout(() => setOpen([]), 900);
    }
  };
  const reset = () => { clearTimeout(timer.current); setCards(createDeck()); setOpen([]); setMatched([]); setMoves(0); };
  return <div className={styles.game}><div className={styles.info}><div><h3>Seed Match</h3><p>Find six pairs. There’s no rush.</p></div><span className="badge">{moves} moves</span></div><div className={styles.grid}>{cards.map(card => { const visible = open.includes(card.id) || matched.includes(card.id); return <button className={`${styles.card} ${visible ? styles.revealed : ''} ${matched.includes(card.id) ? styles.matched : ''}`} disabled={matched.includes(card.id)} key={card.id} aria-label={visible ? `${card.value}${matched.includes(card.id) ? ', matched' : ''}` : `Reveal card ${card.id + 1}`} onClick={() => reveal(card.id)}>{visible ? <><span className={styles.letter}>{card.value[0]}</span><span>{card.value}</span></> : <span className={styles.back}>?</span>}</button>; })}</div><div className={styles.bottom}><span role="status">{matched.length === 12 ? `All tucked away in ${moves} moves.` : `${matched.length / 2} / 6 pairs found`}{state.scores.match ? ` · Best: ${state.scores.match}` : ''}</span><button className="button small" onClick={reset}>Play again</button></div></div>;
}
