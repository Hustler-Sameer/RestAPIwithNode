const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const User = require('../models/users');
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

router.put('/signup', [
    check('email').isEmail().withMessage('Please enter a valid email')
        .custom((value, { req }) => {
            return User.findOne({ email: value }).then(userDoc => {
                if (userDoc) {
                    return Promise.reject('Email address already exists');
                }
            })
        }
        ).normalizeEmail(),
    check('password').trim().isLength({ min: 5 }),
    check('name').trim().not().isEmpty(),

], authController.signup);

router.post('/login', authController.login)

router.get('/status', isAuth, authController.getUserStatus);

router.patch('/status', isAuth, [
    check('status').trim().not().isEmpty()
], authController.updateUserStatus)

module.exports = router;