const express = require('express');
const router = express.Router();
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
    let user = await User.findOne({ email: req.body.email })
    if (!user) {
        await User.create({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }).then((user) => res.json(user));
    }
    else {
        res.send("A user with the same email id exits")
    }
})
module.exports = router


/**************A file for creating user in model*/
