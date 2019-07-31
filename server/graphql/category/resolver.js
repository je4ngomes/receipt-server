import mongoose from 'mongoose';
import { NotFound } from '../errors';
import { GraphQLDate } from 'graphql-iso-date';

const Category = mongoose.model('category');
const User = mongoose.model('user');

const category = (parent, { id }, { req }) =>
    Category.findOne({ _id: id, creator: req.user.id })
        .then(category => {
            if (!category) return new NotFound('Category not found.');

            return category;
        });

const categories = (parent, { currentPag, limit , categoryType }, { req }) => {
    const conditions = { 
        categoryType,
        creator: req.user.id
    };
    const query = {
        skip: limit * (currentPag - 1),
        limit
    };

    return Category.find(conditions, {}, query);
};

const createCategory = (parent, { data }, { req }) =>
    new Category({ 
        ...data, 
        creator: req.user.id, 
        createdAt: new Date()
    })
        .save()
        .then(async category => { 
            await User.updateOne({ _id: req.user.id }, { $push: { categories: category.id } });

            return category;
        });

const updateCategory = (parent, { id: _id, data }, { req }) => {
    Category.findOneAndUpdate(
        { _id, creator: req.user.id },
        { $set: { ...data } }, { new: true }
    );
};

const deleteCategory = (parent, { id: _id }, { req }) =>
    Category.findOneAndDelete({ _id, creator: req.user.id })
        .then(async category => {
            await User.updateOne({ _id: req.user.id }, { $pull: { categories: _id } });
            
            return category;
        });

const deleteManyCategory = (parent, { ids }, { req }) =>
    // Find all matched ids created by logged user
    Category.find({ _id: { $in: [...ids] }, creator: req.user.id  })
        .then(docs => {
            // Delete docs one by one
            const deletedDocs = docs.map(async doc => {
                await Category.deleteOne({ _id: doc.id });
                // Remove reference id from User document
                await User.updateOne(
                    { _id: req.user.id }, 
                    { $pull: { categories: doc.id } }
                );
 
                return doc;
            });

            return deletedDocs;
    });

export default {
    Query: {
        categories,
        category
    },
    Mutation: {
        createCategory,
        updateCategory,
        deleteCategory,
        deleteManyCategory
    },
    Date: GraphQLDate
};