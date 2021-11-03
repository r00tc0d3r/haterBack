const route = require('express');
const routerMethod = route.Router();
const { getEndpoints } = require('../controllers/endpoint.controller');

routerMethod.get('/', async (req, res ) => {
    
    getEndpoints().
        then( e => {
            res.status(200).json(e);
        }).
        catch( er => {
            res.status(500).json({er})
        })
        
})


module.exports = routerMethod;