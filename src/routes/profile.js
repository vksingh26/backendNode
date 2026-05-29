const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { validateEditProfileData } = require('../utils/validation');
const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).json(user);
    }
    catch (err) {
        res.status(400).send('Error in fetching profile: ' + err);
    }
});

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        if (!validateEditProfileData(req)) {
            throw new Error('Invalid fields');
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            loggedInUser[key] = req.body[key];
        });
        await loggedInUser.save();
        res.status(200).json({ message: `${loggedInUser.firstName}, your profile has beenupdated successfully` });
    } catch (err) {
        res.status(400).send('Error in editing profile: ' + err);
    }
})

//write password update ednpoint.

module.exports = profileRouter;