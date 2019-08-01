import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate';

const Category = mongoose.Schema({
    name: { type: String, required: true },
    categoryType: { type: String, required: true },
    createdAt: { type: Date, required: true },
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        autopopulate: true,
        required: true
    }
});

Category.plugin(autoPopulate);

mongoose.model('category', Category);