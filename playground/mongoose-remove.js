const { ObjectID } = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

const id = '5aeb4f268801342f6822c72e';
const userId = '5aea5412682fe25c9cb982ca';

if (!ObjectID.isValid(id)) {
    return console.log("Object ID is not valid");
}

if (!ObjectID.isValid(userId)) {
    return console.log("User Object ID is not valid");
}

// result { result: { ok: 1, n: 3 }}
/* Todo.remove({}).then(result => {
    console.log('Result', result); 
}); */

// result je objekt
// Todo.findOneAndRemove({});
// result je objekt
Todo.findByIdAndRemove(id).then(doc => {
    console.log('Deleted: ', doc);
}).catch(error => {
    console.log(error);
});