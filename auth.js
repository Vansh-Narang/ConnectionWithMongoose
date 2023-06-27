const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const JWT_SECRET = 'Harryisagood';
var jwt = require('jsonwebtoken');
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
router.post('/createuser', [
    body('name', "Enter the valid name").isLength({ min: 3 }),
    body('email', "Enter the valid password").isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    //Check user already exists
    try {
        let user = await User.findOne({ email: req.body.email })
        if (user) {
            return res.status(400).json({ errors: "Sorry a user with email already exists" });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword
        })
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        // console.log(jwtData);


        res.json({ authToken });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("some error occured")
    }
})

//Authenticate a user Login
router.post('/login', [
    body('email', "Enter the valid password").isEmail(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email })

        if (!user) {
            return res.status(400).json({ errors: "User not found" })
        }

        const passwordCmp = await bcrypt.compare(password, user.password);
        if (!passwordCmp) {
            return res.status(400).json({ errors: "Pass not correct" })
        }
        const data = {
            user: {
                id: user.id,
            }
        }
        const authToken = jwt.sign(data, JWT_SECRET)
        res.json({ authToken });

    } catch (error) {
        console.log(error)
        res.status(400).json({ errors: "Error signing" })
    }
})

module.exports = router
