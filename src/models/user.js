const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


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
    age: {
        type: Number,
        min: 18,
        max: 99,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        enum: { values: ['male', 'female', 'other'], message: '{value} is an invalid gender' },
        trim: true,
    },
    aboutMe: {
        type: String,
        trim: true,
        max: 500,
    },
    email: {
        type: String,
        required: true,
        unique: true, //this will create indexing automatically in mongodb, if unique is not there we have to manually create index using 'index:true'
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

userSchema.index({ firstName: 1, lastName: 1 });
userSchema.methods.verifyPassword = async function (userEnteredPassword) {
    const user = this;
    const passwordHash = user.password;
    return await bcrypt.compare(userEnteredPassword, passwordHash);
}
userSchema.methods.getJWT = async function () {
    const user = this;
    return await jwt.sign({ _id: user._id }, 'DEV@Tinder$90', { expiresIn: '1d' });
}
module.exports = mongoose.model('User', userSchema);
