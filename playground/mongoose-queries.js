const { ObjectID } = require('mongodb');
const {mongoose} = require('../server/db/mongoose');
const {Todo} = require('../server/models/todo');
const {User} = require('../server/models/user');

const id = '5aeb12d58421b431506ef1f2';
const userId = '5aea5412682fe25c9cb982ca';

if (!ObjectID.isValid(id)) {
    return console.log("Object ID is not valid");
}

if (!ObjectID.isValid(userId)) {
    return console.log("User Object ID is not valid");
}

// Vraća array, ili []
/* Todo.find({ _id: id }).then(todos => {
    if (todos.length === 0) {
        return console.log('No result.');
    }
    console.log('Todos', todos);
}); */

// Vraća objekt ili null
/* Todo.findOne({_id: id}).then(todo => {
    if (!todo) {
        return console.log('No result');
    }
    console.log('First Todo', todo);
}); */

// Vraća objekt ili null
Todo.findById(id).then(todo => {
    if (!todo) {
        return console.log('No result');
    }
    console.log('Todo By Id', todo);
}).catch(error => console.log('Error', error));

User.findById(userId).then(user => {
    if (!user) {
        return console.log('User not found');
    }
    console.log('User: ', JSON.stringify(user, undefined, 4))
}).catch(error => console.log('Error', error));