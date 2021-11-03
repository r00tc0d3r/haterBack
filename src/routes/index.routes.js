const { Router } = require('express');
const httpStatus = require('http-status-codes');
const user       = require('./user.routes');
const twitter    = require('./twitter.routes');

const routerMethod = Router();

// Rest-API endpoints
routerMethod.use('/user', user);
routerMethod.use('/twitter', twitter);

module.exports = routerMethod;