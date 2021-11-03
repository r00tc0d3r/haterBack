const {Schema, model } = require('mongoose');

const endpointSchema = Schema({
    endpoint: { type: String, require: true, unique: true}
});

module.exports = model('Endpoint', endpointSchema );