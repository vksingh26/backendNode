const jwt = require('jsonwebtoken');
const User = require('../models/user');

userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        console.log('token : : :', token)
        if (!token) {
            throw new Error('Unauthorized!');
        }
        const decodedToken = jwt.verify(token, 'DEV@Tinder$90');
        const { _id } = decodedToken;
        const user = await User.findById(_id);
        console.log('user : : :', user)
        if (!user) {
            throw new Error('User not found!');
        }
        req.user = user;
        next();
    }
    catch (error) {
        res.status(400).json({ message: 'Invalid token!' });
    }

};

module.exports = { userAuth };
