const TwitterCredential = require('../models/twitter-credential.model');
const logger = require('../utils/logger.utils');
const userController = require('./user.controller');
const twitterCredentialModel = require('../models/twitter-credential.model');
const { sendToTweepy } = require('../utils/axios.utils');

/**
 * @param { Date }     from_date  Fecha desde la cual se comenzará a trackear la información de Twitter.
 * @param { Date }     to_date    Fecha hasta la cual se trackeará la información de Twitter, debe ser mayor que from_date.
 * @param { String }   type       Índice en el cual será almacenada la información en Elasticsearch.
 * @param { Boolean }  geo        Geolocalización activada o desactivada (solo cuentas premium pueden trackear geolocalización).
 * @param { [String] } keywords   Palabras clave a trackear a través de la API de Twitter.
 */
const search = async (from_date, to_date, type, geo, keywords, userName) => {
    if (from_date && to_date && type && geo != undefined && keywords && userName) {
        const credential = await getOptimalCredential(geo, userName);

        if (credential) {
            searchData = {
                from_date,
                to_date,
                type,
                geo,
                keywords,
                access_secret_token: credential.access_secret_token,
                access_token: credential.access_token,
                consumer_secret: credential.consumer_secret,
                consumer_token: credential.consumer_token
            }

            sendToTweepy(searchData);
        }
    }
}

const getOptimalCredential = async (geo, userName) => {
    let optimalCredential;
    let userCredentials = await userController.getTwitterCredentials(userName);

    for (let userCredential of userCredentials) {
        if (userCredential.is_premium == geo && (!optimalCredential || userCredential.last_run < optimalCredential.last_run)) {
            optimalCredential = userCredential;
        }
    }

    if (optimalCredential) {
        try {
            TwitterCredential.findByIdAndUpdate({ _id: optimalCredential._id }, { last_run: new Date() }, (err) => {
                if (err) {
                    logger(`An error has ocurred while updating twitter credentials: ${err}`);
                } else {
                    logger('Twitter Credential last run successfully updated');
                }
            });
        } catch (error) {
            logger(`An error has ocurred while geting optimal Twitter credential: ${error}`);
        }
    }

    return optimalCredential;
}

/**
 * @param { Number }   timeInterval  Intervalo de tiempo cada cuanto se ejecutará la búsqueda en DKron en horas.
 * @param { String }   haterUser     Usuario de Hater que inició el job.
 * @param { Object }  jobInfo       Toda la información contenida en el request body necesaria para crear el job.
 */
const cronSearch = (haterUser, timeInterval, jobInfo) => {
    const { index, geo, keywords } = jobInfo;

    if (haterUser && timeInterval && index && geo !== undefined && keywords) {

    }
}

const findCredential = async (app) => {
    let credential;

    try {
        credential = await TwitterCredential.findOne({ app });
    } catch (err) {
        logger('No Twitter Credentials found with indicated user');
    }

    return credential;
}

const createCredential = async (haterUser, credentialInfo) => {
    const { app, user, password, consumer_token, consumer_secret, access_token, access_secret_token, environment_name, tipo } = credentialInfo;

    const existentCredential = await findCredential(app);
    const is_premium = tipo && (tipo === "Premium") ? true : false;
    const is_normal = tipo && (tipo === "Normal") ? true : false;
    const is_sandbox = tipo && (tipo === "Sandbox") ? true : false;

    if (!existentCredential) {
        if (app && consumer_token && consumer_secret && access_token && access_secret_token) {
            try {
                let last_run = new Date();
                last_run.setFullYear(last_run.getFullYear() - 1);

                newCredential = new TwitterCredential({
                    app,
                    user: user || '',
                    password: password || '',
                    consumer_token,
                    consumer_secret,
                    access_token,
                    access_secret_token,
                    environment_name: environment_name || '',
                    is_premium,
                    is_normal,
                    is_sandbox,
                    tipo,
                    last_run
                });

                const credential = await newCredential.save();

                userController.addTwitterCredential(credential, haterUser);

                logger('Twitter credentials successfully created');
            } catch (error) {
                logger(`Error while creating Twitter credentials: ${error}`);
            }
        } else {
            logger('Missing data to create Twitter Credentials');
        }
    } else {
        logger('Twitter Credentials already exists with indicated user');
    }
}

const updateCredential = async (haterUser, credentialInfo) => {
    const { app, user, password, consumer_token, consumer_secret, access_token, access_secret_token, environment_name, is_premium, is_normal, is_sandbox, tipo } = credentialInfo;
    const existentCredential = await findCredential(app);

    if (existentCredential) {
        try {
            existentCredential.user = user || existentCredential.user;
            existentCredential.password = password || existentCredential.password;
            existentCredential.consumer_token = consumer_token || existentCredential.consumer_token;
            existentCredential.consumer_secret = consumer_secret || existentCredential.consumer_secret;
            existentCredential.access_token = access_token || existentCredential.access_token;
            existentCredential.access_secret_token = access_secret_token || existentCredential.access_secret_token;
            existentCredential.environment_name = environment_name || existentCredential.environment_name;
            existentCredential.tipo = tipo || existentCredential.tipo;
            
            if (is_premium !== undefined) existentCredential.is_premium = is_premium;
            if (is_normal !== undefined) existentCredential.is_normal = is_normal;
            if (is_sandbox !== undefined) existentCredential.is_sandbox = is_sandbox;


            existentCredential.save();

            logger('Twitter credentials successfully updated');
        } catch (err) {
            logger(`Error while updating Twitter credentials: ${error}`);
        }
    } else {
        logger('Missing data to update Twitter Credentials');
    }
}

const deleteCredential = async (app, haterUser) => {
    const existentCredential = await findCredential(app);
    if (existentCredential) {
        //TODO: Change callback to promise
        try {
            TwitterCredential.findByIdAndDelete({ _id: existentCredential._id }, (err) => {
                if (err) {
                    logger('Error while deleting twitter credentials');
                } else {
                    userController.deleteTwitterCredential(existentCredential._id, haterUser);
                    logger('Twitter Credential successfully deleted');
                }
            });

        } catch (error) {
            console.log(`Error while deleting document: ${error}`);
        }
    }
}

module.exports = {
    search,
    cronSearch,
    createCredential,
    updateCredential,
    deleteCredential
};
