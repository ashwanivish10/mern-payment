const mongoose = require('mongoose');
const Account = require('../models/accountModel');
const User = require('../models/userModel');
const zod = require('zod');

// --- Input Validation ---
const transferSchema = zod.object({
    to: zod.string(),
    amount: zod.number().positive("Amount must be positive")
});

// --- Controller Functions ---

// GET DASHBOARD DETAILS (USER, BALANCE, HISTORY)
const getDashboardDetails = async (req, res) => {
    try {
        const account = await Account.findOne({ userId: req.userId });
        const user = await User.findById(req.userId).select('-password');

        if (!account || !user) {
            return res.status(404).json({ message: "User or account not found." });
        }

        // Sort history descending by timestamp
        const sortedHistory = account.history.sort((a, b) => b.timestamp - a.timestamp);

        res.json({
            name: user.name,
            upiId: user.upiId,
            balance: account.balance,
            history: sortedHistory
        });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


// TRANSFER FUNDS
const transfer = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { success, data } = transferSchema.safeParse(req.body);
        if (!success) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid input" });
        }

        const { amount, to } = data;
        const senderId = req.userId;

        // 1. Find sender's account
        const senderAccount = await Account.findOne({ userId: senderId }).session(session);
        if (!senderAccount || senderAccount.balance < amount) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Insufficient balance" });
        }

        // 2. Find receiver's user and account
        const receiverUser = await User.findOne({ upiId: to }).session(session);
        if (!receiverUser) {
            await session.abortTransaction();
            return res.status(400).json({ message: "Invalid recipient UPI ID" });
        }
        const receiverAccount = await Account.findOne({ userId: receiverUser._id }).session(session);
        const senderUser = await User.findById(senderId).session(session);


        // 3. Perform the transfer and update history
        const senderBalanceAfter = senderAccount.balance - amount;
        await Account.updateOne({ userId: senderId }, {
            $inc: { balance: -amount },
            $push: { history: { $each: [{ type: 'Sent', amount, partyUpiId: to, balanceAfter: senderBalanceAfter }], $position: 0 } }
        }).session(session);

        const receiverBalanceAfter = receiverAccount.balance + amount;
        await Account.updateOne({ userId: receiverUser._id }, {
            $inc: { balance: amount },
            $push: { history: { $each: [{ type: 'Received', amount, partyUpiId: senderUser.upiId, balanceAfter: receiverBalanceAfter }], $position: 0 } }
        }).session(session);


        // 4. Commit the transaction
        await session.commitTransaction();
        res.json({ message: "Transfer successful" });

    } catch (error) {
        await session.abortTransaction();
        res.status(500).json({ message: "Transaction failed", error: error.message });
    } finally {
        session.endSession();
    }
};

module.exports = {
    getDashboardDetails,
    transfer
};