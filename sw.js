// Guarda o app no celular pra abrir sem internet. Trocar a versão quando mudar o app.
const VERSAO = 'paodemel-38';
const LIB = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.3/dist/umd/supabase.js';   // login/nuvem: guardada pra abrir sem internet
const ARQS = ['./', 'index.html', 'manifest.json', 'icone.svg', LIB];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSAO).then(c => c.addAll(ARQS))); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSAO).map(k => caches.delete(k))))); self.clients.claim(); });
// Rede primeiro (pega versão nova); sem internet, usa a cópia guardada.
self.addEventListener('fetch', e => {
  if (e.request.url === LIB) return e.respondWith(caches.match(LIB).then(r => r || fetch(LIB)));
  if (e.request.method !== 'GET' || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(fetch(e.request).then(r => { const c = r.clone(); caches.open(VERSAO).then(x => x.put(e.request, c)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match('index.html'))));
});
