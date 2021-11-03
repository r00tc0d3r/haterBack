const mongoose = require('mongoose');

const dbConnection = async () => {
    mongoose.set('useFindAndModify', false);

    mongoose.connect(process.env.MONGODBURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    }).then(db => console.log('Mongodb connect OK'))
      .catch(err => console.log(err));

}

module.exports = {
    dbConnection
}