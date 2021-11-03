const {Schema, model , Types} = require('mongoose');

const userSchema = Schema({
    name:      { type: String, require: true },
    password:  { type: String, require: true },
    level:     { type: String },
    indices:   [{ 
        type: Schema.Types.ObjectId,
        ref: 'Types' 
    }],
    twitter_credentials: [{
        type: Schema.Types.ObjectId,
        ref: 'TwitterCredentials'
    }]
});

module.exports = model('Users', userSchema);