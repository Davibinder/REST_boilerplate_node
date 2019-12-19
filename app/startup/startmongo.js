const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

const dbURL = "mongodb://localhost:27017/balka_dev";

module.exports = async () => {
    const options = {
        useNewUrlParser: true,
        useCreateIndex: true,
        reconnectTries: 20,
        reconnectInterval: 2000,
    };
    await mongoose.connect(dbURL, options);
    console.log('Mongo connected at ', dbURL);
};