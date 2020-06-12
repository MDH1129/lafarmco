// imports
importScripts('js/sw-utils.js');//importamos la funcion que hicimos para llenar el cache estatico


const STATIC_CACHE    = 'static-v4';//creamos nuestros caches
const DYNAMIC_CACHE   = 'dynamic-v2';
const INMUTABLE_CACHE = 'inmutable-v1';


const APP_SHELL = [//creamos el app shell con lo necesario para iniciar nuestra pagina
    // '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

const APP_SHELL_INMUTABLE = [//en este cache ponemos todo lo que no se va a modificar 
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'
];



self.addEventListener('install', e => {//aqui almacenamos todo en nuestros respectivos caches 


    const cacheStatic = caches.open( STATIC_CACHE ).then(cache => 
        cache.addAll( APP_SHELL ));//aqui almacenamos todolo de nuestro app shell

    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then(cache => 
        cache.addAll( APP_SHELL_INMUTABLE ));//aqui almacenamos todo lo de cache immutable 



    e.waitUntil( Promise.all([ cacheStatic, cacheInmutable ])  );//cargamos nuestros caches con el sw 

});


self.addEventListener('activate', e => {//aqui nosotros vamos a borrar lo que ya no se necesite en el cache
//cada vez que cambiamos de sw se actualizan nuestros caches 
    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

            if (  key !== DYNAMIC_CACHE && key.includes('dynamic') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});




self.addEventListener( 'fetch', e => {//ESTRATEGIA NETWORK FALLBACK


    const respuesta = caches.match( e.request ).then( res => {

        if ( res ) {
            return res;
        } else {

            return fetch( e.request ).then( newRes => {

                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes );
                    //en este caso nosotros llamamos nuestra funcion con nuestros argumentos 
                    //como vemos nosotros tenemos que enviar  el cache  el requerimiento y la respuesta a nuestra funcion
            });

        }

    });



    e.respondWith( respuesta );

});


