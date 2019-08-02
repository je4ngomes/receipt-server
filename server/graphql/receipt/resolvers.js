import mongoose from 'mongoose';
import { withFilter } from 'graphql-yoga';
import { NotFound } from '../errors';
import { GraphQLDate } from 'graphql-iso-date';

const Receipt = mongoose.model('receipt');
const User = mongoose.model('user');

const receipt = (parent, { id }, { req }) =>
    Receipt.findOne({ _id: id, creator: req.user.id })
        .then(receipt => {
            if (!receipt) return new NotFound('Receipt not found.');

            return receipt;
        });

const receipts = (parent, { currentPag, limit, startDate, endDate, receiptType }, { req }) => {
    const conditions = (
        startDate &&
        endDate &&
        receiptType
    ) ? ({ 
        receiptType,
        createdAt: {
            $gte: startDate,
            $lt: endDate
        }
    }) : {};
    
    const query = {
        skip: limit * (currentPag - 1),
        limit
    };

    return Promise.all([
        Receipt.find({ ...conditions, creator: req.user.id }, {}, query),
        Receipt.countDocuments({ ...conditions, creator: req.user.id })
    ]).then(([nodes, total]) => { nodes, total });
};

const createReceipt = (parent, { data }, { req }) =>
    new Receipt({ 
        ...data, 
        creator: req.user.id, 
        createdAt: new Date()
    })
        .save()
        .then(async doc => { 
            await User.updateOne({ _id: req.user.id }, { $push: { receipts: doc.id } });
            
            return doc;
        });

const updateReceipt = (parent, { id: _id, data }, { req }) => (
    Receipt.findOneAndUpdate(
        { _id, creator: req.user.id },
        { $set: { ...data } }, { new: true }
    )
);

const deleteReceipt = (parent, { id: _id }, { req }) =>
    Receipt.findOneAndDelete({ _id, creator: req.user.id })
        .then(doc => {
            User.updateOne({ _id: req.user.id }, { $pull: { receipts: _id } });
            
            return doc;
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

            return { nodes: deletedDocs, total: deletedDocs.length };
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
    Date: GraphQLDate
};