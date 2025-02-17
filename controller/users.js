const { validationResult } = require('express-validator');
const User = require('../models/users.js');

const createUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('Email and Password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await User.hashPassword(password);

    const user = await User.create({
        email,
        password: hashedPassword,
    });
    return user;
};

const createUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await createUser(req.body);
        const token = await user.generateJWT();

        res.status(201).json({ success: true, user , token });
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
};

const loginUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ errors: 'Invalid Credentials' });
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(401).json({ errors: 'Invalid Credentials' });
        }

        const token = await user.generateJWT();
        res.status(200).json({ user , token});
    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
};

module.exports = {
    createUserController,
    loginUserController,
    createUser,
};
