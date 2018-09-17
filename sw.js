/* 
 * Store the Cache Name in a Constant
 * Store the files to be Cached in an array
 */

const staticCacheName = 'restaurant-cache-v138';
let filesToCache = [
    './',
    './index.html',
    './restaurant.html',
    './data/restaurants.json',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
    './css/styles.css',
    './img/10.jpg',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
]

/* Add files to Cache storage:
 * Wait for the Service Worker to install 
 * Open the Cache storage
 * Add all the files to Cache
 * Log any File caching error
 */
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(staticCacheName).then(cache => {
            return cache.addAll(filesToCache);
        })
        .catch(err => {
            console.log('File Cache Error' + err);
        })
    );
});

/*Clear any old Cache Storages:
 * Wait for the Service Worker to Activate
 * Get all the Cache Storages
 * Loop through all the Cache Storages and filter the ones created for this app
 * Delete all the old Cachhe storages except for the latest one
 * that is stored in statisCacheName
 */
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.filter(cacheName => {
                    return cacheName.startsWith('restaurant') && 
                           cacheName != staticCacheName;
                }).map(cacheName => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

/* Retrieve the files from Cache is available else add them to Cache:
 * Check if the requested file is available in the cache storage 
 * If available in the Cache, load it 
 * If not available, clone the request to add to the Cache
 * Fetch the file from the server and load it
 * If teh Fetch fails, return the failure message
 * If the Fetch is successful, clone the response to add to Cache
 * Add the Cloned request and response to the Cache
 */
self.addEventListener('fetch', event => {

    event.respondWith(
        caches.match(event.request).then( response =>{
            if(response) {
                return response; 
            }
 
            var requestClone = event.request.clone();

            return fetch(event.request).then(response => {
                    if(!response){
                        console.log('Could not fetch');
                        return response;
                    }
                    var requestClone = event.request.clone();
                    var responseClone = response.clone();
                    return caches.open(staticCacheName).then(cache => {
                        cache.put(requestClone,responseClone);
                        console.log('Adding to Cache: '+staticCacheName+' and returning response')
                        return response;
                    })
                    .catch(error => {
                        console.log('Error fetching and caching');
                    });
            })
            
        })
    );
});

