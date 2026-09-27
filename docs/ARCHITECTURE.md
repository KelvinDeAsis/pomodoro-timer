# Architecture

## Design

React + Vite serves a single study workspace. CSS Modules keep feature styles separate; shared tokens provide two themes. `vite-plugin-pwa` generates the manifest and precache service worker. The project remains a static site, avoiding a backend for device-local state.

```text
Timer / tasks / games / settings
             ↓ actions
       AppContext reducer → localStorage
             ↓ state
       AudioProvider → Web Audio + bundled MP3

Uploads / doodle pad ↔ IndexedDB
Production build → service worker → offline assets
```

The timer reducer stores a running deadline rather than assuming interval callbacks arrive on time. Tick and visibility events settle one expired session atomically: count focus once, choose the next mode, pause it, and create an alert deadline. No catch-up auto-cycling.

Audio is isolated from the reducer: state requests an alert, the audio engine schedules/cancels nodes, mixes individual gains, and ducks ambient tracks. Doodle blobs and uploaded data URLs are in IndexedDB instead of size-limited localStorage.

## Interfaces and trade-offs

- Timer actions: Start, Pause, Reset, Mode, Settings, Apply length, Stop alert.
- Shared state: settings, current session/deadline, tasks, per-day focus totals, game best scores, theme appearance, alert deadline.
- Storage: versioned new key, non-destructive read migration from legacy keys; image/drawing store in IndexedDB.
- No external API contract or server endpoint. All user data remains device-local.
- Bundled music increases first-load/cache size but gives reliable offline playback and avoids YouTube extraction/ads.
- Service workers cache complete builds; user-confirmed updates prevent active-session reloads.
- Quiet mode freezes GIF frames as canvas content, reducing stimulation without removing games.

Revisit a backend only if account-based sync, shared study rooms, or remote backups become requirements. Revisit native notifications/background scheduling only if guaranteed closed-app alarms become a requirement; a static browser app cannot guarantee those.
