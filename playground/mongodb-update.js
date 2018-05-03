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

    /* db.collection('Todos').findOneAndUpdate({
        _id: new ObjectID('5aea169ee2fdae55a46288ba')
        }, { $set: { completed: true } }, { returnOriginal: false }).then(result => {
        console.log(JSON.stringify(result, undefined, 4));
    }).catch(error => console.log('Unable fetch docs')); */

    db.collection('Users').findOneAndUpdate({
        _id: new ObjectID('5ae9e72bb7c3325e3c42cdc9')
        }, { $set: { name: 'Željko Bilandžija' }, $inc: { age: 1 } }, { returnOriginal: false }).then(result => {
        console.log(JSON.stringify(result, undefined, 4));
    }).catch(error => console.log('Unable fetch docs'));

    client.close();
});