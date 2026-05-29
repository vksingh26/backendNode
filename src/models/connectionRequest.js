const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //reference to the user collection or model
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: { values: ['pending', 'accepted', 'rejected', 'interested'], message: `{value} is an invalid status` },
        required: true
    }
}, { timestamps: true });

connectionRequestSchema.index({ senderId: 1, receiverId: 1 }); //this is called compound index
connectionRequestSchema.pre('save', async function (next) {
    const connectionRequest = this;
    if (connectionRequest.senderId.equals(connectionRequest.receiverId)) {
        throw new Error('You cannot send request to yourself');
    }
    const requestExists = await ConnectionRequestModel.findOne({
        $or: [
            { senderId: connectionRequest.senderId, receiverId: connectionRequest.receiverId },
            { senderId: connectionRequest.receiverId, receiverId: connectionRequest.senderId }
        ]
    });
    if (requestExists) {
        throw new Error('Request already exists');
    }
    next();
})

const ConnectionRequestModel = mongoose.model('ConnectionRequest', connectionRequestSchema);

module.exports = ConnectionRequestModel;