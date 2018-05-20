const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server');
const { Todo } = require('../models/todo');
const { User } = require('../models/user');
const { todos, populateTodos, users, populateUsers } = require('./seed/seed');

beforeEach(populateTodos);
beforeEach(populateUsers);

describe('Server', () => {
    describe('POST /todos', () => {
        it('should create a new todo', done => {
            const text = 'Test todo text';
            request(app)
                .post('/todos')
                .set('x-auth', users[0].tokens[0].token)
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
                .set('x-auth', users[0].tokens[0].token)
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
                .set('x-auth', users[0].tokens[0].token)
                .expect(200).expect(res => {
                    expect(res.body.todos.length).toBe(1);
                })
                .end(done);
        });
    });

    describe('GET /todo/:id', () => {
        it('should return document on correct id', done => {
            request(app)
                .get(`/todo/${todos[0]._id.toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect(res => {
                    expect(res.body.todo.text).toBe(todos[0].text);
                })
                .end(done);
        });

        it('should not return document created by other user', done => {
            request(app)
                .get(`/todo/${todos[1]._id.toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return 404 if todo not found', done => {
            const id = new ObjectID().toHexString();
            request(app)
                .get(`/todo/${id}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object ids', done => {
            request(app)
                .get(`/todo/123`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });

    describe('DELETE /todo:id', () => {
        it('should return document on delete by id', done => {
            const id = todos[0]._id.toHexString();
            request(app)
                .delete(`/todo/${todos[0]._id.toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
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

        it('should not remove todo from other user', done => {
            const id = todos[1]._id.toHexString();
            request(app)
                .delete(`/todo/${todos[1]._id.toHexString()}`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    Todo.findById(id).then(doc => {
                        expect(doc).toExist();
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
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object ids', done => {
            request(app)
                .delete(`/todo/123`)
                .set('x-auth', users[0].tokens[0].token)
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
                .set('x-auth', users[0].tokens[0].token)
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
                .set('x-auth', users[0].tokens[0].token)
                .send({text, completed: false})
                .expect(200)
                .expect(res => {
                    expect(res.body.todo.text).toBe(text)
                    expect(res.body.todo.completed).toBe(false)
                    expect(res.body.todo.completedAt).toNotExist();
                })
                .end(done);
        });

        it('should not update todo created by other user', done => {
            const id = todos[1]._id.toHexString();
            const text = 'New updated text';
            request(app)
                .patch(`/todo/${id}`)
                .set('x-auth', users[0].tokens[0].token)
                .send({text, completed: true})
                .expect(404)
                .end(done);
        });

        it('should return 404 for non-object ids', done => {
            request(app)
                .patch(`/todo/123`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(404)
                .end(done);
        });
    });

    describe('GET /users/me', () => {
        it('should return user if authenticated', done => {
            request(app)
                .get(`/users/me`)
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .expect(res => {
                    expect(res.body._id).toBe(users[0]._id.toHexString());
                    expect(res.body.email).toBe(users[0].email);
                })
                .end(done);
        });

        it('should return 401 if user is not authenticated', done => {
            request(app)
                .get('/users/me')
                .expect(401)
                .expect(res => {
                    expect(res.body).toEqual({});
                })
                .end(done);
        });
    });

    describe('POST /users', () => {
        it('should create user', done => {
            const email = 'example@example.com';
            const password = '123456';
            request(app)
                .post('/users')
                .send({email, password})
                .expect(200)
                .expect(res => {
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body._id).toExist();
                    expect(res.body.email).toBe(email);
                })
                .end(err => {
                    if (err) {
                        return done(err);
                    }
                    User.findOne({email}).then(user => {
                        expect(user).toExist();
                        expect(user.password).toNotBe(password);
                        done();
                    }).catch(errorDb => {
                        return done(errorDb);
                    });
                });
        });

        it('should return validate errors if request invalid', done => {
            const email = 'email';
            const password = '123';
            request(app)
                .post('/users')
                .send({email, password})
                .expect(400)
                .end(done);
        });

        it('should not create user if email in use', done => {
            request(app)
                .post('/users')
                .send({email: users[0].email, password: '123456'})
                .expect(400)
                .end(done);
        });
    });

    describe('POST /users/login', () => {
        it('should loggin user and return auth token', done => {
            request(app)
                .post('/users/login')
                .send({email: users[1].email, password: users[1].password})
                .expect(200)
                .expect(res => {
                    expect(res.headers['x-auth']).toExist();
                    expect(res.body._id).toExist();
                    expect(res.body.email).toBe(users[1].email);
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    User.findById(users[1]._id).then(user => {
                        expect(user.tokens[1]).toInclude({
                            access: 'auth',
                            token: res.headers['x-auth']
                        });
                        done();
                    }).catch(errorDb => {
                        return done(errorDb);
                    });
                });
        });

        it ('should reject invalid login', done => {
            request(app)
                .post('/users/login')
                .send({email: users[0].email, password: '12345678'})
                .expect(400)
                .expect(res => {
                    expect(res.headers['x-auth']).toNotExist();
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    User.findById(users[1]._id).then(user => {
                        expect(user.tokens.length).toBe(1);
                        done();
                    }).catch(errorDb => {
                        return done(errorDb);
                    });
                });
        });
    });

    describe('DELETE /users/me/token', () => {
        it ('should remove auth token on logout', done => {
            request(app)
                .delete('/users/me/token')
                .set('x-auth', users[0].tokens[0].token)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        done(err);
                    }
                    User.findById(users[0]._id).then(user => {
                        expect(user.tokens.length).toBe(0);
                        done();
                    }).catch(error => {
                        done(error);
                    });
                });
        });
    });
});