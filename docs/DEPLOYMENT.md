# Publishing the app

Nothing is published automatically. Use any HTTPS static host supporting Vite output, such as Netlify or Cloudflare Pages.

1. Verify rights to the supplied hamster images/GIFs and retain the music credit.
2. Use Node 22.12+; run `npm ci`, `npm test`, and `npm run build`.
3. Upload **only `dist/`** to your static host, or configure the host's build command as `npm run build` and output directory as `dist`.
4. Keep the generated manifest, `sw.js`, Workbox file, icons, fonts, images, and audio in the deployment. Do not publish `node_modules`, `.git`, or the original backup.
5. Open the HTTPS URL in a fresh browser, wait for Offline ready, play music, and check the timer.
6. Disconnect networking and reload. Confirm timer, music, artwork, doodle persistence, and games still work. Reconnect and test installation.

No secrets, `.env`, database, server API, or authentication are needed. The current relative Vite base supports a site root or a subfolder when the full `dist` contents stay together. Prefer deploying as a standalone site root.

Configure `sw.js` and `index.html` to revalidate (`Cache-Control: no-cache`); hashed JS/CSS/font assets can use long-lived immutable caching. Serve `.webmanifest` as `application/manifest+json`. Most static hosts infer correct MIME types.

For updates, rebuild and upload the complete output. Active users see an update prompt rather than being forcibly reloaded mid-session. Roll back by republishing a previous complete build, including its service worker. Never delete local storage as part of an update.

## Limitations

- Offline installation is not a standalone Windows executable: it is managed by the browser.
- Data is local to the browser origin/device. Moving domains changes storage access; it is not cross-device synchronization.
- Browser/device suspension can prevent alerts. This app is not a guaranteed background alarm.
- Browser storage quotas and cache eviction can remove offline files. Reload online to restore offline caching.
- No analytics or monitoring service is included. Use browser console/network checks for troubleshooting; do not collect private task or drawing data.
