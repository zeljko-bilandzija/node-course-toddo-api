const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const { Todo } = require('../../models/todo');
const { User } = require('../../models/user');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();

const todos = [
    { _id: new ObjectID(), text: 'First test todo', _creator: userOneId },
    { _id: new ObjectID(), text: 'Second test todo', completed: true, completedAt: 333333, _creator: userTwoId }
];

const users = [
    {
        _id: userOneId,
        email: 'zeljko@gmail.com',
        password: '1234567',
        tokens: [{
            token: jwt.sign({_id: userOneId, access: 'auth'}, process.env.JWT_SECRET).toString(),
            access: 'auth'
        }]
    },
    {
        _id: userTwoId,
        email: 'zeljko1@gmail.com',
        password: '12345678',
        tokens: [{
            token: jwt.sign({_id: userTwoId, access: 'auth'}, process.env.JWT_SECRET).toString(),
            access: 'auth'
        }]
    }
]

const populateTodos = done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = done => {
    User.remove({}).then(() => {
        const userOne = new User(users[0]).save();
        const userTwo = new User(users[1]).save();
        return Promise.all([
            userOne,
            userTwo
        ]);
    }).then(() => done());
};

module.exports = {
    populateTodos,
    todos,
    populateUsers,
    users
};