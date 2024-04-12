const express = require ('express');
const router = express.Router();
const {check} = require('express-validator');
const User = require('../models/users');
const authController = require('../controllers/auth');

router.put('/signup' , [
    check('email').isEmail().withMessage('Please enter a valid email')
    .custom((value , {req}) => {
            return User.findOne({email: value}).then(userDoc => {
                if(userDoc){
                    return Promise.reject('Email address already exists');
                }
            })
        }
    ).normalizeEmail(),
    check('password').trim().isLength({min:5}),
    check('name').trim().not().isEmpty(),

], authController.signup);

module.exports = router;