const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = 'Utsavsecret';
//Create a user using: POST "api/v1/auth/create". Doesn't require Auth
router.post('/create',
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

            //JWT
            let data = {
                user: user.id
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            console.log(data)
            console.log(authToken)
            res.json({ authToken: authToken })

        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error!");
        }
    })

//Login a user using: POST "api/v1/auth/login".
router.post('/login',
    body('email', 'Enter a valid email!').isEmail(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };
        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res.status(400).json({ errors: "Please login with correct credential" });
            }

            //matching the password
            let comparePassword = bcrypt.compareSync(password, user.password);
            if (!comparePassword) {
                return res.status(400).json({ errors: "Please login with correct credential" });
            }

            //JWT
            let data = {
                user: user.id
            }
            const authToken = jwt.sign(data, JWT_SECRET);
            console.log(data)
            console.log(authToken)
            res.json({ authToken: authToken })


        } catch (error) {
            console.log(error);
            return res.status(500).send("Internal Server Error!");
        }
    })

//ROUTE 3:Get loggin details using POST "api/v1/auth/getuser". Login required.
router.post('/getloggeduser', fetchuser, async (req, res) => {
    try {
        let userid = req.user;
        console.log(userid);
        const loggeduser = await User.findOne({ _id: userid }).select("-password");
        if (!loggeduser) {
            res.status(404).send('No valid user logged in')
        }
        res.json(loggeduser)
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error!");
    }
})




module.exports = router