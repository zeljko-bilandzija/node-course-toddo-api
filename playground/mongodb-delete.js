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

    db.collection('Todos').deleteMany({text: 'Eat luch'}).then(result => {
        console.log(JSON.stringify(result, undefined, 4));
    }).catch(error => console.log('Unable fetch docs'));

    // Briše prvi koji nađe i vraća count n
    /* db.collection('Todos').deleteOne({text: 'Some other text'}).then(result => {
        console.log(JSON.stringify(result, undefined, 4));
    }).catch(error => console.log('Unable fetch docs')); */

    // Pronalazi jedan record, briše ga i vraća sve podatke u value
    /* db.collection('Todos').findOneAndDelete({text: 'Some other text'}).then(result => {
        console.log(JSON.stringify(result, undefined, 4));
    }).catch(error => console.log('Unable fetch docs')); */

    db.collection('Users').deleteMany({name: 'Zeljko Bilandzija'}).then(result => {
        console.log(JSON.stringify(result, undefined, 4));
    }).catch(error => console.log('Unable fetch docs'));

    db.collection('Users').findOneAndDelete({_id: new ObjectID('5ae9e8dd9d2db91108f5d154')}).then(result => {
        console.log(JSON.stringify(result, undefined, 4));
    }).catch(error => console.log('Unable fetch docs'));

    client.close();
});