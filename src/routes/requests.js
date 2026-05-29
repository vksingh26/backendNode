
const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const requestRouter = express.Router();

requestRouter.post('request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        const status = req.params.status;
        const allowedStatus = ["ignored", "interested"]

        const validUser = await User.findById(toUserId);
        if (!validUser) {
            return res.status(400).json({
                message: `User ${toUserId} not found`
            })
        }

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: `Invalid status type ${status}`
            })
        }

        const request = new ConnectionRequest({
            senderId: fromUserId,
            receiverId: toUserId,
            status: status
        });
        await request.save();
        res.json({
            message: `${req.user.firstName} is ${status} with ${validUser.firstName}`
        })
    } catch (err) {
        res.json({
            message: 'Error in sending request: ' + err
        });
    }
});

requestRouter.post('request/review/:status/:requestId', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const allowedStatus = ['accepted', 'rejected'];
        const { status, requestId } = req.params;

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: `Invalid status type ${status}`
            })
        }
        const request = await ConnectionRequest.findOne({
            _id: requestId,
            status: 'interested',
            receiverId: loggedInUser._id
        });

        if (!request) {
            return res.status(404).json({
                message: `Request ${requestId} not found`
            })
        }

        if (!request.receiverId.equals(loggedInUser._id)) {
            return res.status(400).json({
                message: `You are not authorized to review this request`
            })
        }

        ConnectionRequest.status = status;
        const data = await ConnectionRequest.save();
        return res.json({
            data,
            message: `Request ${requestId} has been ${status}`
        })
    } catch (err) {
        res.json({
            message: 'Error in reviewing request: ' + err
        });
    }
})

module.exports = requestRouter;