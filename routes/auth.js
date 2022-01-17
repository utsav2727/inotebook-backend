const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');


//Create a user using: POST "api/v1/auth/". Doesn't require Auth
router.post('/',
    body('email', 'Enter a valid email!').isEmail(),
    body('name', 'Enter a Valid Name!').isLength({ min: 3 }),
    body('password', 'Password must be 5 character long!').isLength({ min: 5 }),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };
        try {
            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).json({ errors: "Email already Exists!!" });
            }
            //password hasing
            secPassword = req.body.password;
            const salt = await bcrypt.genSaltSync(10);
            const hashPassword = await bcrypt.hashSync(secPassword, salt);

            //create user through model
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hashPassword,
            })
            res.json(user)

        } catch (error) {
            console.log(error)
        }
    })



module.exports = router