const express = require('express');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/requests');
const userRouter = require('./routes/user');

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);



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

