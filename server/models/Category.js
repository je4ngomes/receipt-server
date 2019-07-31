import mongoose from 'mongoose';

const Category = mongoose.Schema({
    name: { type: String, required: true },
    categoryType: { type: String, required: true },
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        autopopulate: true,
        required: true
    }
});

Category.plugin(autoPopulate);

mongoose.model('category', Category);