const paths = {
  settings: <><path d="M4 6h16M4 12h16M4 18h16"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="9" cy="18" r="2"/></>,
  moon: <path d="M20 15a8.5 8.5 0 1 1-11-11 7 7 0 0 0 11 11Z"/>,
  sun: <><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5"/></>,
  play: <path d="m9 5 11 7-11 7Z"/>,
  pause: <path d="M8 5v14M16 5v14"/>,
  reset: <><path d="M4 10a8 8 0 1 1 1 8M4 4v6h6"/></>,
  close: <path d="m6 6 12 12M6 18 18 6"/>,
  check: <path d="m5 12 4 4L19 6"/>,
  brush: <><path d="m9 14 9-11 3 3-11 10M10 16c0 5-4 5-7 5 2-1 1-3 2-4s3-2 5-1Z"/></>,
  music: <><path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/></>,
  noise: <path d="M3 10v4M7 6v12M12 3v18M17 6v12M21 10v4"/>,
  arrow: <path d="m6 9 6 6 6-6"/>,
  trash: <><path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/></>,
  download: <><path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/></>,
};
export default function Icon({ name, size = 20 }) { return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name] || paths.check}</svg>; }
