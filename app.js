const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();

app.post("/signup", async (req, res) => {
    const userData = {
        firstName: "Srishti",
        lastName: 'Singh',
        age: 25,
        isMarried: true,
        mobile: '8976540321',
        gender: 'Female',
    }

    try {
        const user = new User(userData);
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });

    } catch (err) {
        res.status(400).send('Error in user registration: ' + err);
    }
})

connectDB()
    .then(() => {
        console.log('Database connection successful...');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Error in database connection: ' + err);
    });

