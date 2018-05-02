const { MongoClient, ObjectID } = require('mongodb');

const mongoOptions = {
    user: 'cigara9393',
    password: 'Daniel01!',
    auth: {
        authdb: 'admin'
    }
};

MongoClient.connect('mongodb://127.0.0.1:27017', mongoOptions, (error, client) => {
    if (error) {
        return console.log('Mongodb Connect Error: ', error);
    }
    const db = client.db('TodoApp');

    console.log('Connected to MongoDB');

    /* db.collection('Todos').find().toArray().then(docs => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 4));
    }).catch(error => console.log('Unable fetch docs')); */

    /* db.collection('Users').find().toArray().then(docs => {
        console.log('Users');
        console.log(JSON.stringify(docs, undefined, 4));
    }).catch(error => console.log('Unable fetch docs')); */

    /* db.collection('Todos').find({completed: true}).toArray().then(docs => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 4));
    }).catch(error => console.log('Unable fetch docs')); */

    /* db.collection('Todos').find({_id: new ObjectID("5ae9e636bcf3a74e44f06910")}).toArray().then(docs => {
        console.log('Todos');
        console.log(JSON.stringify(docs, undefined, 4));
    }).catch(error => console.log('Unable fetch docs')); */

    /* db.collection('Todos').find().count().then(count => {
        console.log('Todos:', count);
    }).catch(error => console.log('Unable fetch docs')); */

    db.collection('Users').find({name: 'Nikolina Bilandzija'}).toArray().then(docs => {
        console.log('Users:');
        console.log(JSON.stringify(docs, undefined, 4));
    }).catch(error => console.log('Unable fetch docs'));

    client.close();
});