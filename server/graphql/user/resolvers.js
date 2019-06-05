import mongoose from 'mongoose';

import { formatUserAuthPayload } from '../../utils/utils';
import { AuthenticationError } from '../errors';

const User = mongoose.model('user');

const me = (parent, args, { req }) => 
    User.findById(req.user.id);

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

const updateUser = (parent, { data }, { req }) =>
    User.findOneAndUpdate(
        { _id: req.user.id }, 
        { $set: { ...data } }, { new: true }
    );

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