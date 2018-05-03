require('./config/config');
const express = require('express');
const bodyParser = require('body-parser'); // Konvertira json u objekt
const { ObjectID } = require('mongodb');
const _ = require('lodash');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    const todo = new Todo({
        text: req.body.text
    });
    todo.save()
        .then(doc => res.send(doc))
        .catch(error => res.status(400).send(error));
});

app.get('/todos', (req, res) => {
    const todos = Todo.find().then(todos => {
        res.send({ todos });
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.get('/todo/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    const todos = Todo.findById(id).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.delete('/todo/:id', (req, res) => {
    const id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }
    const todos = Todo.findByIdAndRemove(id).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({ todo });
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.patch('/todo/:id', (req, res) => {
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

    const todos = Todo.findByIdAndUpdate(id, {$set: updatedTodo}, { new: true }).then(todo => {
        if (!todo) {
            return res.status(404).send();
        }
        
        res.send({ todo });
    }).catch(error => {
        res.status(400).send(error);
    });
});

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

module.exports = { app };