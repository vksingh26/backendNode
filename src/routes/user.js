const express = require('express');
const { userAuth } = require('../middlewares/auth');
const ConnectionRequestModel = require('../models/connectionRequest');
const userRouter = express.Router();
const USER_DATA = 'firstName lastName age gender photoUrl aboutMe';
userRouter.get('/user/requests/received', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequestModel.find({
            receiverId: loggedInUser._id,
            status: 'interested'
        }).populate('senderId', USER_DATA); //we are population user model data over here, dont forget to put space between the fields


        res.status(200).json({ message: 'Requests fetched successfully', data: connectionRequests })
    } catch (error) {
        return res.status(400).json({ message: error.message || 'Failed to fetch request' });
    }
});

userRouter.get('/user/requests/connections', userAuth, async (req, res) => {
    try {
        const connectionRequests = await ConnectionRequestModel.find({
            $or: [
                { status: 'accepted', senderId: req.user._id },
                { status: 'accepted', receiverId: req.user._id },
            ]
        }).populate('senderId', USER_DATA);

        const data = connectionRequests.map((row) => row.senderId);
        res.status(200).json({ message: 'Connections fetched successfully', data: data });
    }
    catch (error) {
        res.status(400).json({ message: error.message || 'Failed to fetch connections' })
    }
})
module.exports = userRouter;