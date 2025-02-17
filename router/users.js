const { Router } = require('express');
const userController = require('../controller/users');
const { body } = require('express-validator');

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

module.exports = router;
