const V='cmr-v5',FILES=['./','./index.html','./manifest.json','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))));self.clients.claim()});
const keep=(req,r)=>{if((r.ok&&(r.type==='basic'||r.type==='cors'))||r.type==='opaque'){const c=r.clone();caches.open(V).then(x=>x.put(req,c))}return r};
self.addEventListener('fetch',e=>{const q=e.request;if(q.method!=='GET')return;
  // The app page itself: network first, so updates show on the next open; the saved copy when offline.
  if(q.mode==='navigate'){e.respondWith(fetch(q).then(r=>keep(q,r)).catch(()=>caches.match(q,{ignoreSearch:true}).then(h=>h||caches.match('./index.html'))));return}
  // Icons, fonts: saved copy first.
  e.respondWith(caches.match(q,{ignoreSearch:true}).then(h=>h||fetch(q).then(r=>keep(q,r))))});
