// Service worker: deixa a plataforma disponível off-line depois da primeira visita.
const CACHE = 'rn-questoes-v3';
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./', './index.html', './manifest.webmanifest', './icon.svg', './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-512.png', './icons/apple-touch-icon.png'])).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || !/^https?:/.test(e.request.url) || /versao\.json$/.test(new URL(e.request.url).pathname)) return;
  // a página sempre revalida no servidor (o cache HTTP do GitHub Pages guardaria a versão antiga por 10 min)
  const req = e.request.mode === 'navigate' ? fetch(e.request.url, { cache: 'no-cache', credentials: 'same-origin' }) : fetch(e.request);
  e.respondWith(req.then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; }).catch(() => caches.match(e.request, { ignoreSearch: true }).then(r => r || caches.match('./index.html'))));
});
