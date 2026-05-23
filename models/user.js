const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true,
    },
    age: {
        type: String,
        required: true
    },
    isMarried: {
        type: Boolean,
        required: false
    },
    mobile: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
