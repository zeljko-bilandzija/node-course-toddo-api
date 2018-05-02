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

    /* db.collection('Todos').insertOne({
        text: 'Something to do',
        completed: false
    }, (dbError, result) => {
        if (dbError) {
            return console.log('Unable to insert todo', dbError);
        }
        console.log(JSON.stringify(result.ops, undefined, 4));
    }); */

    db.collection('Users').insertOne({
        name: 'Zeljko Bilandzija',
        age: 38,
        location: 'Pula, Grožnjanska 28'
    }, (dbError, result) => {
        if (dbError) {
            return console.log('Unable to insert todo', dbError);
        }
        console.log(result.ops[0]._id.getTimestamp());
    });

    client.close();
});