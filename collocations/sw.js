const C='collocations-v7';const CORE=['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'];
const CACHEABLE=u=>u.origin===location.origin||/fonts\.(googleapis|gstatic)\.com$|cdn\.jsdelivr\.net$/.test(u.hostname);
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(x=>x!==C).map(x=>caches.delete(x)))));self.clients.claim();});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||!CACHEABLE(u))return; // never cache logins or Firebase traffic
  if(u.origin===location.origin&&/firebase-config\.js$/.test(u.pathname)){e.respondWith(fetch(e.request).catch(()=>caches.match(e.request)));return;}
  e.respondWith(caches.match(e.request).then(r=>{const net=fetch(e.request).then(res=>{if(res.ok||res.type==='opaque'){const cp=res.clone();caches.open(C).then(c=>c.put(e.request,cp));}return res;}).catch(()=>r||caches.match('index.html'));return r||net;}));
});
