const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    type: { type: String, enum: ['Sent', 'Received'], required: true },
    amount: { type: Number, required: true },
    partyUpiId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    balanceAfter: { type: Number, required: true },
});

const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    },
    history: [transactionSchema]
});

const Account = mongoose.model('Account', accountSchema);

module.exports = Account;