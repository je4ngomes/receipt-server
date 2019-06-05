import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import autoPopulate from 'mongoose-autopopulate';

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
    password: { type: String, select: false },
    receipts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'receipt', autopopulate: true }]
});

User.plugin(autoPopulate);

User.statics.findUserByCredentials = function(username, password) {
    const User = this;

    return User.findOne({ username })
        .select('+password')
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