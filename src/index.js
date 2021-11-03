require('dotenv').config();
const express       = require('express');
const cors          = require('cors');
const morgan        = require('morgan');
const bodyParser    = require('body-parser');
const indexRoutes   = require('./routes/index.routes');        
const { dbConnection }  = require('./database/config');

const app = express();

//Connect Data Base
dbConnection();

//Allow CORS
const allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
}
app.use(allowCrossDomain);
app.use(cors({
    origin: process.env.URL_CENTRAL,
    credentials: true
}))

//Set Port
app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));

//Middlewares
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());


//Routes
app.use(indexRoutes);

const server = app.listen(app.get('port'), () => {
    console.log(`server listening on ${app.get('port')}`)
});