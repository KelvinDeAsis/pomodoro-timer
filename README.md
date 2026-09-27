# Hamster Pomodoro

A React personal-study app with adjustable Pomodoro sessions, tasks, a pink/cream theme, quiet cocoa mode, a jazz-lofi/brown-noise mixer, a drawing pad, and two untimed minigames. No account or backend.

## Run locally

Requires Node.js 22.12+ (tested with 22.19) and npm.

```powershell
cd "C:\KELVIN\pomodoro copy"
npm install
npm run dev
```

Open the localhost URL printed in the terminal. Do not double-click `index.html`: this is now a framework project.

To test the production/offline version:

```powershell
npm test
npm run build
npm run preview
```

Offline support is enabled in the production build, not the development preview.

## Use

- Start, pause, or reset the timer; switch between focus, short, and long breaks.
- Timer settings change durations (1–180 minutes) and long-break cadence (2–8 focus sessions). New lengths apply to the next session unless you choose **Apply now**, which resets the current session length.
- After every session, the next waits for Start. A gentle alert repeats for up to 60 seconds. Stop alert silences it without starting the next session.
- Play jazz and brown noise independently or together. Audio requires a user gesture. Volume settings persist; playback never automatically resumes on reload.
- The moon switches to Quiet cocoa: warm-brown colors, still artwork, no decorative movement. System reduced-motion preferences also freeze artwork and disable animation/smooth scrolling.
- Doodles and games remain accessible during focus. They do not pause the timer. Game rounds reset when you close or switch activities; best scores and completed drawing strokes save locally.
- Artwork customization accepts PNG, JPG, GIF, and WebP uploads under 5 MB. Uploaded files save locally; older external image links still depend on their source being reachable.

## Offline and installation

Load the production site once online and wait for **Offline ready** before disconnecting. The app, music, fonts, and default hamster artwork are cached. Where supported, an **Install app** button appears; otherwise use the browser's install/add-to-home-screen menu. On iOS, use Safari → Share → Add to Home Screen.

The site must be served through HTTPS or localhost. `file://` is not supported. Browser cache eviction and clearing site data can remove offline availability and local saves. Keep important drawings through PNG export.

Timers use a saved timestamp deadline, so background tabs and reloads recover the correct remaining time. Browsers cannot reliably play an alarm while the app is closed or the device sleeps. Recovery counts one completion and selects the next paused session; it never invents completed sessions during your absence. An old alarm beyond its 60-second window is not replayed.

Updates show a prompt, disabled while a timer or alert is active. Updates retain local data.

## Source layout

```text
src/
  app/          App shell, shared reducer, persistence orchestration
  components/   Accessible dialog, icons, reduced-motion artwork
  features/
    timer/      Timer view and duration/alert settings
    tasks/      Task list
    audio/      Audio provider and mixer
    appearance/ Themes and uploads
    doodles/    Drawing pad
    games/      Play corner, matching, feeding
  hooks/        Clock, reduced motion, PWA lifecycle
  services/     LocalStorage, IndexedDB, Web Audio
  utils/        Pure timer/cadence functions
  styles/       Theme tokens and shared layout
public/         Bundled images, licensed audio, app icons
tests/          Pure timer and persistence tests
docs/           Design and publishing guide
```

Component-specific styles use CSS Modules. Shared typography and colors live in `src/styles/`. Bundled fonts use Fontsource; no runtime Google Fonts request is needed. `public/images/` contains the supplied artwork unchanged.

## Existing saves and original files

The original `index.html` and `style.css` are preserved in `backup-before-react/`. Existing Git changes were not reset. Root `style.css` is retained as a legacy file but is no longer loaded; edit the modular styles instead.

The new save key is `hamsterPomodoro.react.v1`. The app reads `burrowClub.v1`, `hollowbackApiary.v1`, and `hamsterPomodoro.v3` when a new save is absent, retaining old keys. IndexedDB stores drawings and uploaded art. Old interval-based running sessions restore paused. Migration can only read data on the same browser origin; moving from `file://` or another port/domain does not transfer its browser storage automatically.

## Licensing and publishing

Jazz recording: **Late Night Radio**, Kevin MacLeod, CC BY 4.0; attribution is visible in the mixer and in `public/audio/ATTRIBUTION.txt`. Playback applies a soft low-pass filter. Brown noise and alerts are generated locally. Neither requested YouTube video was downloaded or extracted.

Hamster image/GIF files were supplied in the original project; no independent license for those images was provided. Verify their reuse rights before publishing. The visual reference is inspiration only: no Ponpon Mania artwork, branding, or source code is included.

See [deployment guide](docs/DEPLOYMENT.md) and [architecture](docs/ARCHITECTURE.md). Nothing has been publicly deployed.
