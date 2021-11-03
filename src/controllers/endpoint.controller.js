
const Endpoints = require('../models/endpoints.model');

const getEndpoints = async () => {
    let endpoints;
    return new Promise( async(resolve, reject) => {

        try {
            const endpoints = await Endpoints.find();
            resolve( endpoints )
        } catch (error) {
            reject( error )
        }
    })
    // } catch (error) {
    //     throw Error (error);
    // }

    // return endpoints;
}

module.exports = {
    getEndpoints
}