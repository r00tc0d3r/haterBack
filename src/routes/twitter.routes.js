const route = require('express');
const routerMethod = route.Router();
const auth = require('../middlewares/validate.middleware');
const httpStatus = require('http-status-codes');
const twitterController = require('../controllers/twitter.controller');
const { validateIndex } = require('../controllers/user.controller');
const { validateDate } = require('../utils/date.utils');
const dateUtils = require('../utils/date.utils');

routerMethod.post('/search',
    auth.validateJWT,
    function (request, response, next) {
        const body = request.body;
        const haterUser = request.name;
        const { from_date, to_date, index, geo, keywords } = body;

        if (from_date && to_date && index && geo !== undefined && keywords) {
            const validTimeInterval = validateDate(from_date, to_date);
            const validIndex = validateIndex(haterUser,index);

            if (validTimeInterval && validIndex) {
                twitterController.search(validTimeInterval.from, validTimeInterval.to, index, geo, keywords, haterUser);

                response.sendStatus(httpStatus.OK);
            } else {
                if (!validTimeInterval) {
                    response.status(httpStatus.BAD_REQUEST).send('Intervalo de tiempo inválido, verifique que la fecha desde sea menor que la fecha hasta');
                } else if (!validIndex){
                    response.status(httpStatus.BAD_REQUEST).send('Indice inválido, verifique que el indice corresponda al usuario logueado');
                }
            }
        } else {
            response.status(httpStatus.BAD_REQUEST).send('Faltan datos o datos incorrectos en la petición');
        }
    }
);

routerMethod.post('/search/job',
    auth.validateJWT,
    function (request, response, next) {
        const body = request.body;
        const haterUser = request.name;
        const { interval, index,  geo, keywords } = body;

        const timeInterval = dateUtils.setTimeInterval(interval);

        if (timeInterval && index && geo !== undefined && keywords && jobName) {
            twitterController.cronSearch(haterUser, timeInterval, body);

            response.sendStatus(httpStatus.OK);
        } else {
            response.sendStatus(httpStatus.BAD_REQUEST);
        }
    }
);

routerMethod.post('/credential',
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

routerMethod.put('/credential',
    auth.validateJWT,
    function (request, response, next) {
        const body = request.body;
        const haterUser = request.name;
        const { app } = body;

        if (app) {
            twitterController.updateCredential(haterUser, body);

            response.sendStatus(httpStatus.OK);
        } else {
            response.status(httpStatus.BAD_REQUEST).send('Debe indicarse el usuario a actualizar.');
        }
    }
);

routerMethod.delete('/credential',
    auth.validateJWT,
    function (request, response, next) {
        const body = request.body;
        const haterUser = request.name;
        const { app } = body;

        if (app) {
            twitterController.deleteCredential(app, haterUser);
            response.sendStatus(httpStatus.OK);
        } else {
            response.status(httpStatus.BAD_REQUEST).send('Debe indicarse el usuario de las credenciales a eliminar.');
        }
    }
);

module.exports = routerMethod;