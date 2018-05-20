const { SHA256 } = require('crypto-js'); // used for making hash
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Bcrypt
const password = 'abc123!';
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log('hash: ', hash);
    });
});

const hashedPassword = '$2a$10$8z9PWj.5aUV72TUcELiT0OfaD55pZ/TaYGSdYappN0fwu2UjrmNr.';
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log('Compare: ', res)
});

// jwt.sign - uzima objekt (data sa userid), potpisuje, kreira hash i vraća vrijednost tokena
// jwt.verify - uzima token i uspoređuje hasheve
const data = {
    id: 10
};

const token = jwt.sign(data, '123abc');
console.log(token);

const decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded);

// SHA256 play
/*
const message = 'I am user number 3';
const hash = SHA256(message).toString();
console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

const data = {
    id: 4
};
const token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'somesecret').toString(),
};
const resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
// token.data.id = 4;
// token.hash = SHA256(JSON.stringify(data)).toString();
if (resultHash === token.hash) {
    console.log('It is secured');
} else {
    console.log('Hack');
}
*/