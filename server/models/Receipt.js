import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate'

const Receipt = mongoose.Schema({
    expires_date: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true },
    receiptType: { type: String, required: true },
    isPaid: { type: String, required: true },
    category: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'category', 
        required: true,
        autopopulate: true
    },
    creator: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'user',
        required: true, 
        autopopulate: true, 
    }
});

Receipt.plugin(autoPopulate);

mongoose.model('receipt', Receipt);