const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');

const todos = [
    { _id: new ObjectID(), text: 'First test todo' },
    { _id: new ObjectID(), text: 'Second test todo', completed: true, completedAt: 333333 }
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
        });
    });

    describe('DELETE /todo:id', () => {
        it('should return document on delete by id', done => {
            const id = todos[0]._id.toHexString();
            request(app)
                .delete(`/todo/${todos[0]._id.toHexString()}`)
                .expect(200)
                .expect(res => {
                    expect(res.body.todo._id).toBe(id);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.findById(id).then(doc => {
                        expect(doc).toNotExist();
                        done();
                    }).catch(error => {
                        return done(error);
                    });
                });
        });

        it('should return 404 if todo not found', done => {
            const id = new ObjectID().toHexString();
            request(app)
                .delete(`/todo/${id}`)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object ids', done => {
            request(app)
                .delete(`/todo/123`)
                .expect(404)
                .end(done);
        });
    });

    describe('PATCH /todo:id', () => {
        it('should update todo', done => {
            const id = todos[0]._id.toHexString();
            const text = 'New updated text';
            request(app)
                .patch(`/todo/${id}`)
                .send({text, completed: true})
                .expect(200)
                .expect(res => {
                    expect(res.body.todo.text).toBe(text)
                    expect(res.body.todo.completed).toBe(true)
                    expect(res.body.todo.completedAt).toBeA('number');
                })
                .end(done);
        });

        it('should clear completedAt when todo is not completed', done => {
            const id = todos[0]._id.toHexString();
            const text = 'New updated text';
            request(app)
                .patch(`/todo/${id}`)
                .send({text, completed: false})
                .expect(200)
                .expect(res => {
                    expect(res.body.todo.text).toBe(text)
                    expect(res.body.todo.completed).toBe(false)
                    expect(res.body.todo.completedAt).toNotExist();
                })
                .end(done);
        });

        it('should return 404 for non-object ids', done => {
            request(app)
                .patch(`/todo/123`)
                .expect(404)
                .end(done);
        });
    });
});