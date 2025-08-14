const zod = require('zod');
const User = require('../models/userModel');
const Account = require('../models/accountModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- Input Validation Schemas ---
const signupSchema = zod.object({
    name: zod.string(),
    email: zod.string().email(),
    password: zod.string().min(6)
});

const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string()
});

// --- Controller Functions ---

// SIGN UP
const signup = async (req, res) => {
    const { success, data } = signupSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ message: "Incorrect inputs" });
    }

    const existingUser = await User.findOne({ email: data.email });
    if (existingUser) {
        return res.status(411).json({ message: "Email already taken" });
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const username = data.name.split(' ')[0].toLowerCase();
    const upiId = `${username}${Date.now().toString().slice(-4)}@upi`;

    const user = await User.create({
        name: data.name,
        email: data.email,
        password: hashedPassword,
        upiId: upiId,
    });

    // Create account with initial balance and welcome transaction
    const initialBalance = 10000;
    await Account.create({
        userId: user._id,
        balance: initialBalance,
        history: [{
            type: 'Received',
            amount: initialBalance,
            partyUpiId: 'system@welcome',
            balanceAfter: initialBalance,
        }]
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({
        message: "User created successfully",
        token: token
    });
};

// SIGN IN
const signin = async (req, res) => {
    const { success, data } = signinSchema.safeParse(req.body);
    if (!success) {
        return res.status(411).json({ message: "Incorrect inputs" });
    }

    const user = await User.findOne({ email: data.email });
    if (!user || !(await bcrypt.compare(data.password, user.password))) {
        return res.status(411).json({ message: "Error while logging in" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token: token });
};

module.exports = { signup, signin };