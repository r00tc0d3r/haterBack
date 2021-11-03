const Client = require('../models/client.model');
const logger = require('../utils/logger.utils');
const {response} = require('express');
const { HTTP_VERSION_NOT_SUPPORTED } = require('http-status-codes');
const { resolve } = require('path');

/** -------------------------------------------------------------------------------
*  async addClient(req, res) 
*  Añade en la base de datos un cliente
*  @param  { object }   req el request de la peticion
*                           solo se necesitará el req.body.name
*  @param  { response } res response object
*  @return { object }
*                  On success => devuelve el id del cliente cargado (int), 
*                     el nombre(string) y ok (boolean = true) que indica que
*                     la peticion fue exitosa, caso contrario el ok
*                  On error => ok (boolean = false) y enviará un mensaje 
*                     descriptivo del error
*  @author Pablo Rodrigo Gilabert
*  @date   14/01/2021
------------------------------------------------------------------------------- */
const addClient = async (req, res = response) => {
    const { name } = req.body;
    try {
        let client = await Client.findOne({name});
        if (client) {
            return res.status(400).json({
                ok: false,
                msg: 'client already exists'
            });
        }
        client = new Client({name});
        await client.save();
        res.status(201).json({
            ok: true,
            uid: client.id,
            name: client.name,
        })
    } catch (error) {
        logger(`An error has ocurred while authenticating: ${error}`);
        res.status(500).json({
            ok: false,
            msg: 'Please, talk to your administrator'
        });
    }
}

/** -------------------------------------------------------------------------------
*  async findClient(id) 
*  Busca en la base de datos un cliente por id y lo retorna
*  @param  { String }   id el id del cliente
*  @return { object }
*                  On success => devuelve el objeto cliente encontrado
*                       en la base de datos
*                  On error: escribe en consola el error encontrado
*  @author Pablo Rodrigo Gilabert
*  @date   14/01/2021
------------------------------------------------------------------------------- */
const findClient = async (id) => {
    let client;
    try {
        client = await Client.findById(id);
    } catch (err) {
        logger('An error has ocurred while finding client', err);
    }
    return client;
}

// const validateIndex = async (clientName, index) => {
//     let validIndex = false;
//     if (clientName && index) {
//         let client = await findClient(clientName);
//         if (client && client.indices) {
//             validIndex = client.indices.includes(index);
//         }
//     }
//     return validIndex;
// }

/** -------------------------------------------------------------------------------
*  async getClients() 
*  Funcion asyncrona que obtiene todos los clientes de la base de datos
*  @return { Array<object> }
*                  On success => devuelve un array con los clientes encontrados
*                       en la base de datos
*                  On error: escribe en consola el error encontrado
*  @author Pablo Rodrigo Gilabert
*  @date   14/01/2021
------------------------------------------------------------------------------- */
const getClients = async () => {
    let clients;
    try {
        clients = await Client.find();
    } catch (err) {
        logger('An error has ocurred while finding all clients. description:', err);
    }
    return clients;
}

/** -------------------------------------------------------------------------------
*  async deleteClient(id) 
*  Elimina de la base de datos un cliente
*  @param  { String }   id el id del cliente
*  @return { void }
*  @author Pablo Rodrigo Gilabert
*  @date   14/01/2021
------------------------------------------------------------------------------- */
const deleteClient = async (id) => {

    
    if (id) {
        try{
            const clientDeleted = Client.findByIdAndDelete(id);
            return clientDeleted;
        } catch {
            throw new Error('Han error has ocurred');
        }
    } else {
        // logger('Invalid client id in delete client function');
        throw new Error('Invalid client id in delete client function');
    }
}

/** -------------------------------------------------------------------------------
*  async addSavedSearch(savedSearch, client) 
*  Añade en la base de datos una busqueda guardada
*  @param  { String } savedSearch el id de la busqueda guardada
*  @param  { String } client el id del cliente al cual pertenece la busqueda
*  @return { void }
*  @author Pablo Rodrigo Gilabert
*  @date   14/01/2021
------------------------------------------------------------------------------- */
const addSavedSearch = async (savedSearch, client) => {
    if (savedSearch && client) {
        let clientdb = await findClient(client);
        if (clientdb) {
            clientdb.search ? clientdb.search.push(savedSearch) : clientdb.search = [savedSearch];
            clientdb.save();
            // logger(`Saved Search successfully added to client ${client}`);
        } else {
            logger(`Client ${client} doesn't exist`);
        }
    } else {
        logger('Invalid Saved Search or client name');
    }
}

/** -------------------------------------------------------------------------------
*  async deleteSavedSearch(searchid, clientid) 
*  Elimina de la base de datos una busqueda guardada
*  @param  { String } searchid el id de la busqueda guardada
*  @param  { String } clientid el id del cliente al cual pertenece la busqueda
*  @return { void }
*  @author Pablo Rodrigo Gilabert
*  @date   14/01/2021
------------------------------------------------------------------------------- */
const deleteSavedSearch = async (searchid, clientid) => {
    if (clientid) {
        let client = await findClient(clientid);
        if (client) {
            if (client.search) {
                const i = client.search.indexOf(searchid);
                if (i >= 0 && i < client.search.length) {
                    client.search.splice(i, 1);
                    client.save();
                    logger(`Saved Search ${clientid} successfully deleted to Client ${client.name}`);
                }
            } else {
                logger(`Client ${client} has an empty array of saved search`);
            }
        } else {
            logger(`Client ${client} doesn't exist`);
        }
    } else {
        logger('Invalid saved search or client name');
    }
}

//TODO:
//BRING CREATE client
//CHANGE client

module.exports = {
    addClient,
    //validateIndex,
    deleteClient,
    getClients,
    addSavedSearch,
    deleteSavedSearch
}