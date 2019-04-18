import mongoose from 'mongoose';

import { formatUserAuthPayload, formatUserObj } from '../../middlewares/utils';
import { AuthenticationError } from '../errors';

const User = mongoose.model('user');

const me = (parent, args, { req }) => 
    User.findById(req.user.id).then(formatUserObj);

const signIn = (parent, { data }, ctx) => {
    const { username, password } = data;

    return User.findUserByCredentials(username, password)
        .then(user => {
            if (!user)
                return new AuthenticationError({ message: 'The username or password is incorrect.' });

            return formatUserAuthPayload(user);
        })
        .catch(err => new AuthenticationError({ message: 'Unable to login, Please try again later.' }));
};

const signUp = (parent, { data }, ctx) => {
    return new User(data)
                .save()
                .then(formatUserAuthPayload);
};

const updateUser = (parent, { id: _id, data }, ctx) => {
    return User.findOneAndUpdate(
        { _id }, 
        { $set: { ...data } }, { new: true }
    ).then(formatUserObj);
};

export default {
    Query: {
        me
    },
    Mutation: {
        updateUser,
        signIn,
        signUp
    }
};