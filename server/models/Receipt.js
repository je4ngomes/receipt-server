import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate'

const Receipt = mongoose.Schema({
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    urlPaymentProof: { type: String },
    from: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    paidStatus: { type: Boolean, default: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: true }
});

Receipt.plugin(autoPopulate)

mongoose.model('receipt', Receipt);