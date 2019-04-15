import mongoose from 'mongoose';

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
    _user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

mongoose.model('Receipt', Receipt);