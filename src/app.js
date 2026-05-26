const express = require('express');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const User = require('../src/models/user.js');
const { validateSignUpData } = require('./utils/validation');

const app = express();
app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
    try {
        validateSignUpData(req);
        const { firstName, lastName, email, photoUrl, password } = req.body;
        const hashPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            photoUrl: photoUrl,
            password: hashPassword
        });
        await user.save();
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (err) {
        res.status(400).send('Error in user registration: ' + err);
    }
});


app.post("/signin", async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new Error('Please provide email and password');
        }
        const user = await User.findOne({ email: email });

        if (!user) {
            throw new Error('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        res.status(200).json({ message: 'User signed in successfully' });
    } catch (err) {
        res.status(400).send('Error in user signin: ' + err);
    }
});

app.get("/users", async (req, res) => {
    const userEmail = req.body.email
    try {
        const users = await User.find({ email: userEmail });
        res.status(200).json(users);
    } catch (err) {
        res.status(400).send('Error in fetching users: ' + err);
    }
});

app.get('/feeds', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(400).send('Error in fetching feeds: ' + err);
    }
});

app.delete('/user', async (req, res) => {
    const user = req.body.id
    try {
        const user = await User.findByIdAndDelete(id);
        res.status(200).json({ message: 'User deleted successfully', user });
    } catch (err) {
        res.status(400).send('Error in deleting user: ' + err);
    }
});

app.patch('/user', async (req, res) => {
    const id = req.body.id;
    const data = req.body;
    const ALLOWED_UPDATES = ["name", "password", "avatar", "gender", "age"];
    const isUpdatedAllowed = Object.keys(data).every((key) => ALLOWED_UPDATES.includes(key));

    try {
        if (!isUpdatedAllowed) {
            throw new Error('You can only update the allowed fields');
        }
        const user = await User.findById({ _id: id })
        if (!user) {
            throw new Error('User not found');
        }
        await User.findByIdAndUpdate({ _id: id }, data);
        res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(400).send('Error in updating user: ' + error);
    }
});

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

