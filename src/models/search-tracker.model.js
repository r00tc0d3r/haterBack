const {Schema, model } = require('mongoose');

const searchTracker = Schema({
    users_keywords: [{ type: String, required: true }],
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Clients'
    } ,
    social_network: {type: String, required: true},
    social_port: { type: String },
    index:   { type: String, required: true },
    premium: {type: Boolean},
    keywords: {type: Boolean},
    endpoint: {type:String},
    userName: {type:String},
    date: {type: Date}
});

module.exports = model('SearchTracker', searchTracker);