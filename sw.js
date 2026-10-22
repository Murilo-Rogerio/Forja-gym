const CACHE = 'forja-v4-hevy-plus';
const ASSETS = [
  './', './index.html', './manifest.json', './icons/icon.svg',
  './css/tokens.css', './css/base.css', './css/components.css',
  './js/lib/utils.js', './js/lib/data.js', './js/lib/state.js',
  './js/lib/gamification.js', './js/lib/ai.js',
  './js/components/icons.js', './js/components/fx.js', './js/components/toast.js',
  './js/components/timer.js', './js/components/charts.js', './js/components/bodymap.js',
  './js/features/auth.js', './js/features/editor.js', './js/features/coach.js',
  './js/features/workout.js', './js/features/share.js', './js/features/feed.js',
  './js/views/home.js', './js/views/workouts.js', './js/views/feed.js',
  './js/views/progress.js', './js/views/nutrition.js', './js/views/profile.js',
  './js/app/router.js', './js/app/wiring.js', './js/app/boot.js'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c =>
    Promise.all(ASSETS.map(a => c.add(a).catch(() => {})))
  ));
});
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // Gemini/Firebase/Strava: direto à rede
  e.respondWith(
    caches.match(e.request).then(hit => hit || fetch(e.request).then(res => {
      const cp = res.clone();
      caches.open(CACHE).then(c => c.put(e.request, cp)).catch(() => {});
      return res;
    }).catch(() => caches.match('./')))
  );
});