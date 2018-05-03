const express = require('express');
const bodyParser = require('body-parser'); // Konvertira json u objekt
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

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

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = { app };