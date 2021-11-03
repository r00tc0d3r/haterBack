const logger = require('../utils/logger.utils');
const userController = require('./user.controller');
const clientController = require('./client.controller');
const SearchTracker = require('../models/search-tracker.model');

/** -------------------------------------------------------------------------------
*  async findSearch(id) -
*  Busca en la base de datos una busqueda guardada por id y la retorna
*  @param  { String } id el id de la busqueda guardada
*  @return { object }
*                  On success => devuelve el objeto de la busqueda guardada
*                       encontrado en la base de datos
*                  On error: escribe en consola el error encontrado
*  @author Pablo Rodrigo Gilabert
*  @date   27/01/2021
------------------------------------------------------------------------------- */
const findSearch = async (id) => {
    let savedSearch;
    try {
        savedSearch = await SearchTracker.findById(id);
    } catch (err) {
        logger('No Saved Search found with indicated id');
    }

    return savedSearch;
}

/** -------------------------------------------------------------------------------
*  async createSearch(searchInfo) -
*  Añade en la base de datos una busqueda guardada
*  @param  { object } searchInfo un objeto que contiene la informacion de la busqueda a guardar
*  @return { void }
*  @author Pablo Rodrigo Gilabert
*  @date   27/01/2021
------------------------------------------------------------------------------- */
const createSearch = async (searchInfo, userName = '') => {
    const { users_keywords, client, social_network, index, isFavorite, premium ,keywords, endpoint,social_port} = searchInfo;
    const date = new Date();
    if(users_keywords && client && social_network && index){
            try {
                newSavedSearch = new SearchTracker({
                    users_keywords,
                    client,
                    social_network,
                    index,
                    premium,
                    keywords,
                    endpoint,
                    social_port,
                    userName,
                    date
                });
                const savedSearch = await newSavedSearch.save();
                console.log('sser', savedSearch);
                console.log('isFAv', isFavorite)
                if(isFavorite){
                    await updateFavorite(userName, savedSearch._id, isFavorite);
                    // logger('favoriteUpdated')
                }
                clientController.addSavedSearch(savedSearch, client);
                // logger('Saved Search successfully created');
            } catch (error) {
                logger(`Error while creating a Saved Search ${error}`);
            }
        } else {
            logger('Missing data to create a Saved Search');
        }
}

/** -------------------------------------------------------------------------------
*  async updateFavorite(haterUser, savedSearch, isFavorite) -
*  Añade o elimina de la base de datos del usuario las busquedas favoritas de su preferencia
*  @param  { String }   haterUser el nombre del usuario que origina la peticion
*  @param  { String }   savedSearch el id de la busqueda guardada
*  @param  { Boolean }  isFavorite booleano que indica si se quiere añadir o no a favoritos
*  @return { void }
*                  On success: añade o elimina las busquedas del usuario
*                  On error: loggea en consola un mensaje descriptivo del error
*  @author Pablo Rodrigo Gilabert
*  @date   27/01/2021
------------------------------------------------------------------------------- */
const updateFavorite = async (haterUser ,savedSearch, isFavorite) => {
    try{
        let user = await userController.findUser(haterUser);
        if(user){
            const existentSearch = await findSearch(savedSearch); 
            console.log('exsecf', existentSearch);                 
            if(existentSearch){ 
                let index = user.favoriteSearches.map(x => {
                    return x._id;
                  }).indexOf(savedSearch);
                  console.log('index: ', index);
                if(isFavorite && index == -1){
                    user.favoriteSearches.push(existentSearch)
                    logger('succesfully added to favorites')
                }
                else if (!isFavorite && index){
                    user.favoriteSearches.splice(index, 1);
                    logger('succesfully deleted from favorites')
                }
                await user.save();
                console.log('userfavser', user.favoriteSearches);
            } else {
                logger('failed to remove saved search because saved search not exist')
            }
        } else {
            logger('failed to remove saved search because user does not exist')
        }
    } catch(e){
        logger(`Error while updating favorites: ${e}`);
    }
}

/** -------------------------------------------------------------------------------
*  async getFavorites(haterUser) -
*  Obtiene todos las busquedas guardadas anexadas al usuario
*  @param  { String }   haterUser el nombre del usuario que origina la peticion
*  @return { Array<object> }
*                  On success: retorna un array con las busquedas guardadas
*                  On error: loggea en consola un mensaje descriptivo del error
*  @author Pablo Rodrigo Gilabert
*  @date   27/01/2021
------------------------------------------------------------------------------- */
const getFavorites = async (haterUser) => {
    try{
        let user = await userController.findUser(haterUser);
        if(user){
            favorites = []
            for(let i = 0; i < user.favoriteSearches.length; i++){
                let id = user.favoriteSearches[i];
                let fav = await SearchTracker.findById(id);
                favorites.push(fav);
            }
            return favorites
        } else {
            logger('failed to get favorites saved searches because user does not exist')
        }
    } catch(e){
        logger(`Error while getting favorites: ${error}`);
    }
}

/** -------------------------------------------------------------------------------
*  async deleteSearch(searchid) -
*  Elimina de la base de datos una busqueda guardada por id.
*  @param  { String }   searchid el id de la busqueda a eliminar
*  @return { void }
*                  On success => Elimina la busqueda de la base de datos
*                  On error: loggea en consola el error encontrado
*  @author Pablo Rodrigo Gilabert
*  @date   27/01/2021
------------------------------------------------------------------------------- */
const deleteSearch = async (searchid) => {
    const existentSearch = await findSearch(searchid);
    if (existentSearch) {
        const clientid = existentSearch.client;
        console.log('clientid', clientid)
        //TODO: Change callback to promise
        try {
            SearchTracker.findByIdAndDelete(searchid, (err) => {
                if (err) {
                    logger('Error while deleting Saved Search');
                } else {
                    clientController.deleteSavedSearch(searchid, clientid);
                    logger('Saved Search successfully deleted');
                }
            });
        } catch (error) {
            console.log(`Error while deleting document: ${error}`);
        }
    }
}

/** -------------------------------------------------------------------------------
*  async getSearches() -
*  Busca en la base de datos todas las busquedas guardadas que existan
*  @return { Array<object> }
*                  On success => devuelve un array de objetos con todas las busquedas
*                                guardadas de la base de datos
*                  On error: loggea en consola el error encontrado
*  @author Pablo Rodrigo Gilabert
*  @date   27/01/2021
------------------------------------------------------------------------------- */
const getSearches = async() => {
    let searches;
    try {
        searches = await SearchTracker.find();
    } catch (err) {
        logger('An error has ocurred while finding all saved search: ', err);
    }
    return searches;
}

const updateDate = async (haterUser, idSearch ) => {
    try {
        let user = await userController.findUser(haterUser);
        const newDate = new Date();
        if(user){
            const existentSearch = await findSearch(idSearch);        
            if(existentSearch){
                existentSearch.date = newDate
                existentSearch.save()
            }
        }
    } catch (error) {
        
    }
}

module.exports = {
    createSearch,
    updateFavorite,
    getFavorites,
    deleteSearch,
    getSearches,
    updateDate
};
