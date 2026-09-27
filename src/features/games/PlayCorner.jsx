import { useState } from 'react';
import DoodlePad from '../doodles/DoodlePad.jsx';
import SeedMatch from './SeedMatch.jsx';
import HamsterFeeding from './HamsterFeeding.jsx';
import Icon from '../../components/Icon.jsx';
export default function PlayCorner() {
  const [open, setOpen] = useState(false); const [tab, setTab] = useState('doodle');
  return <section id="play" className="panel play-corner" aria-labelledby="play-title"><button className="play-heading" aria-expanded={open} aria-controls="play-body" onClick={() => setOpen(!open)}><span className="play-heading-icon"><Icon name="brush" size={24} /></span><span className="play-heading-text"><h2 id="play-title">A little room to play</h2><span>Doodle, find a pair, or share a snack.</span></span><span className="play-label">{open ? 'Tuck away' : 'Open'}<Icon name="arrow" /></span></button>{open && <div id="play-body" className="play-body"><div className="play-tabs" role="group" aria-label="Activities">{[['doodle', 'Doodle pad'], ['match', 'Seed Match'], ['feeding', 'Snack time']].map(([value, label]) => <button key={value} className={tab === value ? 'selected' : ''} aria-pressed={tab === value} onClick={() => setTab(value)}>{label}</button>)}</div>{tab === 'doodle' ? <DoodlePad /> : tab === 'match' ? <SeedMatch /> : <HamsterFeeding />}</div>}</section>;
}
