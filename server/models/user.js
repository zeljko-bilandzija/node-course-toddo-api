const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        minlength: 1,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail, // value => validator.isEmail(value),
            message: '{VALUE} is not valid email.'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

// Override metode od mongoose za dohvat usera
UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email']);
}

UserSchema.methods.generateAuthToken = function() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();
    user.tokens = user.tokens.concat([{access, token }]);
    return user.save().then(() => token); // ovo vraćamo u server.js -> .then(token => nesto..)
}

UserSchema.methods.removeToken = function(token) {
    const user = this;
    return user.update({
        $pull: {
            tokens: {token}
        }
    });
};

UserSchema.statics.findByToken = function (token) {
    const User = this;
    let decoded;
    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        /* return new Promise((resolve, reject) => {
            reject();
        }); */
        // Simplier version
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};

UserSchema.pre('save', function(next) {
    var user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.statics.findByCredentials = function (email, password) {
    const User = this;
    return User.findOne({email}).then(user => {
        if (!user) {
            return Promise.reject();
        }
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if (err) {
                    reject(err);
                }
                if (res === true) {
                    resolve(user);
                } else {
                    reject();
                }                
            });
        });
    });
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };