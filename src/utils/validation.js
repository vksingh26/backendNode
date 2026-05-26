const validator = require('validator');

const validateSignUpData = (req) => {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName) {
        throw new Error('Name is required');
    }

    if (!email) {
        throw new Error('Email is required');
    }

    if (!password) {
        throw new Error('Password is required');
    }

    if (!validator.isEmail(email)) {
        throw new Error('Invalid email address');
    }

    if (!validator.isStrongPassword(password, {
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    })) {
        throw new Error('Invalid password');
    }

}

module.exports = {
    validateSignUpData
}