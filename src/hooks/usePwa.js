import { useEffect, useState } from 'react';
import { registerSW } from 'virtual:pwa-register';
export default function usePwa() {
  const [offlineReady, setOfflineReady] = useState(false);
  const [online, setOnline] = useState(navigator.onLine);
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateFn, setUpdateFn] = useState(null);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => {
    let active = true;
    const verify = async () => {
      try {
        const root = new URL(import.meta.env.BASE_URL, location.href);
        const cached = await Promise.all(['index.html', 'audio/late-night-radio.mp3', 'images/hamsterstudying.gif'].map(path => caches.match(new URL(path, root).href, { ignoreSearch: true })));
        if (active) setOfflineReady(cached.every(Boolean));
      } catch { /* Offline caching not supported in this browser. */ }
    };
    const updater = registerSW({ immediate: true, onOfflineReady: verify,
      onNeedRefresh: () => { if (active) setUpdateAvailable(true); },
      onRegisterError: () => { if (active) setError('Offline setup failed. Keep this page online and reload to retry.'); },
      onRegisteredSW: (_url, registration) => { if (registration?.active) verify(); },
    });
    setUpdateFn(() => updater);
    const connected = () => { setOnline(navigator.onLine); verify(); };
    const installed = () => setInstallPrompt(null);
    const install = event => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener('online', connected); window.addEventListener('offline', connected);
    window.addEventListener('beforeinstallprompt', install); window.addEventListener('appinstalled', installed);
    navigator.serviceWorker?.addEventListener('controllerchange', verify);
    return () => { active = false; window.removeEventListener('online', connected); window.removeEventListener('offline', connected); window.removeEventListener('beforeinstallprompt', install); window.removeEventListener('appinstalled', installed); navigator.serviceWorker?.removeEventListener('controllerchange', verify); };
  }, []);
  const install = async () => { if (installPrompt) { await installPrompt.prompt(); await installPrompt.userChoice; setInstallPrompt(null); } };
  return { offlineReady, online, updateAvailable, update: () => updateFn?.(true), installPrompt, install, error };
}
