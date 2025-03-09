const { validationResult } = require('express-validator');
const User = require('../models/users.js');
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer")
const jwt = require("jsonwebtoken");

const createUser = async ({ email, password }) => {
    if (!email || !password) {
        throw new Error('Email and Password are required');
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new Error('User already exists');
    }

    const hashedPassword = await User.hashPassword(password);

    const userFind = await User.create({
        email,
        password: hashedPassword,
    });
    return userFind;
};

const createUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const userFind = await createUser(req.body);
        const token = await userFind.generateJWT();

        res.status(201).json({ success: true, userFind, token });
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

        const userFind = await User.findOne({
            $or: [
                { email: email },
                { 'staffCredentials.email': email }
            ]
        }).select('+password +staffCredentials.password');

        if (!userFind) {
            return res.status(401).json({ errors: "Invalid Credentials" });
        }

        let isMatch = false;
        let user = {};
        let role = userFind.role;

        if (userFind.email === email) {
            // Admin login
            isMatch = await userFind.isValidPassword(password);

            user = {
                user: {
                    _id: userFind._id,
                    email: userFind.email,
                    role: userFind.role,
                    firstName: userFind.firstName,
                    lastName: userFind.lastName
                },
                token: await userFind.generateJWT()
            };
        } else {
            // Staff login
            const staffCredential = userFind.staffCredentials.find(staff => staff.email === email);
            if (staffCredential) {
                isMatch = await bcrypt.compare(password, staffCredential.password);
                role = 'staff';

                user = {
                    user: {
                        email: staffCredential.email,
                        role,
                        _id: userFind._id,
                        firstName: userFind.firstName,
                        lastName: userFind.lastName,
                    },
                    token: await userFind.generateJWT()
                };
            }
        }

        if (!isMatch) {
            return res.status(401).json({ errors: "Invalid Credentials" });
        }

        res.status(200).json(user);

    } catch (e) {
        res.status(400).json({ success: false, message: e.message });
    }
};

const forgetPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({
        $or: [
            { email: email },
            { "staffCredentials.email": email }
        ]
    });

    if (!user) {
        return res.status(401).json({ errors: "Invalid Credentials" });
    }

    // Check if it's a staff email
    const isStaff = user.staffCredentials.some(staff => staff.email === email);

    const token = jwt.sign(
        { id: user._id, email, isStaff },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "aqsashamshad2005@gmail.com",
            pass: process.env.EMAIL_PASS
        }
    });

    const resetURL = `https://avera-stock-back-end.vercel.app/reset-password/${token}`;

    await transporter.sendMail({
        from: "aqsashamshad2005@gmail.com",
        to: email,
        subject: "Password Reset",
        text: `You are receiving this because you requested a password reset.\n\n
        Please click on the link to reset your password:\n\n
        ${resetURL}\n\n
        If you did not request this, ignore this email.\n`,
    });

    res.json({ message: "Password reset link sent to email" });
};


const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const { id, email, isStaff } = decoded;

        const user = await User.findById(id);
        if (!user) {
            return res.status(400).json({ message: "Invalid token" });
        }

        const hashedPassword = await User.hashPassword(password);

        if (isStaff) {
            // Find the staff member and update their password
            const staffIndex = user.staffCredentials.findIndex(staff => staff.email === email);
            if (staffIndex === -1) {
                return res.status(400).json({ message: "Invalid token" });
            }
            user.staffCredentials[staffIndex].password = hashedPassword;
        } else {
            // Update admin password
            user.password = hashedPassword;
        }

        await user.save();

        res.json({ message: "Password updated successfully" });
    } catch (error) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }
};

const getStaffList = async (req, res) => {
    const { id } = req.params; 

    try {
        const user = await User.findById(id)
            .select("staffCredentials email role");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.staffCredentials || user.staffCredentials.length === 0) {
            return res.status(404).json({ message: "No staff found for this user" });
        }

        // Extract staff credentials
        const staffList = user.staffCredentials.map(staff => ({
            staffId: staff._id, 
            email: staff.email,

            role: "staff"
        }));

        res.status(200).json({ success: true, staff: staffList });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


const getStaffDelete = async (req, res) => {
    const { userId, staffId } = req.params; // Get userId and staffId from URL params

    try {
        // Find user by userId
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Check if staff member exists
        const staffExists = user.staffCredentials.some(staff => staff._id.toString() === staffId);
        if (!staffExists) {
            return res.status(404).json({ success: false, message: "Staff member not found" });
        }

        // Remove the staff member from staffCredentials
        user.staffCredentials = user.staffCredentials.filter(staff => staff._id.toString() !== staffId);

        // Save updated user document
        await user.save();

        res.status(200).json({ success: true, message: "Staff deleted successfully", user });
    } catch (error) {
        console.error("Error deleting staff:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};








module.exports = {
    createUserController,
    loginUserController,
    createUser,
    forgetPassword,
    resetPassword,
    getStaffList,
    getStaffDelete
};
