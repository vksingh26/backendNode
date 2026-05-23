const mongoose = require('mongoose');

const connectionString = 'mongodb+srv://NodeBackedn:lScXBTf6rqskY16F@nodetutorial.c52uwvr.mongodb.net/devtinder';

const connectDB = async () => {
    await mongoose.connect(connectionString, { autoSelectFamily: false });
};

module.exports = connectDB;


