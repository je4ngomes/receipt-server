import mongoose from 'mongoose';

const User = mongoose.Schema({
    name: String,
    company: String,
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    recepts: [Recepts]
});

mongoose.model('User', User);