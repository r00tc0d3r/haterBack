const { Schema, model } = require('mongoose');

const TypesSchema = Schema({
    type: {type: String, require:true },
    clientId: {
        type: Schema.Types.ObjectId,
        ref: 'Clients'
    }
});

module.exports = model('Types',TypesSchema);