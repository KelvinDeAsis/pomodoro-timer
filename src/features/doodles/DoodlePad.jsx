import { useEffect, useRef, useState } from 'react';
import { assetGet, assetPut } from '../../services/storage.js';
import Icon from '../../components/Icon.jsx';
import styles from './DoodlePad.module.css';
const colors = ['#67483d', '#cf637e', '#e3a04d', '#568476', '#7988b8', '#a780a8'];
export default function DoodlePad() {
  const canvas = useRef(); const drawing = useRef(false); const history = useRef([]); const loaded = useRef(false);
  const [color, setColor] = useState(colors[0]); const [size, setSize] = useState(5); const [eraser, setEraser] = useState(false);
  const [status, setStatus] = useState('Loading your page…'); const [undos, setUndos] = useState(0);
  const saveTimer = useRef(); const saveChain = useRef(Promise.resolve());
  useEffect(() => {
    let active = true;
    const ctx = canvas.current.getContext('2d'); ctx.fillStyle = '#fffdf9'; ctx.fillRect(0, 0, 1000, 440);
    assetGet('doodle').then(async blob => {
      if (blob && active) { const img = await createImageBitmap(blob); if (active) ctx.drawImage(img, 0, 0); img.close(); }
      if (active) { loaded.current = true; setStatus('Saved on this device'); }
    }).catch(() => { if (active) { loaded.current = true; setStatus('Storage unavailable. Export to keep your doodle.'); } });
    return () => { active = false; clearTimeout(saveTimer.current); };
  }, []);
  const save = () => {
    const node = canvas.current;
    setStatus('Saving…');
    node.toBlob(blob => {
      saveChain.current = saveChain.current.catch(() => {}).then(() => assetPut('doodle', blob));
      saveChain.current.then(() => setStatus('Saved on this device')).catch(() => setStatus('Could not save. Export to keep your doodle.'));
    }, 'image/png');
  };
  const snapshot = () => { history.current.push(canvas.current.getContext('2d').getImageData(0, 0, 1000, 440)); if (history.current.length > 15) history.current.shift(); setUndos(history.current.length); };
  const point = event => { const box = canvas.current.getBoundingClientRect(); return [(event.clientX - box.left) * 1000 / box.width, (event.clientY - box.top) * 440 / box.height]; };
  const start = e => {
    if (!loaded.current || (e.pointerType === 'mouse' && e.button !== 0)) return;
    e.preventDefault(); snapshot(); drawing.current = true; canvas.current.setPointerCapture(e.pointerId);
    const ctx = canvas.current.getContext('2d'); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = eraser ? '#fffdf9' : color; ctx.lineWidth = eraser ? size * 4 : size;
    const [x, y] = point(e); ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + .01, y + .01); ctx.stroke();
  };
  const move = e => { if (!drawing.current) return; const ctx = canvas.current.getContext('2d'); ctx.lineTo(...point(e)); ctx.stroke(); };
  const end = () => { if (!drawing.current) return; drawing.current = false; save(); };
  const undo = () => { const image = history.current.pop(); if (image) { canvas.current.getContext('2d').putImageData(image, 0, 0); setUndos(history.current.length); save(); } };
  const clear = () => { if (!window.confirm('Clear your drawing? You can undo this while the pad stays open.')) return; snapshot(); const ctx = canvas.current.getContext('2d'); ctx.fillStyle = '#fffdf9'; ctx.fillRect(0, 0, 1000, 440); save(); };
  const download = () => { const a = document.createElement('a'); a.download = 'my-hamster-doodle.png'; a.href = canvas.current.toDataURL('image/png'); a.click(); };
  return <div><div className={styles.toolbar}><div className={styles.colors} role="group" aria-label="Brush colors">{colors.map(value => <button key={value} aria-label={`Brush color ${value}`} aria-pressed={color === value && !eraser} style={{ background: value }} onClick={() => { setColor(value); setEraser(false); }} />)}</div><label className={styles.size}>Size<input aria-label="Brush size" type="range" min="2" max="18" value={size} onChange={e => setSize(Number(e.target.value))} /></label><button className={`button small ${eraser ? 'selected' : ''}`} aria-pressed={eraser} onClick={() => setEraser(!eraser)}>Eraser</button><button className="button small" disabled={!undos} onClick={undo}>Undo</button><button className="icon-button" onClick={clear} aria-label="Clear drawing"><Icon name="trash" size={18} /></button><button className="icon-button" onClick={download} aria-label="Export drawing as PNG"><Icon name="download" size={18} /></button></div>
    <canvas ref={canvas} width="1000" height="440" className={styles.canvas} aria-label="Drawing area. Use your mouse, pen, or finger to draw. Keyboard users can use the controls and export a saved drawing." onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} />
    <div className={styles.footer}><span>Nothing to get right. Just a little room to draw.</span><span role="status">{status}</span></div>
  </div>;
}
