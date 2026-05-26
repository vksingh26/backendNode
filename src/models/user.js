const mongoose = require('mongoose');
const validator = require('validator');


const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        min: 4,
        max: 50,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        min: 4,
        max: 50,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email address!');
            }
        }
    },
    photoUrl: {
        type: String,
        trim: true,
        default: 'https://www.clipartmax.com/max/m2i8N4m2A0b1i8G6/',
        validate(value) {
            if (!validator.isURL(value)) {
                throw new Error('Invalid URL');
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        min: 6,
        max: 20,
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
