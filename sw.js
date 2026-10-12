// Este sitio no usa service worker: si quedó uno instalado, se borra solo y recarga la página.
self.addEventListener('install',function(){self.skipWaiting();});
self.addEventListener('activate',function(e){e.waitUntil(self.registration.unregister().then(function(){return self.clients.matchAll({type:'window'});}).then(function(cs){cs.forEach(function(c){c.navigate(c.url);});}));});
