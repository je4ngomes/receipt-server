import mongoose from 'mongoose';
import autoPopulate from 'mongoose-autopopulate'

const Receipt = mongoose.Schema({
    expiresAt: { type: String, required: true },
    createdAt: { type: String, required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    urlPaymentProof: { type: String },
    from: { type: String, required: true },
    category: { type: String, required: true },
    type: { type: String, required: true },
    paidStatus: { type: Boolean, default: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'user', autopopulate: true }
});

Receipt.plugin(autoPopulate)

mongoose.model('receipt', Receipt);