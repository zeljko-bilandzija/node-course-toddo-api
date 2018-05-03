const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
    { _id: new ObjectID(), text: 'First test todo' },
    { _id: new ObjectID(), text: 'Second test todo' }
];

beforeEach(done => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
});

describe('Server', () => {
    describe('POST /todos', () => {
        it('should create a new todo', done => {
            const text = 'Test todo text';
            request(app)
                .post('/todos')
                .send({ text })
                .expect(200)
                .expect(response => {
                    expect(response.body.text)
                    .toBe(text);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.find({text}).then((todos) => {
                        expect(todos.length).toBe(1);
                        expect(todos[0].text).toBe(text);
                        done();
                    }).catch(error => done(error));
                });
        });

        it('should not create todo with invalid body data', done => {
            request(app)
                .post('/todos')
                .send({})
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.find().then(todos => {
                        expect(todos.length).toBe(2);
                        done();
                    }).catch(error => done(error));
                });
        });
    });

    describe('GET /todos', () => {
        it('should get all todos', done => {
            request(app)
                .get('/todos')
                .expect(200).expect(res => {
                    expect(res.body.todos.length).toBe(2);
                })
                .end(done);
        });
    });

    describe('GET /todo:id', () => {
        it('should return document on correct id', done => {
            request(app)
                .get(`/todo/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect(res => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
                .end(done);
        });

        it('should return 404 if todo not found', done => {
            const id = new ObjectID().toHexString();
            request(app)
                .get(`/todo/${id}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object ids', done => {
            request(app)
                .get(`/todo/123`)
                .expect(404)
                .end(done);
        })
    })
});