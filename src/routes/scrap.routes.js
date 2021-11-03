const route = require('express');
const routerMethod = route.Router();
const { scrap } = require('../controllers/scrap.controller');
const { validateJWT } = require('../middlewares/validate.middleware');



routerMethod.get('/', async (req, res) => {
    res.status(200).json({
        ok: 'ok'
    })
})
routerMethod.post('/start',validateJWT, async (req, res) => {
    const body = req.body;
    const haterUser = req.name;

    
    const { relaunched } = body;

    scrap({...body, user: haterUser,relaunched})
        .then( (value) => {
            return res.status(200).json({
                msg: value
            })
        })
        .catch( (error) => {
            return res.status(500).json({
                msg: error
            })
        })
})


module.exports = routerMethod;