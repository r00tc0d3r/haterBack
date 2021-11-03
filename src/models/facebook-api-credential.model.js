import { Schema, model } from 'mongoose';

const facebookApiCredentialSchema = Schema({
    user:     { type: String , required: true },
    fanpage:  { type: String , required: true },
    password: { type: String },
    token:    { type: String , required: true },
    last_Run:  { type: Date }
});

// TODO: add methods to tokenize keys

export default model('FacebookApiCredentials', facebookApiCredentialSchema);
