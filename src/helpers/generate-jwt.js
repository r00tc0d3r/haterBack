const jwt = require('jsonwebtoken');

const generateJWT = ( userid, name ) => {

    return new Promise( (resolve, reject) => {

        const payload = { userid, name };

        jwt.sign( payload, process.env.TOKEN_SECRET, {
        }, (err, token ) => {
            
            if ( err ){
                console.log(err);
                reject('No se pudo generar el token');
            }
            resolve( token );
        })
    })
}


module.exports = {
    generateJWT
}