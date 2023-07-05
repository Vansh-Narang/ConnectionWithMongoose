const express = require('express');
const router = express.Router();
const { check, validationResult }
    = require('express-validator');
const User = require("../User")

router.post("/createUser", [
    check('email', 'Email length should be 10 to 30 characters')
        .isEmail().isLength({ min: 10, max: 30 }),
    check('name', 'Name length should be 10 to 20 characters')
        .isLength({ min: 3, max: 20 }),
    check('password', 'Password length should be 8 to 10 characters')
        .isLength({ min: 4, max: 10 })
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.json(errors)
    }

    try {
        await User.create({
            name: req.body.name,
            password: req.body.password,
            email: req.body.email,
            location: req.body.location
        })
        res.json({ "success": true })
    } catch (error) {
        console.log(error)
        res.json({ error: error })
    }
})
module.exports = router;
