const User = require('../models/user.model');
const Types = require('../models/types.model');
const TwitterCredential = require('../models/twitter-credential.model');
const logger = require('../utils/logger.utils');
// const { Types } = require('mongoose');
const mongoose = require('mongoose');

const findUser = async (name) => {
    let user;

    try {
        user = await User.findOne({ name });
    } catch (err) {
        logger('An error has ocurred while finding user');
    }

    return user;
}

const addTwitterCredential = async (twitterCredential, userName) => {
    if (twitterCredential && userName) {
        let user = await findUser(userName);

        if (user) {
            user.twitter_credentials ? user.twitter_credentials.push(twitterCredential) : user.twitter_credentials = [twitterCredential];
            user.save();
            logger(`Twitter Credential successfully added to user ${userName}`);
        } else {
            logger(`User ${user} doesn't exist`);
        }
    } else {
        logger('Invalid twitter credential or user name');
    }
}

const deleteTwitterCredential = async (credential, userName) => {
    if (credential && userName) {
        let user = await findUser(userName);

        if (user) {
            if (user.twitter_credentials) {
                const i = user.twitter_credentials.indexOf(credential);
                if (i >= 0 && i < user.twitter_credentials.length) {
                    user.twitter_credentials.splice(i, 1);
                    user.save();
                    logger(`Twitter credential ${credential} successfully deleted to user ${userName}`);
                }
            } else {
                logger(`User ${user} has an empty array of twitter credential`);
            }
        } else {
            logger(`User ${user} doesn't exist`);
        }
    } else {
        logger('Invalid twitter credential or user name');
    }
}

<<<<<<< Updated upstream
const addIndex = async (index, userName) => {
=======
/** -------------------------------------------------------------------------------
*  async addIndex(index, userName) -
*  Añade en la base de datos un indice
*  @param  { String }   index el indice a añadir
*  @param  { String }   userName el nombre del usuario al cual se le asocia ese indice
*  @return { void }
*                  On success: Añade el indice al usuario en la base de datos
*                  On error: se loggeará un mensaje descriptivo del error
*  @author Mauricio Casares Diaz
*  @date   06/08/2020
------------------------------------------------------------------------------- */
const addIndex = async (index, userName,clientId, clientName) => {
>>>>>>> Stashed changes
    if (index && userName) {
        let user = await findUser(userName);
        let type = await Types.findOne({index,clientId});
        if(type)
            return -1

        const data = {
            index,
            clientId
        }
        if (user) {
            try {
                type = new Types({type: index, clientId: clientId})
                await type.save()
                console.log( type );
                user.indices ? user.indices.push(type._id) : user.indices = [index];
                user.save();
                logger(`Index ${index} successfully added to user ${userName}`);
                return type._id
            } catch (error) {
                logger(`Han error has ocurred ${error}`)
            }
        } else {
            logger(`User ${user} doesn't exist`);
        }
    } else {
        logger('Invalid index or user name');
    }
}

<<<<<<< Updated upstream
const deleteIndex = async (index, userName) => {
    if (index && userName) {
=======
/** -------------------------------------------------------------------------------
*  async deleteIndex(index, userName) -
*  Elimina de la base de datos un indice
*  @param  { String }   index el indice a eliminar
*  @param  { String }   userName el nombre del usuario al cual se le asocia el indice
*  @return { void }
*                  On success: Elimina el indice asociado al usuario
*                  On error: loggea en consola un mensaje descriptivo del error.
*  @author Mauricio Casares Diaz
*  @date   06/08/2020
------------------------------------------------------------------------------- */
const deleteIndex = async (id, userName) => {
    if (id && userName) {
>>>>>>> Stashed changes
        let user = await findUser(userName);
        

        if (user) {
            if (user.indices) {
                // const i = user.indices.indexOf(JSON.stringify(data));
                console.log(user.indices);
                const i = user.indices.findIndex( (userIndice) => {
                    return JSON.stringify(userIndice) === JSON.stringify(id)
                })
                console.log( i );
                if (i >= 0 && i < user.indices.length) {

                    user.indices.splice(i, 1);
                    user.save();

                    const indexDeleted = await Types.findByIdAndDelete(id);


                    return indexDeleted;
                }
            } else {
                logger(`User ${user} has an empty array of index`);
            }
        } else {
            logger(`User ${user} doesn't exist`);
        }
    } else {
        logger('Invalid index or user name');
    }
}

const getIndices = async (userName) => {
    

    let indices = [];
    if (userName) {
        let user = await findUser(userName);

        let types = await Types.find();


        if (user) {
            for (let i = 0; i < user.indices.length; i++) {
                for (let x = 0; x < types.length; x++) {
                    if( JSON.stringify(user.indices[i]) === JSON.stringify(types[x]._id)   ){
                            // console.log( types[x] )
                            indices.push(
                                types[x]
                            )
                    }
                }
            }
        } else {
            logger(`User ${user} doesn't exist`);
        }
    } else {
        logger('Invalid user name');
    }

    return indices;
}

const getTwitterCredentials = async (userName) => {
    let twitterCredentials = [];

    if (userName) {
        let user = await User.findOne({ name: userName }).populate('twitter_credentials');

        if (user) {
            twitterCredentials = user.twitter_credentials;
        } else {
            logger(`User ${user} doesn't exist`);
        }
    } else {
        logger('Can not get Twitter Credentials: Invalid user name');
    }

    return twitterCredentials;
}

const validateIndex = async (userName, index) => {
    let validIndex = false;

    if (userName && index) {
        let user = await findUser(userName);

        if (user && user.indices) {
            validIndex = user.indices.includes(index);
        }
    }

    return validIndex;
}

const getUsers = async () => {
    let users;

    try {
        users = await User.find();
    } catch (err) {
        logger('An error has ocurred while finding all users');
    }

    return users;
}

const deleteUser = async (name) => {
    if (name) {
        User.deleteOne({ name }).then( 
            logger('An error has ocurred while deleting an user')
        ).catch(
            logger('An error has ocurred while deleting an user')
        );
        
    } else {
        logger('Invalid User Name in delete user function');
    }
}

//TODO:
//BRING CREATE USER
//CHANGE USER

module.exports = {
    addTwitterCredential,
    getTwitterCredentials,
    deleteTwitterCredential,
    addIndex,
    deleteIndex,
    getIndices,
    validateIndex,
    deleteUser,
    getUsers
}