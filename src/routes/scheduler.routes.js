const route = require('express');
const routerMethod = route.Router();
const httpStatus = require('http-status-codes');
const auth = require('../middlewares/auth.middleware');
const scrapper = require('../services/sheduler/sheduler.service');

routerMethod.post('/', 
    auth.authMiddleware,
    function (req, res, next){
        if(req.body){
            next();
        }else{
            res.status(httpStatus.BAD_REQUEST)
            res.send({error: httpStatus.getStatusText(httpStatus.BAD_REQUEST)})
        }
    },
    scrapper.addJob
);

routerMethod.get('/', 
    auth.authMiddleware,
    scrapper.getAllJobs
);

routerMethod.get('/:id', 
    auth.authMiddleware,
    scrapper.getJob

);y

routerMethod.post('/run', 
    auth.authMiddleware,
    scrapper.runJob
);

routerMethod.post('/toggle', 
    auth.authMiddleware,
    scrapper.toogleJob
);

routerMethod.delete('/:id',
    auth.authMiddleware,
    scrapper.deleteJob
)


module.exports = routerMethod;