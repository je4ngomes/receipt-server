import mongoose from 'mongoose';

const Receipt = mongoose.model('receipt');
const User = mongoose.model('user');

const receipt = (parent, { id }, { req }) =>
    Receipt.findOne({ _id: id, creator: req.user.id });

const receipts = (parent, args, { req }) => 
    Receipt.find({ creator: req.user.id });

const createReceipt = (parent, { data }, { req }) => {
    console.log(req.user.id);

    return new Receipt({ ...data, creator: req.user.id })
        .save()
        .then(receipt => { 
            User.updateOne({ _id: req.user.id }, { $push: { receipts: receipt.id } })

            return receipt;
        })
        .catch(e => console.error(e));
}

const updateReceipt = (parent, { data }, { req }) => {

};

const deleteReceipt = (parent, { id }, { req }) => {

};

const deleteManyReceipt = (parent, { ids }, { req }) => {

};

export default {
    Query: {
        receipts,
        receipt
    },
    Mutation: {
        createReceipt
    }
};