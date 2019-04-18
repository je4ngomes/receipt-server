import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import Receipt from './Receipt';

const User = mongoose.Schema({
    name: String,
    company: String,
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    receipts: [Receipt]
});

User.statics.findUserByCredentials = function(username, password) {
    const User = this;

    return User.findOne({ username })
        .then(user => {
            if (!user) return Promise.reject();

            return bcrypt.compare(password, user.password)
                    .then(result => {
                        if (result)
                            return user;
                    });
            });   
};

User.pre('save', function(next) {
    const user = this;

    if (user.isModified('password')) {
        return bcrypt.genSalt(10)
            .then(salt => 
                bcrypt.hash(user.password, salt)
                    .then(hash => {
                        user.password = hash;
                        next();
                    })
            );
    }
    next();
});

mongoose.model('user', User);