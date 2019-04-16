import mongoose from 'mongoose';

const User = mongoose.model('user');

const me = (parent, { id }, ctx) => {
    const { password, ...userInfo } = User.findById(id);

    return userInfo;
};

const signIn = (parent, args, ctx) => {

};

const updateUser = (parent, { id: _id, ...args }, ctx) => {
    return User.updateOne({ _id }, { $set: { ...args } }).save();
};

export default {
    Query: {
        
    },
    Mutation: {
        updateUser
    }
};