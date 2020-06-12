

// Guardar  en el cache dinamico
function actualizaCacheDinamico( dynamicCache, req, res ) {
//bueno esta funcion necesita recibir a donde se va guardar,que se quiere guardar y una respuesta 

    if ( res.ok ) {//si la respuesta fue encontrada 

        return caches.open( dynamicCache ).then( cache => {//alamceno en el cache

            cache.put( req, res.clone() );//almaceno la respuesta en el cache y la clono 
            
            return res.clone();

        });

    } else {//en dado caso que no haga nada que no encuentre nada
        return res;//devuelvo lo uqe tenga sera un error
    }



}

