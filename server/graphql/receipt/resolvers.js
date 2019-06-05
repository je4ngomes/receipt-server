import mongoose from 'mongoose';
import { NotFound } from '../errors';
import { GraphQLDate, GraphQLDateTime } from 'graphql-iso-date';

const Receipt = mongoose.model('receipt');
const User = mongoose.model('user');

const receipt = (parent, { id }, { req }) =>
    Receipt.findOne({ _id: id, creator: req.user.id })
        .then(receipt => {
            if (!receipt) return new NotFound('Receipt not found.');

            return receipt;
        });

const receipts = (parent, args, { req }) => {
    console.log(args.startDate)
    return Receipt.find({ creator: req.user.id });
};

const createReceipt = (parent, { data }, { req }) =>
    new Receipt({ ...data, creator: req.user.id })
        .save()
        .then(async receipt => { 
            await User.updateOne({ _id: req.user.id }, { $push: { receipts: receipt.id } })
            return receipt;
        });

const updateReceipt = (parent, { id: _id, data }, { req }) => {
    Receipt.findOneAndUpdate(
        { _id, creator: req.user.id },
        { $set: { ...data } }, { new: true }
    );
}
const deleteReceipt = (parent, { id: _id }, { req }) =>
    Receipt.findOneAndDelete({ _id, creator: req.user.id })
        .then(receipt => {
            User.updateOne({ _id: req.user.id }, { $pull: { receipts: _id } });
            return receipt;
        });

const deleteManyReceipt = (parent, { ids }, { req }) =>
    // Find all matched ids created by logged user
    Receipt.find({ _id: { $in: [...ids] }, creator: req.user.id  })
        .then(docs => {
            // Delete docs one by one
            const deletedDocs = docs.map(async doc => {
                await Receipt.deleteOne({ _id: doc.id });
                // Remove reference id from User document
                await User.updateOne(
                    { _id: req.user.id }, 
                    { $pull: { receipts: doc.id } }
                );
 
                return doc;
            });

            return deletedDocs;
    });

export default {
    Query: {
        receipts,
        receipt
    },
    Mutation: {
        createReceipt,
        updateReceipt,
        deleteReceipt,
        deleteManyReceipt
    },
    Date: GraphQLDate,
    DateTime: GraphQLDateTime
};