const mongoose = require('mongoose');

const mongoOptions = {
    user: 'cigara9393',
    pass: 'Daniel01!',
    auth: {
        authdb: 'admin'
    }
};
mongoose.Promise = global.Promise;
// mongodb://cigara9393:Daniel01!@127.0.0.1:27017/TodoApp?authSource=admin moze i bez opcija
mongoose.connect(process.env.MONGODB_URI || 'mongodb://cigara9393:Daniel01!@127.0.0.1:27017/TodoApp?authSource=admin', mongoOptions);
console.log('Mongoose connected.');
module.exports = { mongoose };