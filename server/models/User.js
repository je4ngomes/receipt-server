import mongoose from 'mongoose';

const User = mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    company: String,
    recepts: [Recepts]
});

mongoose.model('User', User);