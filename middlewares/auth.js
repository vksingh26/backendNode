const adminAuth = (req, res, next) => {

    console.log("This is admin authentication middleware");
    const token = 'abc';
    const isTokenValid = token === 'abc';
    if (isTokenValid) {
        next();
    } else {
        res.send('You are not authorized');
    }
};

userAuth = (req, res, next) => {
    console.log("This is user authentication middleware");
    next();
};

module.exports = { adminAuth, userAuth };
