require('./config/config');
const express = require('express');
const bodyParser = require('body-parser'); // Konvertira json u objekt
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');
const { authenticate }  = require('./middleware/authenticate');

const app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate, (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save()
        .then(doc => res.send(doc))
        .catch(error => res.status(400).send(error));
});

app.get('/todos', authenticate, (req, res) => {
    const todos = Todo.find({_creator: req.user._id}).then(todos => {
        res.send({ todos });
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.get('/todo/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    Todo.findOne({_id: id, _creator: req.user._id}).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.delete('/todo/:id', authenticate, (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    const todos = Todo.findOneAndRemove({_id: id, _creator: req.user._id}).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.patch('/todo/:id', authenticate, (req, res) => {
    const id = req.params.id;
    // Pick uzima samo ona polja kja su nabrojana ako su tamo. ostala ignorira.
    const updatedTodo = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(updatedTodo.completed) && updatedTodo.completed) {
        updatedTodo.completedAt = new Date().getTime();
    } else {
        updatedTodo.completed = false;
        updatedTodo.completedAt = null;
    }

    Todo.findOneAndUpdate({ _id: id, _creator: req.user._id}, { $set: updatedTodo }, { new: true }).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        
        res.send({ todo });
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.post('/users', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const user = new User(body);
    user.save()
        .then(() => user.generateAuthToken())
        .then(token => res.header('x-auth', token).send(user))
        .catch(error => res.status(400).send(error));
});

app.post('/users/login', (req, res) => {
    const body = _.pick(req.body, ['email', 'password']);
    const hashedPassword = '';
    User.findByCredentials(body.email, body.password).then(user => {
        return user.generateAuthToken().then(token => {
            res.header('x-auth', token).send(user);
        });
    }).catch(err => {
        res.status(400).send();
    });
});

app.get('/users/me', authenticate, (req, res) => {
    /* const token = req.header('x-auth');
    User.findByToken(token).then(user => {
        if(!user) {
            return Promise.reject();
        }
        res.send(user);
    }).catch(error => {
        res.status(401).send();
    }); */
    res.send(req.user);
});

app.delete('/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(() => {
        res.status(200).send();
    }).catch(err => {
        res.status(400).send();
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = { app };