const { Router } = require('express');
const userController = require('../controller/users');
const { body } = require('express-validator');
const User = require('../models/users');
const authMiddleware = require('../middleware/authmiddleware');
const bcrypt = require("bcrypt");

const router = Router();

router.post('/register',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage("Password must be at least 3 characters long"),
    userController.createUserController
);

router.post('/login',
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage("Password must be at least 3 characters long"),
    userController.loginUserController
);

router.post('/create-staff', authMiddleware, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required" });
        }

        const adminUser = await User.findById(req.user.userId);
        if (!adminUser || adminUser.role !== 'Admin') {
            return res.status(403).json({ message: "Unauthorized access" });
        }

        // Check if the email already exists in staffCredentials
        if (adminUser.staffCredentials.some(staff => staff.email === email)) {
            return res.status(400).json({ message: "Staff email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Push new staff credential into the array
        adminUser.staffCredentials.push({
            email,
            password: hashedPassword
        });

        await adminUser.save();

        res.status(201).json({ message: "Staff credentials added successfully", staff: adminUser.staffCredentials });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error creating staff account" });
    }
});

router.post('/forgot-password' , userController.forgetPassword)
router.get('/get-staffs/:id' , userController.getStaffList)
router.delete('/delete-staff/:userId/:staffId' , userController.getStaffDelete)
router.post('/reset-password/:token' , userController.resetPassword)
module.exports = router;
