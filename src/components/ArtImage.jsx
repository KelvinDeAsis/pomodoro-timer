import { useEffect, useRef, useState } from 'react';
import { useApp } from '../app/AppContext.jsx';
import useReducedMotion from '../hooks/useReducedMotion.js';
import { shouldFreezeArtwork } from '../utils/motion.js';
export default function ArtImage({ src, alt, className = '' }) {
  const { state } = useApp();
  const reduced = useReducedMotion();
  const frozen = shouldFreezeArtwork(state.settings.theme, reduced);
  const canvas = useRef(); const image = useRef(); const [failed, setFailed] = useState(false);
  const draw = () => {
    if (!frozen || !image.current || !canvas.current) return;
    const node = image.current;
    const ctx = canvas.current.getContext('2d');
    canvas.current.width = node.naturalWidth || 200; canvas.current.height = node.naturalHeight || 200;
    ctx.drawImage(node, 0, 0); // Displays a still frame even when the source is a GIF.
  };
  useEffect(() => { setFailed(false); if (image.current?.complete && image.current.naturalWidth) draw(); }, [src, frozen]);
  return <span className={`art-image ${className}`}>
    <img ref={image} src={failed ? `${import.meta.env.BASE_URL}images/hamster1.png` : src} alt={frozen ? '' : alt} aria-hidden={frozen} style={frozen ? { position: 'absolute', opacity: 0, pointerEvents: 'none' } : undefined} onLoad={draw} onError={() => setFailed(true)} />
    {frozen && <canvas ref={canvas} role="img" aria-label={alt} />}
  </span>;
}
