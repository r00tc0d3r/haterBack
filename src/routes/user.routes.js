const route = require('express');
const routerMethod = route.Router();
const httpStatus = require('http-status-codes');
const { validateJWT } = require('../middlewares/validate.middleware');
const { signup, loginUser, revalidateToken } = require('../controllers/auth.controller');
const auth = require('../middlewares/validate.middleware');
const userController = require('../controllers/user.controller');
const twitterController = require('../controllers/twitter.controller');

routerMethod.post('/login', loginUser);

routerMethod.post('/signup', signup);

routerMethod.get('/renew', validateJWT, revalidateToken);

routerMethod.get('/',
    auth.validateJWT,
    async function (request, response) {
        const users = await userController.getUsers();

        if (users) {
            response.status(httpStatus.OK).json(users);
        } else {
            response.sendStatus(httpStatus.BAD_REQUEST);
        }
    }
);

routerMethod.delete('/',
    auth.validateJWT,
    async function (request, response) {
        const { name } = request.body;

        if (name) {
            userController.deleteUser(name);
            response.sendStatus(httpStatus.OK);
        } else {
            response.sendStatus(httpStatus.BAD_REQUEST);
        }
    }
);

routerMethod.get('/twitter-credentials',
    auth.validateJWT,
    async function (request, response) {
        const haterUser = request.name;
        const credentials = await userController.getTwitterCredentials(haterUser);

        if (credentials) {
            response.status(httpStatus.OK).json(credentials);
        } else {
            response.sendStatus(httpStatus.BAD_REQUEST);
        }
    }
);

routerMethod.post('/twitter-credentials',
    auth.validateJWT,
    function (request, response, next) {
        const body = request.body;
        const haterUser = request.name;
        const { app, consumer_token, consumer_secret, access_token, access_secret_token } = body;

        if (app && consumer_token && consumer_secret && access_token && access_secret_token) {
            twitterController.createCredential(haterUser, body);

            response.sendStatus(httpStatus.OK);
        } else {
            response.status(httpStatus.BAD_REQUEST).send('Faltan datos o datos incorrectos en la petición');
        }
    }
);

routerMethod.delete('/twitter-credentials',
    auth.validateJWT,
    function (request, response, next) {
        const body = request.body;
        const haterUser = request.name;
        const { app } = body;
        console.log(app);
        if (app) {
            twitterController.deleteCredential(app, haterUser);

            response.sendStatus(httpStatus.OK);
        } else {
            response.status(httpStatus.BAD_REQUEST).send('Debe indicarse el usuario de las credenciales a eliminar.');
        }
    }
);

routerMethod.post('/index',
    auth.validateJWT,
    async (request, response, next) => {
        const body = request.body;
        const haterUser = request.name;
        const { index, clientId} = body;

        if (index) {
            const addIndexRes = await userController.addIndex(index, haterUser, clientId);

            if( addIndexRes === -1 )
                response.status(httpStatus.BAD_REQUEST)
            
            response.status(httpStatus.OK).json({
                id: addIndexRes
            });
        } else {
            response.status(httpStatus.BAD_REQUEST).send('Debe indicarse el usuario de las credenciales a eliminar');
        }
    }
);

routerMethod.delete('/index',
    auth.validateJWT,
    async (request, response, next) => {
        const body = request.body;
        const haterUser = request.name;
        const { id } = body;

        if (id) {
            const indexDeleted = await userController.deleteIndex(id, haterUser);
            response.status(httpStatus.OK).json(indexDeleted);
        } else {
            response.status(httpStatus.BAD_REQUEST).send('Debe indicarse el usuario de las credenciales a eliminar');
        }
    }
);

<<<<<<< Updated upstream
routerMethod.get('/indices',
=======
/** -------------------------------------------------------------------------------
*  get('/indices') -
*  Obtiene todos los indices
*  Se necesitan:
        headers: x-access-token = token
        request.name: el nombre del usuario que se guardara como haterUser
*  @author Agustin Molas Demitropulos
*  @date   17/10/2020
------------------------------------------------------------------------------- */
routerMethod.get('/index',
>>>>>>> Stashed changes
    auth.validateJWT,
    async function (request, response, next) {
        const haterUser = request.name;

        const indices = await userController.getIndices(haterUser);

        response.status(httpStatus.OK).json(indices);
    }
);

module.exports = routerMethod;