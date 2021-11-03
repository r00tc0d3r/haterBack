const { Schema, model } = require('mongoose');

const youtubeCredentialSchema = Schema({
    user:     { type: String , required: true },
    password: { type: String },
    token:    { type: String , required: true },
    last_Run: { type: Date }
});

// TODO: add methods to tokenize keys

module.exports = model('YoutubeCredentials', youtubeCredentialSchema);
