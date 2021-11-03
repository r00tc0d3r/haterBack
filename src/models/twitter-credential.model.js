const { Schema, model } = require('mongoose');

const twitterCredentialSchema = Schema({
    app:                 { type: String , required: true },
    user:                { type: String },
    password:            { type: String },
    consumer_token:      { type: String , required: true },
    consumer_secret:     { type: String , required: true },
    access_token:        { type: String , required: true },
    access_secret_token: { type: String , required: true },
    environment_name:    { type: String },
    is_premium:          { type: Boolean },
    is_normal:           { type: Boolean },
    is_sandbox:          { type: Boolean },
    tipo:                { type: String },
    last_run:            { type: Date }
});

// TODO: add methods to tokenize keys
module.exports =  model('TwitterCredentials', twitterCredentialSchema);