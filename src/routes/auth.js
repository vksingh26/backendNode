const express = require('express');
const bcrypt = require('bcrypt');

const { validateSignUpData } = require('../utils/validation');
const User = require('../models/user');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, email, photoUrl, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            photoUrl: photoUrl,
            password: hashPassword
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(400).send('Error in user registration: ' + err);
    }
});

authRouter.post("/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            throw new Error('Please provide email and password');
        }
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await user.verifyPassword(password); //putting compare password in userSchema because its related to user and we are using this method to verify password of the user
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }

        const token = await user.getJWT(); // putting generate token in userSchema because it related to user and we are using this method to generate token for the user
        res.cookie('token', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).json({ message: 'User signed in successfully' });
    } catch (err) {
        res.status(400).send('Error in user signin: ' + err);
    }
});


authRouter.post('/signout', async (req, res) => {
    try {
        // res.clearCookie('token');
        res
            .cookie('token', null, { expires: new Date(Date.now()) })
            .status(200).json({ message: 'User signed out successfully' });
    } catch (err) {
        res.status(400).send('Error in user signout: ' + err);
    }
})

module.exports = authRouter;
