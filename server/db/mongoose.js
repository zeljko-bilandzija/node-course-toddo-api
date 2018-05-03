const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);
console.log('Mongoose connected.');
module.exports = { mongoose };

process.env.NODE_ENV