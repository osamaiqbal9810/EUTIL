"use strict";var precacheConfig=[["/index.html","cea3372dd3cc9841d0b855555fd32082"],["/static/css/main.102ad120.css","ceb5c76da50d9a962272af3b5957c513"],["/static/media/LH-Switch.e54360e7.png","e54360e77180882615cdc942487e7611"],["/static/media/RH-Switch.f79dcf3a.png","f79dcf3acc3a87fbb325f3bb8e550c2e"],["/static/media/SideBarImage.3ccd0619.jpg","3ccd061958e9b44df169a9f58081b55a"],["/static/media/TIMPS_Logo_old.fac7f581.png","fac7f581a8e74f62048c73ea6c7c0991"],["/static/media/Transdev Logo.27169802.png","27169802af032d440f0ffd19017f9653"],["/static/media/TriRail Logo.8dbaf5f5.png","8dbaf5f5af0f7babc917fd60f7694d35"],["/static/media/alignment.d214fefa.jpg","d214fefa6018ffdfd39ffd7324118c60"],["/static/media/gitversion.915de02a.txt","915de02aac06f5ed7b320f9b32c89aab"],["/static/media/left-detail-turnout.deb5e6d5.jpg","deb5e6d506589c01ded1c05de17d2fac"],["/static/media/logo-ONR.c74029e2.jpg","c74029e25f7309257102d879ade8c220"],["/static/media/logo-ferromex.3e6aef71.jpeg","3e6aef71426b048ebf72c1843a96a4ec"],["/static/media/logo-ferromexzz.0a29c600.png","0a29c6002225368db22a33e3094d8d5c"],["/static/media/logo-fingerlake.9b068ce1.png","9b068ce1ede7d1cbf19b3b4dd1510c4d"],["/static/media/logo-gryr.3aa7e9e0.jpg","3aa7e9e0c5942f2a25634850e6d2a002"],["/static/media/logo-nopb.e57d0f9a.jpg","e57d0f9a21781cf5fe16466eeace58ef"],["/static/media/pioneer-lines-logo-v2.83580623.png","835806239c9d5e061afaa13d26733a8a"],["/static/media/right-detail-turnout.20b7db27.jpg","20b7db2724b0f4fb5fa160e4e300e6d7"],["/static/media/switch-img.cb8f7d48.jpg","cb8f7d487b1e0582a1f062c8dfcda439"],["/static/media/topBarBackground.521cc3a2.png","521cc3a2dad23ec7cd8e26c18d1930d7"]],cacheName="sw-precache-v3-sw-precache-webpack-plugin-"+(self.registration?self.registration.scope:""),ignoreUrlParametersMatching=[/^utm_/],addDirectoryIndex=function(e,t){var a=new URL(e);return"/"===a.pathname.slice(-1)&&(a.pathname+=t),a.toString()},cleanResponse=function(t){return t.redirected?("body"in t?Promise.resolve(t.body):t.blob()).then(function(e){return new Response(e,{headers:t.headers,status:t.status,statusText:t.statusText})}):Promise.resolve(t)},createCacheKey=function(e,t,a,n){var r=new URL(e);return n&&r.pathname.match(n)||(r.search+=(r.search?"&":"")+encodeURIComponent(t)+"="+encodeURIComponent(a)),r.toString()},isPathWhitelisted=function(e,t){if(0===e.length)return!0;var a=new URL(t).pathname;return e.some(function(e){return a.match(e)})},stripIgnoredUrlParameters=function(e,a){var t=new URL(e);return t.hash="",t.search=t.search.slice(1).split("&").map(function(e){return e.split("=")}).filter(function(t){return a.every(function(e){return!e.test(t[0])})}).map(function(e){return e.join("=")}).join("&"),t.toString()},hashParamName="_sw-precache",urlsToCacheKeys=new Map(precacheConfig.map(function(e){var t=e[0],a=e[1],n=new URL(t,self.location),r=createCacheKey(n,hashParamName,a,/\.\w{8}\./);return[n.toString(),r]}));function setOfCachedUrls(e){return e.keys().then(function(e){return e.map(function(e){return e.url})}).then(function(e){return new Set(e)})}self.addEventListener("install",function(e){e.waitUntil(caches.open(cacheName).then(function(n){return setOfCachedUrls(n).then(function(a){return Promise.all(Array.from(urlsToCacheKeys.values()).map(function(t){if(!a.has(t)){var e=new Request(t,{credentials:"same-origin"});return fetch(e).then(function(e){if(!e.ok)throw new Error("Request for "+t+" returned a response with status "+e.status);return cleanResponse(e).then(function(e){return n.put(t,e)})})}}))})}).then(function(){return self.skipWaiting()}))}),self.addEventListener("activate",function(e){var a=new Set(urlsToCacheKeys.values());e.waitUntil(caches.open(cacheName).then(function(t){return t.keys().then(function(e){return Promise.all(e.map(function(e){if(!a.has(e.url))return t.delete(e)}))})}).then(function(){return self.clients.claim()}))}),self.addEventListener("fetch",function(t){if("GET"===t.request.method){var e,a=stripIgnoredUrlParameters(t.request.url,ignoreUrlParametersMatching),n="index.html";(e=urlsToCacheKeys.has(a))||(a=addDirectoryIndex(a,n),e=urlsToCacheKeys.has(a));var r="/index.html";!e&&"navigate"===t.request.mode&&isPathWhitelisted(["^(?!\\/__).*"],t.request.url)&&(a=new URL(r,self.location).toString(),e=urlsToCacheKeys.has(a)),e&&t.respondWith(caches.open(cacheName).then(function(e){return e.match(urlsToCacheKeys.get(a)).then(function(e){if(e)return e;throw Error("The cached response that was expected is missing.")})}).catch(function(e){return console.warn('Couldn\'t serve response for "%s" from cache: %O',t.request.url,e),fetch(t.request)}))}});